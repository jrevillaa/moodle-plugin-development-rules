# Migration Patterns

Use this file when modernizing older Moodle plugin code.

## Common Modernization Priorities

1. Replace hardcoded strings with language pack entries and `get_string()`.
2. Replace raw or directly required JavaScript with AMD modules.
3. Replace hand-built forms with `moodleform`.
4. Replace complex echoed HTML with Mustache and renderer flow.
5. Add missing context and capability checks.
6. Move legacy external API code toward `classes/external/` when supported.
7. Replace non-scalable list rendering with paginated, filterable, sortable table handling.
8. Add tests around the modernized behavior.

## Legacy To Modern Examples

Legacy:

- Page scripts that fetch data, process actions, and emit HTML in one file
- Inline script tags or direct JS file loading
- `externallib.php` used for new service development without compatibility reason
- Full-record loading for large table screens

Modern:

- Page/controller setup plus renderer/output separation
- AMD modules loaded through Moodle page requirements
- Namespaced external classes
- Query shapes designed for filtering, sorting, and pagination

## Migration Strategy

Prefer incremental modernization when the codebase is large:

1. Fix Critical security and compatibility issues first.
2. Move UI and form anti-patterns to Moodle-native abstractions.
3. Improve data access and performance.
4. Add regression tests.

Avoid large refactors that change every layer at once unless the user explicitly wants a broader rewrite.
