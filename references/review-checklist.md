# Review Checklist

Use this checklist when generating code, reviewing a patch, or preparing feedback.

## Architecture

- Is the code placed in the correct plugin location and subsystem?
- Does it use Moodle hooks, callbacks, tasks, observers, or providers where appropriate?
- Are helper classes cohesive instead of generic dumping grounds?
- Are variables, functions, and constants named clearly and with domain meaning?
- Are user-facing strings sourced from `get_string()` instead of hardcoded text?

## Capabilities And Security

- Is the correct context resolved before access checks?
- Are `require_login()` and capability checks applied wherever needed?
- Are actions, exports, AJAX endpoints, and external functions protected server-side?
- Are request parameters validated through Moodle-native boundaries?

## Navigation Settings And Output

- Are plugin settings implemented through Moodle admin settings where appropriate?
- Are internal links built with `moodle_url`?
- Are icons, actions, and notifications using Moodle output helpers?
- Are output boundaries explicit and safe?

## JavaScript

- Is custom browser behavior implemented as an AMD module?
- Is the module loaded through Moodle's page requirements APIs instead of a raw file include?
- Is inline script generation avoided?

## Forms

- Does any non-trivial user input flow use `moodleform`?
- Are validation and defaults handled through Form API rather than ad hoc POST parsing?
- Is the form structure maintainable without echoed HTML blocks?

## Rendering

- Is substantial markup moved out of procedural PHP?
- Does Mustache own the view structure for non-trivial UI?
- Is a renderer or output class preparing template data cleanly?

## Data And Performance

- Does any list or table assume there may be many records?
- Are pagination, sorting, and filtering implemented where growth is likely?
- Are DB queries focused, parameterized, and separated from rendering?
- Is the chosen DB method appropriate, or should it use SQL-based retrieval such as `get_records_sql()`?
- Does export code reuse validated filters and access checks?
- Is Moodle version compatibility checked before using version-sensitive APIs?
- Are install or schema changes routed through Moodle upgrade mechanisms?

## Web Services

- Is new external API code placed under `classes/external/` when supported?
- Are parameters, capabilities, and return structures defined explicitly?
- Is business logic kept outside the transport layer?

## Events Tasks And Cache

- Does the behavior belong in an observer, hook, scheduled task, or adhoc task?
- Is expensive work removed from request-time flow when possible?
- Does any introduced cache have a clear invalidation strategy?

## Privacy Files And Backup

- Does the feature introduce personal data obligations under the Privacy API?
- Are uploaded or managed files handled through Moodle File API?
- Does the change require backup/restore review for the plugin type?

## Testing

- Does the change include appropriate PHPUnit or Behat coverage?
- Are generators or fixtures used to keep setup maintainable?
- Are capability, pagination, export, and contract regressions covered where relevant?

## Separation Of Concerns

- Are data access, permission checks, form handling, and markup rendering clearly separated?
- Does the implementation reuse Moodle APIs before introducing custom plumbing?

## Review Output Style

Report findings as Moodle-specific rules, not generic style opinions.

Prefer:

- "This should be an AMD module."
- "This should use Form API."
- "This should render through Mustache and a renderer."

Avoid vague feedback like:

- "Needs cleanup."
- "Could be more MVC."
