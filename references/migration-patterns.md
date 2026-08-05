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
8. Preserve required observable behavior from the reference implementation when rewriting a working flow.
9. Add tests around the modernized behavior, including parity and failure scenarios.
10. Finish with the Release Gate checklist before staging or consumer handoff.

## Legacy To Modern Examples

Legacy:

- Page scripts that fetch data, process actions, and emit HTML in one file
- Inline script tags or direct JS file loading
- `externallib.php` used for new service development without compatibility reason
- Full-record loading for large table screens
- Queue writers and readers using different tables or status meanings
- Upgrade steps that call mutable plugin services

Modern:

- Page/controller setup plus renderer/output separation
- AMD modules loaded through Moodle page requirements
- Namespaced external classes
- Query shapes designed for filtering, sorting, and pagination
- One documented persistence/status contract across the full workflow
- Self-contained historical upgrade steps verified against the target Moodle branch

## Migration Strategy

Prefer incremental modernization when the codebase is large:

1. Fix Critical security and compatibility issues first.
2. Prove parity for the critical domain workflow before expanding UI features.
3. Move UI and form anti-patterns to Moodle-native abstractions.
4. Improve data access and performance.
5. Add regression tests.
6. Apply the Release Gate before declaring the rewrite ready.

Avoid large refactors that change every layer at once unless the user explicitly wants a broader rewrite.
