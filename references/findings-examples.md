# Findings Examples

Use these examples to keep audit output consistent and high-signal.

## Critical

Rule violated:

- Capability enforcement is missing on a state-changing action.

Why it matters:

- UI visibility is not authorization. In Moodle, actions must be protected server-side in the correct context.

Recommended remediation:

- Resolve the correct context, require login where appropriate, and enforce the capability before processing the request.

## Major

Rule violated:

- A report screen renders a growing dataset without pagination or sorting.

Why it matters:

- Report plugins should assume real data volume. Without scalable table handling, performance and usability degrade quickly.

Recommended remediation:

- Move the listing to a Moodle-native table flow with validated filters, pagination, and sorting backed by the appropriate DB API.

## Minor

Rule violated:

- User-facing labels are hardcoded in PHP.

Why it matters:

- Hardcoded text weakens consistency and translation support.

Recommended remediation:

- Move the text to the language pack and read it with `get_string()`.
