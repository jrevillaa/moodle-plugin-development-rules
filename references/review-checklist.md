# Review Checklist

Use this checklist when generating code, reviewing a patch, or preparing feedback.

## Architecture

- Is the code placed in the correct plugin location and subsystem?
- Does it use Moodle hooks, callbacks, tasks, observers, or providers where appropriate?
- Are helper classes cohesive instead of generic dumping grounds?
- Are variables, functions, and constants named clearly and with domain meaning?
- Are user-facing strings sourced from `get_string()` instead of hardcoded text?

## Structure And Maintainability

- Do page entrypoints stay thin and delegate domain work to `classes/`?
- Are failure cases handled with guard clauses instead of deep `if`/`else` nesting?
- Does the change avoid new boolean/mode flags threaded through shared functions?
- Does each domain operation have one canonical implementation instead of copies?
- Does the change avoid queries, context building, or remote calls inside loops?
- Did the diff push a file past a healthy size instead of decomposing it?
- Is complexity being deleted rather than moved around?

## Capabilities And Security

- Is the correct context resolved before access checks?
- Are `require_login()` and capability checks applied wherever needed?
- Are actions, exports, AJAX endpoints, and external functions protected server-side?
- Are request parameters validated through Moodle-native boundaries?

## Navigation Settings And Output

- Are plugin settings implemented through Moodle admin settings where appropriate?
- Do Site-administration custom screens register `admin_externalpage` and call `admin_externalpage_setup()`?
- Do shared or course-scoped pages build a visible breadcrumb path instead of relying on admin tabs?
- Does the breadcrumb show the real parent path for every role that can open the page?
- Are internal links built with `moodle_url`?
- Are icons, actions, and notifications using Moodle output helpers?
- Are output boundaries explicit and safe?
- Do operational views briefly explain their purpose when it is not self-evident?
- Do ambiguous fields identify the real Moodle data field and exclusions through labels/help?
- Do icon actions have accessible labels and a compact legend only when needed?

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

## Moodle 5.x UI And Platform

- If the target is Moodle 5.x, does UI follow Boost and Bootstrap 5.3 (`data-bs-*`, modern utilities)?
- Are theme/SCSS/template overrides using Moodle theme structure instead of ad hoc CSS/HTML patches?
- Do theme settings that affect CSS reset the relevant theme caches?
- Was the Moodle/PHP matrix checked before adopting modern PHP syntax?

## Data And Performance

- Does any list or table assume there may be many records?
- Are pagination, sorting, and filtering implemented where growth is likely?
- Are DB queries focused, parameterized, and separated from rendering?
- Is the chosen DB method appropriate, or should it use SQL-based retrieval such as `get_records_sql()`?
- Does export code reuse validated filters and access checks?
- Is Moodle version compatibility checked before using version-sensitive APIs?
- Are install or schema changes routed through Moodle upgrade mechanisms?
- Do queue producers, tasks, and reports use the same installed tables and status meanings?
- Are inclusive calendar ranges converted to end-exclusive timestamp bounds?
- Are bulk current-page, selected, and all-results semantics explicit?

## Upgrade Safety

- Is `db/upgrade.php` self-contained without calls to classes from the same plugin?
- Are legacy status/config values literal inside the historical step?
- Were core methods and schema fields verified in the target Moodle branch?
- Can a representative older version upgrade end to end through CLI or Notifications?

## Web Services

- Is new external API code placed under `classes/external/` when supported?
- Are parameters, capabilities, and return structures defined explicitly?
- Is business logic kept outside the transport layer?
- Does the intended custom service actually contain the function after deployment?
- Was consumer-equivalent token access smoke-tested without exposing the token?
- Are outbound retries idempotent and acknowledgement-aware?
- Do outbound HTTP clients force `http_build_query(..., '', '&')` instead of Moodle's HTML `&amp;`?
- Was the exact request URL inspected when a remote call returned empty results with HTTP 200?

## Events Tasks And Cache

- Does the behavior belong in an observer, hook, scheduled task, or adhoc task?
- Is expensive work removed from request-time flow when possible?
- Do multi-step or chained remote tasks narrate progress with `mtrace()` at each meaningful stage?
- Do manual-run actions stream task output and end with a return control instead of a silent spinner?
- Does any introduced cache have a clear invalidation strategy?

## Privacy Files And Backup

- Does the feature introduce personal data obligations under the Privacy API?
- Are uploaded or managed files handled through Moodle File API?
- Does the change require backup/restore review for the plugin type?

## Testing

- Does the change include appropriate PHPUnit or Behat coverage?
- Are success and failure scenarios covered, not only the happy path?
- Are generators or fixtures used to keep setup maintainable?
- Are capability, pagination, export, backup/restore, and contract regressions covered where relevant?
- Does a task-backed workflow test entrypoint → DB row → processor → final child/parent state?
- Does a legacy replacement prove required behavioral parity?

## Release Gate

- Were syntax, duplicate-root, and suspicious-size checks run on changed files?
- Were the relevant upgrade, workflow, cron, external, security, UX, and operational checks run?
- Are unexecuted checks reported as not verified rather than passed?
- Does the handoff document residual risks and remaining staging/operations steps?

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
