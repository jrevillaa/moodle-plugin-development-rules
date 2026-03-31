# Testing And Quality

## Add Tests For Behavior Changes

When implementing non-trivial logic, add or update automated tests. Treat testing as part of the change, not optional follow-up.

Prefer:

- PHPUnit for domain logic, services, access rules, and data behavior
- Behat for user flows, UI integration, and permission-sensitive scenarios
- Generators and fixtures that keep setup readable and reusable

## Choose The Right Test Type

Use PHPUnit when the change is mostly backend logic or data behavior. Use Behat when the change is a workflow spanning UI, forms, permissions, navigation, or rendered output. Use both when the feature has both domain and end-to-end risk.

## Cover Regressions Explicitly

Add tests for:

- Capability boundaries
- Validation failures
- Pagination and filtering behavior
- Export behavior
- Version-sensitive branches
- Web service contracts
- Upgrade behaviors when feasible

## Use A Scenario Matrix Per Feature

When a new feature is introduced, build a small scenario matrix instead of testing only the happy path.

For each feature, identify at least:

- Success path
- Validation failures
- Permission failures
- Boundary or malformed input cases
- Partial failure or interruption cases
- Recovery or retry behavior where relevant
- User-facing error or status feedback where applicable

Example for a CSV enrolment workflow:

- valid CSV enrols the expected users in the expected courses
- required column missing produces a clear validation failure
- empty row or malformed value is rejected or skipped according to the contract
- duplicate enrolment is handled predictably
- upload interrupted or partial processing does not leave silent inconsistent state
- user without the required capability cannot execute the operation
- the user sees actionable feedback for recoverable errors

Do not treat these as optional extras. They are part of the feature contract.

## External API Test Expectations

When a feature exposes a web service or AJAX-backed external function, add verification for:

- parameter validation failures
- context validation
- capability enforcement
- return payload shape
- read vs write behavior
- service registration assumptions when relevant

If the external endpoint is only lightly tested through manual calls, the coverage is incomplete.

## Use Maintainable Fixtures

Prefer Moodle generators and focused fixtures over large manual setup blocks. Keep tests small enough that failures isolate the regression quickly.

Avoid:

- Giant setup methods that hide what is being tested
- Tests asserting incidental HTML details when the real contract is behavior
- Missing tests for security or capability-sensitive flows
- Feature tests that cover success only and ignore realistic operational failures

## Recommended Test Design Flow

Use this lightweight order when designing test coverage for a new feature:

1. Write down the intended success behavior
2. List the most likely validation and permission failures
3. List operational edge cases such as interrupted uploads, duplicates, partial processing, or empty result sets
4. Choose PHPUnit, Behat, or both based on where the risk lives
5. Verify both the failure and the expected remediation behavior

The remediation behavior matters. A good test should check whether the feature rolls back, skips bad rows, aggregates errors, preserves previous state, or tells the user what to fix.

## Review Heuristics

Flag the implementation if you see:

- New non-trivial behavior with no automated tests
- Capability-sensitive code changed without coverage
- UI workflows changed with no Behat coverage where behavior risk is high
- Complex setup duplicated across tests instead of generators or helpers
- New feature tests that cover only the successful path and ignore failure scenarios

## Remediation Language

Use wording like:

- "Add PHPUnit coverage for this domain behavior."
- "This permission-sensitive flow needs Behat coverage."
- "Use Moodle generators to make the setup smaller and more reliable."
- "Add a scenario matrix for this feature so validation, permission, and interruption paths are covered."
- "Test not only the failure, but also the expected recovery or user feedback behavior."
