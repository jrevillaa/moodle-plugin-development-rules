# Forms And Rendering

## Use Form API For Real Forms

When the feature collects or validates user input, build it with Moodle Form API instead of assembling `<form>` markup manually.

Prefer Form API when the page includes:

- Input fields, selects, editors, checkboxes, or file elements
- Validation rules
- Submit or cancel flows
- Sticky values or redisplay after validation failure

Typical direction:

1. Create or update a `moodleform` subclass.
2. Define fields in `definition()`.
3. Add validation and defaults using Form API hooks.
4. Process submitted data through the form object rather than raw `$_POST` handling.

Avoid these patterns:

- `echo "<form ...>"` for non-trivial forms
- Manual CSRF/token handling when Form API already covers the use case
- Validation implemented only in ad hoc controller code

## Use Mustache And Renderers For Views

Render non-trivial UI through Moodle's output system. Use Mustache templates for markup and renderer or output classes to prepare data.

Prefer this separation:

1. PHP application logic loads records, performs checks, and prepares template data.
2. Renderer or output classes shape the data for presentation.
3. Mustache templates own the final markup structure.

Avoid these patterns:

- Long sequences of `echo` statements that build cards, tables, panels, lists, or dashboards
- HTML concatenation mixed with DB queries or permission checks
- Repeated fragments that should live in a reusable template

## When Echo Is Acceptable

Small wrappers or clearly trivial output may still use direct output methods, especially when following existing local conventions. Do not force a template for a one-line message if it makes the code worse.

The threshold is pragmatic:

- Simple: a short notification or wrapper can stay direct.
- Structured or repeated: move it to Mustache and renderer flow.
- Input handling: use Form API.

## Review Heuristics

Flag the implementation if you see:

- A form assembled mostly with echoed HTML
- Complex page sections built inline in PHP
- Rendering logic mixed with record fetching and mutation
- Repeated markup without a template

## Remediation Language

Use wording like:

- "Replace this hand-built form with a `moodleform` subclass."
- "Prepare data in PHP and move the markup to a Mustache template."
- "Introduce a renderer or output object so the page logic stops emitting HTML directly."
