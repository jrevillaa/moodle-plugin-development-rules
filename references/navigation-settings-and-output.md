# Navigation Settings And Output

## Use Plugin Settings Structure Correctly

Define plugin settings in the expected Moodle locations and APIs. Do not invent ad hoc settings storage or configuration screens when the plugin should integrate with Moodle admin settings.

Prefer:

- `settings.php` for admin-configurable plugin settings when the plugin type supports it
- Clear setting names scoped to the plugin
- Language strings for all labels and descriptions

Avoid:

- Hardcoded configuration literals when they should be admin-configurable
- Mixed direct config reads and custom storage with no clear reason

## Use Moodle URLs And Navigation APIs

Build links and redirects with `moodle_url` and related Moodle mechanisms. Do not assemble internal URLs by string concatenation.

Use navigation extension points when the feature needs to appear in Moodle navigation or administration structures. Avoid injecting arbitrary links directly into rendered HTML when an official navigation location exists.

## Use Safe Output Composition

Keep output safe and explicit:

- Escape where the relevant Moodle output pattern expects it
- Use renderer and template boundaries rather than concatenated raw output
- Use Moodle output helpers for icons, actions, notifications, and URLs

Do not trust raw data just because it came from the database.

## Use Native Output Helpers

Prefer Moodle-native helpers such as `pix_icon`, renderer methods, action objects, and output components instead of manually composing icon HTML or action markup.

## Review Heuristics

Flag the implementation if you see:

- Settings implemented outside normal Moodle admin settings patterns
- Internal URLs built by concatenating strings
- Raw HTML for actions or icons where Moodle output helpers exist
- Output safety depending on assumptions rather than explicit boundaries

## Remediation Language

Use wording like:

- "Move this configuration into Moodle admin settings."
- "Build this route with `moodle_url` instead of string concatenation."
- "Use Moodle output helpers here instead of hand-built action markup."
