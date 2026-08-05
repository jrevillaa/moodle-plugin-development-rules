# Anti-Patterns And Fixes

Use short "wrong / preferred" examples when the user benefits from concrete comparison.

## JavaScript Loading

Wrong:

- Load a raw JS file directly from PHP output or print inline script blocks.

Preferred:

- Create `amd/src/<module>.js` and load it through Moodle's AMD page requirements API.

## Forms

Wrong:

- Build `<form>` markup manually with echoed HTML for a real input workflow.

Preferred:

- Use a `moodleform` subclass with validation, defaults, and processing through Form API.

## Views

Wrong:

- Concatenate complex cards, rows, tables, or dashboards with `echo`.

Preferred:

- Prepare data in PHP and render the markup through Mustache and renderer/output classes.

## Strings

Wrong:

- Hardcode headings, labels, notifications, and button text.

Preferred:

- Put user-facing text in the language pack and retrieve it with `get_string()`.

## Access Control

Wrong:

- Hide an action in the UI but skip the server-side capability check.

Preferred:

- Resolve the correct context and enforce the capability before processing the action.

## DB Access

Wrong:

- Use a simplistic record fetch for a joined, paginated, sorted report query.

Preferred:

- Use the SQL-based DB API that matches the query shape, such as `get_records_sql()`.

## Web Services

Wrong:

- Add new external service logic to `externallib.php` by default.

Preferred:

- Place new external API code under `classes/external/` when the supported Moodle version allows it.

## Large Tables

Wrong:

- Render all rows and hope the dataset stays small.

Preferred:

- Assume growth and implement pagination, sorting, and filtering from the start.

## Moodle 5.x UI

Wrong:

- Ship Bootstrap 4 attributes/utilities (`data-toggle`, `ml-*`, `text-left`, `hidden`) on a Moodle 5.x target.

Preferred:

- Use Bootstrap 5.3 / Boost patterns (`data-bs-*`, `ms-*`, `text-start`, `visually-hidden`) and Mustache/theme overrides.

## Events And Observers

Wrong:

- Duplicate cross-cutting side effects in every page, form, and external function.

Preferred:

- Trigger a domain event and handle shared reactions in observers.

## Cache

Wrong:

- Cache derived data with no delete/purge on write paths.

Preferred:

- Define the cache intentionally and invalidate it on every relevant mutation.

## Adhoc Versus Scheduled Work

Wrong:

- Block a request with expensive one-off processing, or force one-off work into a scheduled task.

Preferred:

- Queue adhoc tasks for deferred one-off work; use scheduled tasks for recurrent jobs.

## Task Progress And Manual Run

Wrong:

- Offer Execute / Run for a chained web-service pipeline and leave the browser spinning with no stage output, or ship a task with no `mtrace` between steps.

Preferred:

- Run the pipeline in a task, narrate each stage with `mtrace()`, and for manual runs stream task output then show a return action like core `tool_task`.

## Backup And Restore

Wrong:

- Store course/activity domain data without reviewing backup/restore obligations.

Preferred:

- Implement the backup/restore structure expected by the plugin type so data survives restore and course copy.

## Upgrade Steps

Wrong:

- Call a newly introduced plugin service or status constant from `db/upgrade.php`.

Preferred:

- Keep historical upgrade steps self-contained with XMLDB, parameterized DML/SQL, literal legacy values, and config APIs.

## Core API And Schema Verification

Wrong:

- Guess a plausible core method or database column name.

Preferred:

- Verify the method in the target core branch and inspect the real schema before writing operational SQL.

## Queue And Status Workflows

Wrong:

- Let enqueue, task, and report code drift onto different table names or numeric status meanings.

Preferred:

- Trace the workflow end to end and use one documented persistence/status contract.

## External Retries And Tokens

Wrong:

- Assume service registration grants every token access, or resend overlapping delivery windows without acknowledgement state.

Preferred:

- Verify the real service/token wiring and make delivery idempotent.

## Outbound HTTP Query Strings

Wrong:

- Call `http_build_query($params)` for curl/API URLs and let Moodle's `&amp;` separator leak onto the wire.

Preferred:

- Call `http_build_query($params, '', '&')` and smoke-check the exact request URL for literal `&`.

## Fat Entrypoints

Wrong:

- Read params, query, mutate records, and echo markup in one page script block.

Preferred:

- Keep params/context/capability/output in the entrypoint and delegate domain work to `classes/`.

## Conditional Nesting

Wrong:

- Wrap the main behavior in nested `if`/`else` layers for invalid, missing, and unauthorized cases.

Preferred:

- Handle those cases first with guard clauses, then run the main path unnested.

## Scattered Special Cases

Wrong:

- Thread mode/boolean flags and one-off branches through shared functions and renderers.

Preferred:

- Give each behavior one owner and dispatch explicitly.

## Duplicated Domain Logic

Wrong:

- Copy the same query or rule into page, task, CLI, and external function.

Preferred:

- Extract one canonical operation and call it from every entrypoint.

## Queries In Loops

Wrong:

- Fetch a related record, context, or remote payload once per row.

Preferred:

- Preload with `get_in_or_equal()` or a join, aggregate in SQL, and iterate in memory.

## File Sprawl

Wrong:

- Keep appending unrelated functions to `locallib.php` past a thousand lines.

Preferred:

- Split by responsibility into autoloaded classes under `classes/`.

## Contextual Operational UI

Wrong:

- Label date filters only “From/To”, show unlabeled row icons, or add a large information wall.

Preferred:

- Use precise Form API labels/help, accessible icon actions, and a short lead or compact legend only where needed.

## Admin Pages And Breadcrumbs

Wrong:

- Ship an admin tool page without `admin_externalpage` registration / `admin_externalpage_setup()`, or leave shared pages without a visible breadcrumb path.

Preferred:

- Admin-only screens: register `admin_externalpage` and call `admin_externalpage_setup()`.
- Shared screens: set context/URL/layout and build `$PAGE->navbar` with the real path; do not rely on Site administration tabs for non-admin roles.
