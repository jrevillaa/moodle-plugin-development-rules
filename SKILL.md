---
name: moodle-plugin-development-rules
description: Moodle plugin development standards and review rules for implementing or refactoring Moodle plugins using Moodle-native patterns. Use when Codex works on Moodle plugin code such as local, mod, block, report, admin tool, enrol, auth, question, theme, availability, repository, or similar plugin types; when editing PHP, Mustache, JS, renderer, or form code in a Moodle codebase; or when reviewing code for Moodle-specific anti-patterns such as direct JavaScript requires instead of AMD modules, hand-built HTML forms instead of Form API, and view markup echoed from PHP instead of Mustache templates and renderers.
---

# Moodle Plugin Development Rules

## Overview

Apply Moodle-native implementation patterns before writing or reviewing code. Prefer platform APIs and established plugin architecture over ad hoc PHP, HTML, or JavaScript.

Start by identifying the subsystem being touched: page output, forms, JavaScript, navigation, access, data, strings, or rendering. Then choose the closest Moodle abstraction and implement through it instead of assembling raw output manually.

## Core Workflow

1. Inspect the plugin type and nearby conventions before changing code.
2. Reuse Moodle APIs first: Form API, output renderers, Mustache templates, string API, capability checks, DB API, and AMD JavaScript.
3. Reject framework-level anti-patterns even if they are faster to type.
4. Keep presentation out of business logic whenever Moodle provides a rendering layer.
5. Follow existing Moodle naming, file placement, and page setup conventions in the target plugin.

## Initial Validation

When the user asks to review, audit, validate, modernize, or improve a Moodle plugin, start with a compliance pass before proposing implementation details.

Validate whether the plugin already follows the rules in this skill across:

- Architecture and file placement
- Hooks, callbacks, tasks, and observers
- Strings and language pack usage
- Capabilities, context, and request security
- Form API, renderers, and Mustache
- AMD JavaScript and browser behavior
- DB API, SQL choices, pagination, filtering, and exports
- Version compatibility and upgrade paths
- External APIs, privacy, files, backup/restore, cache, and tests

If the plugin violates any rule, report the issue, explain the Moodle-native replacement, and classify the recommendation by criticity.

## Criticity Levels

Use exactly these three levels when reporting findings:

### Critical

Use for security, authorization, privacy, data integrity, broken upgrade paths, invalid external API exposure, or patterns likely to fail in production or violate Moodle core expectations materially.

Typical examples:

- Missing capability or context checks
- Unsafe request handling
- Invalid file or privacy handling
- Version-incompatible API usage
- Schema changes outside upgrade flow

### Major

Use for architectural, performance, maintainability, or framework-compliance problems that are not immediately dangerous but should be fixed before the code is considered solid.

Typical examples:

- Hand-built forms instead of Form API
- Echoed complex views instead of Mustache and renderers
- Wrong placement of external API code
- Large tables without pagination, sorting, or filtering
- Poor DB API choice for the query shape

### Minor

Use for lower-risk improvements that still increase consistency, readability, reuse, and Moodle alignment.

Typical examples:

- Hardcoded strings that should move to `get_string()`
- Weak variable or function naming
- Missing helper extraction for repeated domain logic
- Missing low-risk test coverage additions

## Decision Rules

When the task involves plugin architecture, hooks, callbacks, file layout, naming, constants, classes, or helper boundaries, read [architecture-and-naming.md](./references/architecture-and-naming.md).

When the task involves settings pages, plugin config, navigation, URLs, icons, or safe output composition, read [navigation-settings-and-output.md](./references/navigation-settings-and-output.md).

When the task involves capabilities, access checks, user data, CSRF, context, or secure page handling, read [capabilities-and-security.md](./references/capabilities-and-security.md).

When the task involves user interaction in the browser, read [frontend-and-js.md](./references/frontend-and-js.md).

When the task involves form creation, validation, or submission handling, read [forms-and-rendering.md](./references/forms-and-rendering.md).

When the task involves page output, view composition, tables, cards, or templated UI, read [forms-and-rendering.md](./references/forms-and-rendering.md).

When the task involves persistence, performance, exports, Moodle version compatibility, upgrade steps, or large result sets, read [data-performance-and-upgrades.md](./references/data-performance-and-upgrades.md).

When the task involves web services, mobile support, or external functions, read [webservices-and-external-api.md](./references/webservices-and-external-api.md).

When the task involves events, observers, hooks, adhoc tasks, scheduled tasks, cache, or asynchronous processing, read [events-tasks-and-cache.md](./references/events-tasks-and-cache.md).

When the task involves privacy, personal data, file handling, draft areas, backup/restore, or data lifecycle concerns, read [privacy-files-and-backup.md](./references/privacy-files-and-backup.md).

When the task involves test coverage, fixtures, generators, PHPUnit, Behat, or regression-proofing, read [testing-and-quality.md](./references/testing-and-quality.md).

Use [review-checklist.md](./references/review-checklist.md) when auditing code or preparing a PR review.

## Non-Negotiable Rules

Do not hardcode user-facing text. Use `get_string()` and plugin language packs for labels, headings, buttons, validation messages, notifications, and template strings.

Do not skip capability and context checks on pages, actions, AJAX endpoints, external functions, or exports. Check access explicitly and early.

Do not load custom JavaScript by directly requiring raw files from PHP output. Implement AMD modules under `amd/src/` and invoke them through Moodle's AMD loading mechanism.

Do not construct real forms with ad hoc `echo "<form>..."` output. Use Moodle Form API with `moodleform` unless the target surface is explicitly not a Form API use case.

Do not embed substantial HTML views directly inside PHP with concatenated `echo` calls. Move view markup to Mustache templates and route rendering through renderer classes or output classes where appropriate.

Do not place new external service implementations in legacy `externallib.php` when the target Moodle version and codebase support `classes/external/`. Prefer the namespaced class-based structure.

Do not assume small datasets. For list screens, design for pagination, sorting, filtering, and scalable queries by default.

Do not choose database APIs mechanically. Prefer the simplest Moodle DB API that fits the access pattern, and use SQL-based methods such as `get_records_sql()` when filtering, joining, sorting, aggregating, or paginating would make simpler APIs inefficient or misleading.

Do not add plugin behavior that ignores supported Moodle version boundaries, upgrade paths, privacy obligations, or testability.

Do not mix data loading, permission logic, and markup generation in one procedural block when Moodle offers separate APIs for those concerns.

## Expected Output Style

When implementing code, explain decisions in Moodle terms: which core API was chosen, why it fits, and which anti-pattern was avoided.

When reviewing code, call out violations explicitly and propose the Moodle-native replacement.

When the request is an audit or validation, present findings grouped by criticity in this order: Critical, Major, Minor.

For each finding, include:

- The rule being violated
- Why it matters in Moodle terms
- The recommended Moodle-native remediation

If no findings are discovered, say so explicitly and mention any residual risks or test gaps.

Prefer concrete remediation guidance such as:

- "Move this callback or integration point to the proper hook or Moodle callback location."
- "Replace hardcoded text with `get_string()` entries in the language pack."
- "Move this browser behavior into `amd/src/...` and load it with `js_call_amd()`."
- "Replace this hand-built form with a `moodleform` subclass."
- "Replace echoed markup with a renderer plus Mustache template."
- "Add the missing context and capability checks before processing this action."
- "Use the more appropriate DB API here; this query shape calls for SQL-based retrieval."
- "Refactor this list screen to use paginated, sortable, filterable Moodle-native table output."
- "Move this external API code to `classes/external/...` and declare the service cleanly."
- "Add PHPUnit or Behat coverage for this behavior before merging."
- "Check the plugin's supported Moodle versions before adopting this API."

## References

- [architecture-and-naming.md](./references/architecture-and-naming.md): Hooks, callbacks, folder layout, naming, constants, helpers, and code organization.
- [navigation-settings-and-output.md](./references/navigation-settings-and-output.md): Admin settings, URLs, navigation, icons, escaping, and page output rules.
- [capabilities-and-security.md](./references/capabilities-and-security.md): Context resolution, capabilities, login checks, security boundaries, and safe request handling.
- [frontend-and-js.md](./references/frontend-and-js.md): AMD rules, browser-side behavior, page requirements, and JS review guidance.
- [forms-and-rendering.md](./references/forms-and-rendering.md): Form API, Mustache templates, renderer usage, and output separation rules.
- [data-performance-and-upgrades.md](./references/data-performance-and-upgrades.md): DB API, pagination, exports, version support, upgrades, and performance rules.
- [webservices-and-external-api.md](./references/webservices-and-external-api.md): External functions, service structure, validation, and return contracts.
- [events-tasks-and-cache.md](./references/events-tasks-and-cache.md): Events, observers, tasks, hooks, and caching rules.
- [privacy-files-and-backup.md](./references/privacy-files-and-backup.md): Privacy API, file API, draft areas, and backup/restore concerns.
- [testing-and-quality.md](./references/testing-and-quality.md): PHPUnit, Behat, generators, fixtures, and regression rules.
- [review-checklist.md](./references/review-checklist.md): Fast audit checklist for PR review or code generation validation.
