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

## Add Only The Context Users Need

Operational views that are not settings pages should still explain their purpose when it is not self-evident. Keep the primary explanation to one or two short translated sentences.

For ambiguous form controls:

- name the real Moodle concept in the label, such as course start date
- use `addHelpButton()` for field-specific details and exclusions
- explain inclusive date behavior where relevant
- avoid generic labels such as only “From” and “To”

For icon-driven row actions:

- use Moodle output helpers such as `action_icon()`
- provide an accessible label that names the action and, when useful, the referenced row
- add a compact legend only when several repeated symbols or states need explanation

Put secondary detail in help popups or a translated `<details>` section. Do not replace missing context with a long inline information wall.

## Review Heuristics

Flag the implementation if you see:

- A form assembled mostly with echoed HTML
- Complex page sections built inline in PHP
- Rendering logic mixed with record fetching and mutation
- Repeated markup without a template
- Ambiguous filters that do not identify the real Moodle field
- Icon actions with no accessible action meaning
- Large information blocks where field help or secondary detail would be clearer

## Remediation Language

Use wording like:

- "Replace this hand-built form with a `moodleform` subclass."
- "Prepare data in PHP and move the markup to a Mustache template."
- "Introduce a renderer or output object so the page logic stops emitting HTML directly."
- "Use a precise Form API label and help button to explain that this filter uses `course.startdate`."
- "Give this row icon an accessible label that explains the action and target."
