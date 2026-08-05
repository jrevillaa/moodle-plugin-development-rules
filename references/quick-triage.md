# Quick Triage

Use this file to classify findings quickly during audit work.

## Usually Critical

- Missing or incorrect capability checks
- Missing login enforcement on protected surfaces
- Wrong context used for access control
- State-changing action without sesskey protection
- Version-incompatible API or structure
- Persistent changes bypassing upgrade flow
- Upgrade step depending on a class from the same plugin
- Invented/unverified core method that can block upgrade or runtime
- Outbound HTTP URLs built with Moodle's HTML `&amp;` query separator
- External API exposing sensitive operations without proper checks

## Usually Major

- Manual forms instead of Form API
- Complex echoed HTML instead of Mustache and renderers
- Direct JS loading instead of AMD
- New external services placed in legacy `externallib.php` without compatibility reason
- Reports or tables without pagination, sorting, or filtering
- DB API choice that clearly mismatches the query shape
- Heavy recurrent work left in request-time flow
- One-off expensive work blocking requests instead of an adhoc task
- Cache introduced without invalidation
- Course/activity data missing backup/restore support when the plugin type expects it
- Moodle 5.x UI still using Bootstrap 4 patterns
- Queue producers and consumers using different tables or status meanings
- External delivery retries with no idempotency or acknowledgement state
- A working legacy path replaced without required behavioral parity
- Existing token/service access assumed but not operationally verified
- Database queries or remote calls executed inside loops on growable data
- Domain logic duplicated across page, task, CLI, and external entrypoints
- Fat page entrypoints mixing params, queries, mutation, and markup
- New flags or special-case branches scattered through shared flows

## Usually Minor

- Hardcoded user-facing strings
- Weak naming for variables, functions, or constants
- Generic helper classes with light overreach
- Missing low-risk test coverage additions
- Accessibility or i18n improvements that do not currently break behavior
- Observer/event wiring that works but could be clearer
- Ambiguous field meaning or icon action that needs concise contextual help
- Deep conditional nesting that guard clauses would flatten
- A file approaching an unhealthy size without immediate risk
## Escalation Rule

If a finding affects security, privacy, data integrity, production compatibility, or deployment safety, bias toward `Critical`.

If the code works but is clearly non-native, fragile, or non-scalable, bias toward `Major`.

If the issue mostly affects consistency, readability, or incremental quality, bias toward `Minor`.
