# Webservices And External API

## Prefer Class-Based External API Structure

When the supported Moodle version allows it, place new external API code under `classes/external/` with proper namespacing instead of adding new logic to legacy `externallib.php`.

Treat `externallib.php` as legacy compatibility territory unless the plugin or Moodle version explicitly requires it.

Use the standard external API shape:

1. `execute_parameters()` for the input contract
2. `execute()` for orchestration and domain call
3. `execute_returns()` for the output contract

## Separate External Concerns

An external function should clearly separate:

1. Parameter definition and validation
2. Context and capability enforcement
3. Domain operation execution
4. Return structure definition

Avoid putting complex business logic directly inside the external method when it should live in a service or domain class.

Inside `execute()`, the normal order should be:

1. `validate_parameters()`
2. Resolve the target context
3. `validate_context()`
4. `require_capability()`
5. Call the domain operation
6. Return data that matches `execute_returns()`

## Validate Parameters And Returns Explicitly

Define parameter contracts and return contracts clearly and consistently with Moodle's external API expectations.

Validate:

- Required identifiers
- Optional filters
- Paging and sort params
- Action flags
- Export modes

Do not return loosely shaped arrays when the contract should be explicit.

Prefer the correct structure type for the contract:

- `external_value` for scalar values
- `external_single_structure` for shaped objects
- `external_multiple_structure` for arrays of items

## Reuse Existing Domain Logic

External functions should orchestrate access and contract handling, not duplicate core business logic already used by pages or tasks.

Prefer reusing:

- Query services
- Capability-aware domain methods
- Export services
- Data mappers

If the plugin has no reusable domain layer yet, keep the first extraction pragmatic. Do not build a large service architecture only because the endpoint is external.

## Write Operations And Transactions

For write-oriented external functions, review transaction safety and partial failure behavior explicitly.

Be especially careful when the endpoint:

- inserts or updates multiple records
- creates related Moodle entities in sequence
- performs enrolment, grading, activity creation, or other multi-step writes
- mixes persistence with side effects

When partial failure would leave inconsistent state, use an appropriate transaction boundary and test the rollback or recovery behavior.

## Mobile And Service Exposure

Only expose operations through web services when there is a clear client need. Register and document the service cleanly. Keep the exposed surface minimal and capability-bounded.

When exposing a function, also review `db/services.php` carefully:

- `classname` should point to the namespaced external class
- `methodname` is normally `execute`
- `type` should reflect `read` vs `write`
- `ajax` should only be enabled when needed
- `capabilities` should describe the real access boundary
- `services` should only be set when the function belongs in a specific bundle such as mobile

Do not add broad service exposure by default.

After changing `db/services.php`, remember that Moodle may require cache purging or service refresh before the updated registration is visible in practice.

## Testing And Debugging

Prefer Moodle-native testing and verification paths:

- Web service test client
- `core/ajax` consumers for AJAX-backed methods
- REST calls with a proper token when validating transport behavior
- PHPUnit coverage for non-trivial domain logic behind the endpoint
- role-based verification for users who should and should not be able to call the endpoint

Be cautious with ad hoc file logging in plugin code. Prefer Moodle's normal debugging and logging mechanisms unless there is a clear operational reason for custom diagnostics.

## Review Heuristics

Flag the implementation if you see:

- New web service code added to `externallib.php` without a version or compatibility reason
- Capability checks missing in the external method
- Missing `validate_parameters()` or `validate_context()`
- External methods containing large amounts of business logic
- `execute_returns()` that does not match the real payload
- Weak or overly broad entries in `db/services.php`
- Write endpoints with multi-step persistence and no transaction or rollback strategy
- Return payloads with inconsistent or undocumented structure

## Remediation Language

Use wording like:

- "Move this new external API implementation to `classes/external/`."
- "Keep the external class focused on validation, access, and contract handling."
- "Push reusable business logic into a service class and call it from the external method."
- "Validate parameters and context before checking capabilities or touching data."
- "Tighten `db/services.php` so the function is exposed only as broadly as needed."
- "This write endpoint should review transaction boundaries so partial failure does not leave inconsistent Moodle state."
