# Frontend And JavaScript

## Prefer Moodle AMD Modules

Implement custom JavaScript as AMD modules under `amd/src/`. Treat direct inclusion of arbitrary JavaScript files as a code smell unless the codebase already uses a justified legacy exception that cannot be changed safely.

Prefer this pattern:

1. Create a module in `amd/src/<name>.js`.
2. Build the distributable according to the project's Moodle workflow when needed.
3. Invoke the module from PHP with Moodle's AMD loader, typically through `$PAGE->requires->js_call_amd(...)`.

Avoid these patterns:

- Requiring a raw JS file directly from PHP output.
- Printing inline `<script>` blocks for feature code.
- Mixing DOM selectors and business rules into PHP string output.

## Keep Browser Logic In JavaScript

Use PHP to provide page setup, capability checks, URLs, strings, and structured data. Use AMD modules to attach events and manipulate the DOM.

Pass only the data the module needs. Do not serialize large chunks of HTML into JavaScript when a template or endpoint is the better boundary.

## Use Moodle Page Setup Correctly

Set up the page with Moodle APIs before rendering:

- Configure URL, context, title, heading, layout, and capability checks in PHP.
- Queue required strings or module initialization through Moodle page requirements APIs.
- Keep rendering order coherent: header, content, footer.

## Review Heuristics

Flag the implementation if you see any of the following:

- PHP code loading browser behavior from a plain file path instead of an AMD entrypoint.
- Inline scripts generated with `echo`.
- HTML carrying complex behavior without a corresponding AMD module.
- JavaScript depending on markup that should have been templated more explicitly.

## Remediation Language

Use wording like:

- "Move this behavior into `amd/src/<module>.js` and call it via Moodle's AMD loader."
- "Keep PHP responsible for context and data; keep DOM behavior in the AMD module."
- "Avoid direct JS file requires here because Moodle expects modular browser code."
