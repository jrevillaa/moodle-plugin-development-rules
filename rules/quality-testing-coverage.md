---
title: Add Automated Coverage for Non-Trivial Behavior
impact: MEDIUM
impactDescription: Reduces regressions in capability-sensitive and data-heavy features
tags: moodle, testing, phpunit, behat
---

## Add Automated Coverage for Non-Trivial Behavior

**Impact: MEDIUM (reduces regressions in capability-sensitive and data-heavy features)**

Non-trivial plugin behavior should be backed by PHPUnit or Behat coverage depending on the risk surface.

Wrong:

```php
// Complex feature added with no automated tests.
```

Preferred:

```php
// Add PHPUnit coverage for domain logic and Behat coverage when the
// workflow spans UI, permissions, or rendered behavior.
```

Why it matters:

- Capability-sensitive and report-like features are easy to regress
- Automated coverage increases confidence in refactors and upgrades
- The right test type depends on the behavior under change

Recommended remediation:

- Use PHPUnit for domain logic and data behavior
- Use Behat for UI and workflow-sensitive behavior
- Add tests as part of the change, not as optional follow-up

Reference: [Moodle Developer Documentation](https://moodledev.io)
