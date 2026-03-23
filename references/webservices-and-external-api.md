# Webservices And External API

## Prefer Class-Based External API Structure

When the supported Moodle version allows it, place new external API code under `classes/external/` with proper namespacing instead of adding new logic to legacy `externallib.php`.

Treat `externallib.php` as legacy compatibility territory unless the plugin or Moodle version explicitly requires it.

## Separate External Concerns

An external function should clearly separate:

1. Parameter definition and validation
2. Context and capability enforcement
3. Domain operation execution
4. Return structure definition

Avoid putting complex business logic directly inside the external method when it should live in a service or domain class.

## Validate Parameters And Returns Explicitly

Define parameter contracts and return contracts clearly and consistently with Moodle's external API expectations.

Validate:

- Required identifiers
- Optional filters
- Paging and sort params
- Action flags
- Export modes

Do not return loosely shaped arrays when the contract should be explicit.

## Reuse Existing Domain Logic

External functions should orchestrate access and contract handling, not duplicate core business logic already used by pages or tasks.

Prefer reusing:

- Query services
- Capability-aware domain methods
- Export services
- Data mappers

## Mobile And Service Exposure

Only expose operations through web services when there is a clear client need. Register and document the service cleanly. Keep the exposed surface minimal and capability-bounded.

## Review Heuristics

Flag the implementation if you see:

- New web service code added to `externallib.php` without a version or compatibility reason
- Capability checks missing in the external method
- External methods containing large amounts of business logic
- Return payloads with inconsistent or undocumented structure

## Remediation Language

Use wording like:

- "Move this new external API implementation to `classes/external/`."
- "Keep the external class focused on validation, access, and contract handling."
- "Push reusable business logic into a service class and call it from the external method."
