---
name: moodle-plugin-development-rules
description: Moodle-first plugin engineering and release-safety rules for AI agents auditing, implementing, modernizing, or reviewing Moodle plugins. Use when working on local, mod, block, report, admin tool, enrol, auth, question, theme, availability, repository, or similar plugin types; when editing PHP, Mustache, AMD/JS, renderer, form, external API, upgrade, privacy, backup, task, queue, outbound HTTP, or theme/SCSS code; when targeting Moodle 5.x Boost/Bootstrap 5.3 UI; or when preventing Moodle anti-patterns and release failures such as invented core APIs, fragile upgrades, http_build_query amp; separators, inconsistent tables/statuses, raw JS, hand-built forms, weak service-token wiring, or unpaginated reports.
---

# Moodle Plugin Development Rules

## Overview

Apply Moodle-native patterns before writing or reviewing plugin code. Prefer Moodle APIs and plugin architecture over ad hoc PHP, HTML, or JavaScript. Use generic PHP guidance only when it reinforces Moodle conventions and the target branch's PHP matrix.

For Moodle 5.x work, treat Boost and Bootstrap 5.3 as the UI baseline, confirm PHP 8.2+ compatibility for Moodle 5.0+, and prefer current class-based external APIs, Mustache/renderers, and AMD modules.

Identify the subsystem first: access, forms, rendering, JavaScript, data, external APIs, outbound HTTP clients, tasks/events/cache, privacy/files/backup, theme/UI, or tests. Then implement through the closest Moodle abstraction.

Keep context cheap: follow [context-loading.md](./references/context-loading.md). Prefer `SKILL.md` → [rules-index.md](./references/rules-index.md) → only the needed `rules/` and reference files. Do not load `AGENTS.md` unless the user explicitly asks for the full compiled catalog.

## When To Apply

- Writing, refactoring, auditing, or modernizing Moodle plugin code
- Building forms, pages, templates, renderers, AMD modules, reports, or admin tools
- Creating or hardening web services, outbound HTTP clients, hooks, tasks, observers, settings, or upgrades
- Doing Moodle 5.x theme, Boost, Bootstrap 5.3, SCSS, or template-override work
- Reviewing privacy, file, backup/restore, cache, or scenario-based test coverage
- Closing any Moodle plugin change that will be upgraded, staged, integrated, or handed to consumers

## Rule Categories By Priority

| Priority | Category | Impact | Prefix |
| --- | --- | --- | --- |
| 1 | Capabilities and security | Critical | `security-` |
| 2 | Version compatibility and upgrades | Critical | `compat-` |
| 3 | Forms, rendering, Moodle 5 UI, and output | High | `ui-` |
| 4 | JavaScript and frontend behavior | High | `amd-` |
| 5 | Data access, SQL choice, and scalability | High | `data-` |
| 6 | Web services and external APIs | Medium-High | `external-` |
| 7 | Events, tasks, cache, and async work | Medium | `async-` |
| 8 | Privacy, files, and backup/restore | Medium | `lifecycle-` |
| 9 | Structure, maintainability, helpers, and naming | High | `arch-` |
| 10 | Accessibility, i18n, and testing | Medium | `quality-` |

Formal rules live in `rules/`. Supporting depth lives in `references/`. Read only the references needed for the current task.

## Operating Modes

Choose one mode, then load the matching starter references. **Release Gate is always active** after implementation, migration, or claimed completion: it is not optional, only proportionate.

| Mode | When | Read first |
| --- | --- | --- |
| Audit | review, audit, validate, inspect, harden | [plugin-review-workflow.md](./references/plugin-review-workflow.md), [quick-triage.md](./references/quick-triage.md) |
| Fix | implement or refactor | [anti-patterns-and-fixes.md](./references/anti-patterns-and-fixes.md), matching topic reference |
| Migration | modernize legacy Moodle code | [migration-patterns.md](./references/migration-patterns.md), [moodle5-platform.md](./references/moodle5-platform.md) |
| Theme/UI | Moodle 5.x visuals, Boost, SCSS, overrides | [moodle5-theme-and-ui.md](./references/moodle5-theme-and-ui.md), rule `ui-moodle5-theme` |

Every mode ends with the proportionate Release Gate from [release-gate-checklist.md](./references/release-gate-checklist.md).

### Core Workflow

1. Inspect plugin type and nearby conventions.
2. Reuse Moodle APIs first: access, Form API, renderers, Mustache, strings, DB API, AMD, external API, tasks.
3. For Moodle 5.x UI, default to Boost + Bootstrap 5.3 patterns.
4. Reject framework anti-patterns even when faster to type.
5. Check target Moodle/PHP matrix before modern PHP syntax or new APIs.
6. For outbound HTTP, force literal `&` query separators; never send Moodle's HTML `&amp;` on the wire.
7. Report or fix in priority order: Critical → Major → Minor.
8. Always close with a proportionate Release Gate: mark each relevant check Verified, Not applicable, or Not verified. Never claim readiness for checks that were not run.

### Proportionate Release Gate

Scale the gate to the change:

- Tiny string/UI-only change: static integrity + targeted smoke of the touched view
- Data/workflow change: full producer → DB → task → final-state smoke
- Upgrade/schema change: self-contained upgrade + staging upgrade path
- External/outbound HTTP change: literal `&` URL check + consumer-equivalent request
- Token/service change: service membership + authenticated smoke request

## Initial Validation

For audit, validation, modernization, or improvement requests, run a compliance pass before deep implementation advice. Cover:

- Architecture, hooks, callbacks, tasks, observers, and cache invalidation
- Structural health: entrypoint thinness, conditional depth, duplicated logic, loop cost, file size
- Capabilities, context, sesskey, and request security
- Form API, Mustache, renderers, AMD, and Moodle 5 UI/theme patterns when relevant
- DB API choice, pagination, filtering, exports, and upgrades
- Upgrade self-containment plus verification of core methods and installed schema
- Persistence flow consistency across UI/API → database → task → final state
- External API contracts, outbound HTTP query separators, idempotency, service exposure, and token/service wiring
- Privacy, files, backup/restore, and tests for success plus failure scenarios
- Contextual guidance for ambiguous filters, icon actions, exclusions, and destructive operations

Classify every finding as Critical, Major, or Minor. A plugin may work and still fail this skill if it ignores Moodle-native architecture, scalability, accessibility, security, or Moodle 5 UI expectations.

## Criticity Levels

### Critical

Security, authorization, privacy, data integrity, broken upgrades, invalid external exposure, outbound HTTP query corruption, or production-breaking Moodle violations.

### Major

Architecture, performance, maintainability, spaghetti growth, duplicated domain logic, per-row queries, fat entrypoints, missing backup/restore for course data, Bootstrap 4-on-Moodle-5 UI, weak forms/rendering, or unscalable tables.

### Minor

Hardcoded strings, naming, low-risk helper cleanup, or modest test gaps.

Use [findings-examples.md](./references/findings-examples.md) for wording. Use [review-checklist.md](./references/review-checklist.md) for PR-style audits.

## Topic Routing

Read [routing.md](./references/routing.md) for the full map. Minimum routes:

| Topic | Read |
| --- | --- |
| Which formal rule to open | [rules-index.md](./references/rules-index.md) |
| Context cost / what not to load | [context-loading.md](./references/context-loading.md) |
| Plugin type / layout / helpers | [plugin-type-guidance.md](./references/plugin-type-guidance.md), [architecture-and-naming.md](./references/architecture-and-naming.md) |
| Spaghetti / duplication / fat entrypoints / heavy loops / file sprawl | [maintainability-and-structure.md](./references/maintainability-and-structure.md) |
| PHP syntax / PHPCS / PSR tension | [php-best-practices.md](./references/php-best-practices.md), [coding-style-and-phpcs.md](./references/coding-style-and-phpcs.md) |
| Moodle 5.x platform or UI | [moodle5-platform.md](./references/moodle5-platform.md), [moodle5-theme-and-ui.md](./references/moodle5-theme-and-ui.md) |
| Access / security | [capabilities-and-security.md](./references/capabilities-and-security.md) |
| Forms / Mustache / output | [forms-and-rendering.md](./references/forms-and-rendering.md) |
| JS / AMD | [frontend-and-js.md](./references/frontend-and-js.md) |
| DB / upgrades / scale | [data-performance-and-upgrades.md](./references/data-performance-and-upgrades.md) |
| External APIs / outbound HTTP | [webservices-and-external-api.md](./references/webservices-and-external-api.md) |
| Events / tasks / cache | [events-tasks-and-cache.md](./references/events-tasks-and-cache.md) |
| Privacy / files / backup | [privacy-files-and-backup.md](./references/privacy-files-and-backup.md) |
| A11y / i18n / tests | [accessibility-and-i18n.md](./references/accessibility-and-i18n.md), [testing-and-quality.md](./references/testing-and-quality.md) |
| Always-on release validation | [release-gate-checklist.md](./references/release-gate-checklist.md) |

## Non-Negotiable Rules

- Use `get_string()` for user-facing text.
- Enforce context and capabilities early on pages, actions, AJAX, externals, and exports.
- Load browser logic via AMD (`amd/src/` + `js_call_amd()`), not raw JS requires.
- Use Form API for real input workflows; Mustache/renderers for non-trivial views.
- Prefer `classes/external/` for new external APIs when the target Moodle version supports it.
- Design list/report screens for pagination, sorting, and filtering.
- Choose DB APIs by query shape; put schema/capability evolution in upgrade paths.
- Keep upgrade steps self-contained; do not call mutable classes from the same plugin.
- Verify core methods and schema fields in the target Moodle branch instead of inferring names.
- Trace queue/workflow persistence from entrypoint through task to final state, using one status contract.
- Gate PHP modernizations by the Moodle/PHP support matrix.
- Keep PSR/SOLID subordinate to Moodle APIs and file layout.
- Keep entrypoints thin, use guard clauses instead of deep nesting, and give each behavior one owner.
- Keep one canonical implementation per domain operation; do not copy logic across entrypoints.
- Never query, build contexts, or call remote services once per row inside a loop.
- Decompose files by responsibility before they sprawl past a healthy size.
- For Moodle 5.x UI, use Boost/Bootstrap 5.3 patterns (`data-bs-*`, modern utilities), not Bootstrap 4 defaults.
- Review Privacy API, File API, backup/restore, events/observers, and cache invalidation when the feature creates those obligations.
- Make retried external deliveries idempotent and verify real service/token access before handoff.
- For outbound HTTP query strings, call `http_build_query($params, '', '&')`; never send Moodle's HTML `&amp;` separator to an API.
- Give operational views concise contextual help for ambiguous fields and icon actions; avoid information walls.
- Cover non-trivial behavior with success and failure scenarios.
- Always finish with a proportionate Release Gate; never claim release readiness for checks that were not actually run.

## Expected Output Style

Explain decisions in Moodle terms. On audits, group Critical → Major → Minor. For each finding include the violated rule, why it matters in Moodle, and the Moodle-native fix. Prefer short wrong/preferred comparisons.

After Fix, Migration, Theme/UI, or claimed completion, include a short Release Gate summary with Verified / Not applicable / Not verified items.

Concrete remediation examples:

- "Add context and capability checks before this action."
- "Move this markup to Mustache and render through a renderer."
- "Replace Bootstrap 4 attributes with Bootstrap 5.3 `data-bs-*` utilities for Moodle 5.x."
- "Queue this one-off heavy work in an adhoc task; keep recurrent work in a scheduled task."
- "Trigger an event and handle the cross-cutting reaction in an observer."
- "Define cache invalidation on every write path before keeping this cache."
- "Add backup/restore support so this course data survives restore and course copy."
- "Check the plugin's Moodle/PHP matrix before adopting this syntax."
- "Keep this upgrade step self-contained instead of calling the plugin's new service class."
- "Verify this method in the target Moodle core before using it in an upgrade."
- "Explain that this filter uses `course.startdate` through the field label or help popup."
- "Keep this page thin and move the domain work into `classes/`."
- "Handle the failure cases first with guard clauses so this nesting disappears."
- "Extract one canonical operation instead of duplicating this query per entrypoint."
- "Preload these records in one query instead of querying inside the loop."
- "Pass `'&'` to `http_build_query()` so the outbound API URL does not contain `&amp;`."

## References

- [context-loading.md](./references/context-loading.md): What to load and what not to load
- [rules-index.md](./references/rules-index.md): Compact formal-rule catalog
- [routing.md](./references/routing.md): Full topic → reference map
- [release-gate-checklist.md](./references/release-gate-checklist.md): Always-on proportionate handoff gate
- [moodle5-platform.md](./references/moodle5-platform.md): Moodle 5.x platform baseline
- [moodle5-theme-and-ui.md](./references/moodle5-theme-and-ui.md): Boost, Bootstrap 5.3, SCSS, overrides
- [php-best-practices.md](./references/php-best-practices.md): Moodle-filtered PHP guidance and version matrix
- [plugin-type-guidance.md](./references/plugin-type-guidance.md): Must-check guidance by plugin type
- [maintainability-and-structure.md](./references/maintainability-and-structure.md): Strict structure lens for spaghetti, duplication, loops, and file sprawl
- [plugin-review-workflow.md](./references/plugin-review-workflow.md), [quick-triage.md](./references/quick-triage.md), [review-checklist.md](./references/review-checklist.md), [findings-examples.md](./references/findings-examples.md)
- Remaining topic guides under `references/` and formal rules under `rules/`
