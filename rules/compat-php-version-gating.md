---
title: Gate PHP Modernization By Moodle And PHP Support Matrix
impact: CRITICAL
impactDescription: Prevents incompatible syntax recommendations and unsafe refactors across Moodle branches
tags: moodle, php, compatibility, versions, modernization
---

## Gate PHP Modernization By Moodle And PHP Support Matrix

**Impact: CRITICAL (prevents incompatible syntax recommendations and unsafe refactors across Moodle branches)**

Do not suggest or apply modern PHP syntax mechanically in Moodle plugins. Check the target Moodle branch and its supported PHP versions before introducing language features, stricter type contracts, or style-driven refactors.

Wrong:

```php
enum sync_status: string {
    case pending = 'pending';
    case done = 'done';
}

final class sync_result {
    public function __construct(
        public readonly sync_status $status,
    ) {}
}
```

Preferred:

```php
// First verify the target Moodle branch and supported PHP versions.
// Then choose the most modern syntax that is actually safe for that branch.
class sync_result {
    /** @var string */
    private $status;

    public function __construct(string $status) {
        $this->status = $status;
    }

    public function get_status(): string {
        return $this->status;
    }
}
```

Why it matters:

- Moodle plugin compatibility is constrained by the supported PHP versions of the target Moodle branch
- A "cleaner" PHP refactor can still be wrong if the syntax is unavailable in the deployment matrix
- Tightening types or adopting new syntax without checking callback signatures and subsystem expectations can break stable branches

Recommended remediation:

- Check the plugin's target Moodle branch before proposing PHP modernizations
- Only suggest features supported by that branch's PHP matrix
- Prefer the newest safe syntax, not the newest possible syntax
- Be especially careful with enums, `readonly`, attributes, promoted properties, union types, and newer exception or typing patterns

Reference: [Moodle Developer Documentation](https://moodledev.io)
