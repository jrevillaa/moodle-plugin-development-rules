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
