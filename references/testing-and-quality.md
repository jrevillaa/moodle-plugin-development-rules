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

## Use Maintainable Fixtures

Prefer Moodle generators and focused fixtures over large manual setup blocks. Keep tests small enough that failures isolate the regression quickly.

Avoid:

- Giant setup methods that hide what is being tested
- Tests asserting incidental HTML details when the real contract is behavior
- Missing tests for security or capability-sensitive flows

## Review Heuristics

Flag the implementation if you see:

- New non-trivial behavior with no automated tests
- Capability-sensitive code changed without coverage
- UI workflows changed with no Behat coverage where behavior risk is high
- Complex setup duplicated across tests instead of generators or helpers

## Remediation Language

Use wording like:

- "Add PHPUnit coverage for this domain behavior."
- "This permission-sensitive flow needs Behat coverage."
- "Use Moodle generators to make the setup smaller and more reliable."
