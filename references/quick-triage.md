# Quick Triage

Use this file to classify findings quickly during audit work.

## Usually Critical

- Missing or incorrect capability checks
- Missing login enforcement on protected surfaces
- Wrong context used for access control
- State-changing action without sesskey protection
- Version-incompatible API or structure
- Persistent changes bypassing upgrade flow
- External API exposing sensitive operations without proper checks

## Usually Major

- Manual forms instead of Form API
- Complex echoed HTML instead of Mustache and renderers
- Direct JS loading instead of AMD
- New external services placed in legacy `externallib.php` without compatibility reason
- Reports or tables without pagination, sorting, or filtering
- DB API choice that clearly mismatches the query shape
- Heavy recurrent work left in request-time flow

## Usually Minor

- Hardcoded user-facing strings
- Weak naming for variables, functions, or constants
- Generic helper classes with light overreach
- Missing low-risk test coverage additions
- Accessibility or i18n improvements that do not currently break behavior

## Escalation Rule

If a finding affects security, privacy, data integrity, production compatibility, or deployment safety, bias toward `Critical`.

If the code works but is clearly non-native, fragile, or non-scalable, bias toward `Major`.

If the issue mostly affects consistency, readability, or incremental quality, bias toward `Minor`.
