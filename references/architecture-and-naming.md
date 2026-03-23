# Architecture And Naming

## Follow Moodle Plugin Structure

Inspect the plugin type first and place code where Moodle expects it. Prefer established plugin entrypoints, callbacks, classes, and namespaced locations over dumping logic into a single file.

Use the plugin's existing conventions if they are already aligned with Moodle core practices. When the local code is inconsistent, move new code toward Moodle-native structure instead of copying the inconsistency.

## Prefer Hooks And Official Integration Points

Use hooks, callbacks, observers, scheduled tasks, privacy providers, renderers, and other official extension points when the requirement is lifecycle-driven or framework-integrated.

Prefer a hook or callback when:

- The behavior depends on a Moodle lifecycle event
- The code is integrating with navigation, output, login, course lifecycle, events, or background execution
- The code would otherwise require invasive edits in procedural page code

Avoid inventing custom bootstrap logic when Moodle already provides an integration point.

## Use Language Strings Always

Never hardcode user-facing text in PHP, Mustache, JavaScript config, or forms if it belongs in the language pack.

Use `get_string()` for:

- Headings and labels
- Button text
- Validation errors
- Notifications
- Column titles
- Empty states
- Export names when user-facing

Keep string identifiers predictable and scoped to the plugin.

## Naming Rules

Choose names that are explicit, lower ambiguity, and fit Moodle/PHP conventions already used by the project.

Prefer:

- Variables that describe domain meaning, not type alone
- Functions named by behavior
- Constants named by stable intent
- Helpers named by responsibility, not convenience

Avoid:

- `$data`, `$item`, `$obj`, `$tmp` when a clearer name exists
- Functions like `process()` or `handle()` without domain context
- Constants that encode business meaning unclearly
- Generic `utils` or `helpers` buckets that become dumping grounds

## Variables

Use short names only for obvious loop counters or framework-standard variables. Otherwise prefer names that reveal scope and meaning, such as course, context, filters, exportformat, or records.

Avoid reusing the same variable for different semantic roles through a long procedure.

## Functions

Create small functions around a single responsibility. A function should usually either:

- Resolve or validate inputs
- Fetch or transform data
- Build output data for rendering
- Perform one state-changing action

Avoid functions that fetch data, enforce access, mutate records, and render HTML all at once.

## Constants

Create constants only for stable repeated values or domain limits that should not be duplicated.

Prefer constants for:

- Status values
- Export modes
- Batch sizes
- Hard limits
- Known identifiers reused in multiple places

Do not create constants for one-off literal values with no reuse or no domain meaning.

Keep constants scoped appropriately. Prefer class constants when the value belongs to a class responsibility; use broader scope only when the constant is truly plugin-wide.

## Helpers

Create helper classes only when there is a cohesive reusable responsibility. A helper is justified when multiple call sites need the same domain operation and the logic does not belong more naturally in a renderer, form, external class, task, or output object.

Avoid:

- A single catch-all helper class
- Helpers that mix DB access, formatting, access control, and rendering
- Stateless wrappers around one line of code that add no abstraction value

Prefer domain-specific helpers such as export builders, query builders, capability resolvers, or mappers when those responsibilities are reused.
