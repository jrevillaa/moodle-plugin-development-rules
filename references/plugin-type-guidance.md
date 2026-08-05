# Plugin Type Guidance

Use the plugin type to narrow the expected structure before making changes.

## local

Prefer `local` only for site-wide custom behavior that does not fit a more specific plugin type. Avoid turning `local` plugins into generic dumping grounds for unrelated features.

Must-check:

- Correct capabilities and context for every page, AJAX, export, and external function
- Navigation/settings placement that matches the feature scope
- Whether the feature should actually be `report`, `tool`, `enrol`, or another type

Mini case:

- Wrong: use a `local` plugin as a catch-all for reports, UI widgets, integrations, and unrelated business rules.
- Preferred: keep `local` for truly site-wide custom behavior and call out when the feature belongs to a more specific plugin type.

## mod

Treat activity modules as course-facing products with stronger expectations around capabilities, completion, backup/restore, events, grading-related integration where applicable, and user flows.

Must-check:

- Backup/restore structure for activity and related data
- Module capabilities in the activity context
- Events for meaningful state changes
- Completion/grading integration when the activity claims those behaviors
- Privacy provider coverage for user data

## block

Keep blocks lightweight. Avoid expensive synchronous work during block rendering. Cache carefully and keep output concise.

Must-check:

- No heavy DB or remote calls during every render
- Cache only with explicit invalidation
- Capability checks for any privileged block content or actions

## report

Assume report plugins may deal with large datasets. Prioritize filtering, pagination, sorting, exports, and strong access checks from the start.

Must-check:

- Paginated, sortable, filterable queries
- Export endpoints reuse the same access checks and filters
- DB API chosen for the real query shape

Mini case:

- Wrong: load every row with a broad fetch and render one huge table directly in PHP.
- Preferred: validate filters, use the appropriate DB API, paginate, sort, and render through Moodle-native table or renderer flow.

Mini case:

- Wrong: export unfiltered data with no capability boundary because the report page already hides the button.
- Preferred: reuse the validated filters and enforce the same capability checks on the export endpoint itself.

## theme

Keep theme logic focused on presentation, templates, assets, and theme-specific settings. Avoid pushing unrelated domain logic into the theme layer.

Must-check for Moodle 5.x:

- Boost + Bootstrap 5.3 conventions (`data-bs-*`, modern utilities)
- SCSS organized through Moodle theme phases
- Template overrides in the theme template path
- Theme settings that affect CSS reset the relevant theme caches
- No domain/business rules hidden inside the theme

## auth and enrol

Be especially strict with security, lifecycle hooks, user state changes, and compatibility. Authentication and enrolment flows are high-risk integration points.

Must-check:

- Capability and context boundaries on every privileged action
- Safe handling of user state changes and failure recovery
- Compatibility with the target Moodle branch before adopting new APIs

## admin tool

Design admin tools with clear capabilities, safe actions, bulk-operation controls, and predictable long-running task handling.

Must-check:

- Admin capability checks and sesskey on state-changing actions
- Bulk or expensive work moved to scheduled/adhoc tasks when appropriate
- Clear confirmation and error reporting for destructive operations

Mini case:

- Wrong: run heavy maintenance actions synchronously from one admin page without task handling.
- Preferred: protect the action with the right capability, confirm intent, and move expensive work to scheduled or adhoc tasks when appropriate.

## Moodle 5.x Overlay

Regardless of plugin type, when the target is Moodle 5.x:

- Default UI assumptions to Boost and Bootstrap 5.3
- Prefer `classes/external/` for new web services
- Confirm PHP 8.2+ syntax safety before modernizing PHP
- Re-read [moodle5-platform.md](./moodle5-platform.md) and [moodle5-theme-and-ui.md](./moodle5-theme-and-ui.md)

## General Rule

If the current plugin type is being used as a shortcut for a feature that belongs elsewhere, call that out as a design issue.
