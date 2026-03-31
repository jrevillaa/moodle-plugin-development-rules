---
title: Test Features Against Expected Success And Failure Scenarios
impact: HIGH
impactDescription: Prevents under-tested workflows by covering realistic functional and error scenarios
tags: moodle, testing, phpunit, behat, validation, workflows
---

## Test Features Against Expected Success And Failure Scenarios

**Impact: HIGH (prevents under-tested workflows by covering realistic functional and error scenarios)**

When adding a feature, do not stop at the happy path. Create a test set that covers correct behavior, expected validation failures, interrupted flows, and realistic edge cases for that workflow.

Wrong:

```php
// New CSV enrolment feature added.
// Only manual testing of the successful import path was performed.
```

Preferred:

```php
// Add coverage for the normal path and for realistic failure scenarios:
// - valid CSV with expected enrolments
// - missing required column
// - empty row or malformed value
// - interrupted or partial upload
// - user without required capability
// - duplicate or already-enrolled records
// - clear user-facing error reporting where applicable
```

Why it matters:

- Moodle features often fail at boundaries such as permissions, malformed input, partial form submissions, or interrupted file handling
- Happy-path-only testing leaves the highest-risk behaviors unverified
- Good scenario coverage improves both correctness and the quality of recovery and error messaging

Recommended remediation:

- For each feature, identify the success path, validation failures, permission failures, and operational edge cases
- Add PHPUnit coverage for backend logic and Behat coverage when the workflow is form-, file-, or UI-driven
- Test realistic error cases such as missing fields, invalid formats, duplicates, interrupted uploads, and partial processing
- Verify not only the failure but also the expected remediation behavior, such as rollback, skip rules, error aggregation, or actionable feedback

Reference: [Moodle Developer Documentation](https://moodledev.io)
