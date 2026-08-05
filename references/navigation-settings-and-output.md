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

## Set Up Admin Pages And Breadcrumbs

Distinguish Site-administration-only pages from pages other roles can open.

For admin-only custom screens:

- Register an `admin_externalpage` in `settings.php` with a stable page name, translated title, canonical `moodle_url`, and capability
- Call `admin_externalpage_setup('pagename')` near the top of the PHP page
- Keep the registered URL and `$PAGE->set_url()` aligned so admin breadcrumbs and the active admin section resolve
- Prefer `admin_settingpage` when the screen is ordinary config settings; use `admin_externalpage` for custom operational screens

For shared or course-scoped pages:

- Do not depend on Site administration tabs; non-admin roles will not see them
- Resolve context, require login/capability, set layout/title/heading, and build a visible breadcrumb path with `$PAGE->navbar->add(...)` or Navigation API nodes
- The breadcrumb must show the real parent path for every role that can open the page

Breadcrumbs are mandatory orientation, not optional chrome. See rule `ui-admin-setup-and-breadcrumbs`.

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
- Admin custom pages missing `admin_externalpage` registration or `admin_externalpage_setup()`
- Empty, hidden, or invented breadcrumbs on pages other roles can open
- Shared pages that assume Site administration tabs will orient non-admin users
- Internal URLs built by concatenating strings
- Raw HTML for actions or icons where Moodle output helpers exist
- Output safety depending on assumptions rather than explicit boundaries

## Remediation Language

Use wording like:

- "Move this configuration into Moodle admin settings."
- "Register this screen as an `admin_externalpage` and call `admin_externalpage_setup()`."
- "Build a visible breadcrumb path with `$PAGE->navbar`; non-admins will not see admin tabs."
- "Build this route with `moodle_url` instead of string concatenation."
- "Use Moodle output helpers here instead of hand-built action markup."
