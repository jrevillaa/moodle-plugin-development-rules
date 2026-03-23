# Plugin Type Guidance

Use the plugin type to narrow the expected structure before making changes.

## local

Prefer `local` only for site-wide custom behavior that does not fit a more specific plugin type. Avoid turning `local` plugins into generic dumping grounds for unrelated features.

Mini case:

- Wrong: use a `local` plugin as a catch-all for reports, UI widgets, integrations, and unrelated business rules.
- Preferred: keep `local` for truly site-wide custom behavior and call out when the feature belongs to a more specific plugin type.

## mod

Treat activity modules as course-facing products with stronger expectations around capabilities, completion, backup/restore, events, grading-related integration where applicable, and user flows.

## block

Keep blocks lightweight. Avoid expensive synchronous work during block rendering. Cache carefully and keep output concise.

## report

Assume report plugins may deal with large datasets. Prioritize filtering, pagination, sorting, exports, and strong access checks from the start.

Mini case:

- Wrong: load every row with a broad fetch and render one huge table directly in PHP.
- Preferred: validate filters, use the appropriate DB API, paginate, sort, and render through Moodle-native table or renderer flow.

Mini case:

- Wrong: export unfiltered data with no capability boundary because the report page already hides the button.
- Preferred: reuse the validated filters and enforce the same capability checks on the export endpoint itself.

## theme

Keep theme logic focused on presentation, templates, assets, and theme-specific settings. Avoid pushing unrelated domain logic into the theme layer.

## auth and enrol

Be especially strict with security, lifecycle hooks, user state changes, and compatibility. Authentication and enrolment flows are high-risk integration points.

## admin tool

Design admin tools with clear capabilities, safe actions, bulk-operation controls, and predictable long-running task handling.

Mini case:

- Wrong: run heavy maintenance actions synchronously from one admin page without task handling.
- Preferred: protect the action with the right capability, confirm intent, and move expensive work to scheduled or adhoc tasks when appropriate.

## General Rule

If the current plugin type is being used as a shortcut for a feature that belongs elsewhere, call that out as a design issue.
