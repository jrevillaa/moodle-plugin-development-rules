# Capabilities And Security

## Always Resolve Context Correctly

Resolve the correct Moodle context before checking access. Do not perform capability checks against an arbitrary or overly broad context.

Typical rule:

1. Determine the resource being accessed.
2. Resolve the matching system, course category, course, module, block, or other relevant context.
3. Call capability checks against that context before exposing data or actions.

## Always Enforce Access Checks

Treat capabilities as mandatory, not optional hardening.

Apply checks on:

- Page entrypoints
- Form submissions
- AJAX actions
- External functions
- Export actions
- Bulk actions
- Record mutation flows

If an action changes state, validates sensitive data, or exposes restricted information, capability checks must happen before the action is processed.

## Login And Session Rules

Use Moodle-native login and session protections. Require login when the feature is not explicitly public. Use session key validation for state-changing requests where Moodle expects it.

Do not rely on hidden form fields or UI visibility alone as authorization.

## Validate Inputs Through Moodle Boundaries

Validate required parameters and types through Moodle APIs and the relevant subsystem abstractions. Do not trust raw request data.

Normalize and validate:

- Required ids
- Search terms
- Sort keys
- Paging params
- Export formats
- External function parameters

## Secure Output And Data Exposure

Expose only data the current user is allowed to access. When preparing template or export data, filter it after capability checks and according to context.

Do not leak administrative fields, internal ids, or hidden records by default.

## Review Heuristics

Flag the implementation if you see:

- A page without `require_login()` where it should exist
- Capability checks missing on actions or exports
- Capability checks done after loading or mutating restricted data
- Use of the wrong context level
- Authorization enforced only in the UI

## Remediation Language

Use wording like:

- "Resolve the correct context first, then enforce the capability."
- "This export needs the same capability boundary as the page."
- "UI visibility is not authorization; add a server-side capability check."
