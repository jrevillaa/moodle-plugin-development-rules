---
title: Prefer Guard Clauses Over Deep Conditional Nesting
impact: MEDIUM-HIGH
impactDescription: Keeps Moodle logic readable by removing avoidable else branches and nesting
tags: moodle, readability, conditionals, guard-clause, maintainability
---

## Prefer Guard Clauses Over Deep Conditional Nesting

**Impact: MEDIUM-HIGH (keeps Moodle logic readable by removing avoidable else branches and nesting)**

Handle invalid, empty, and unauthorized cases early and return. Avoid stacking `if`/`else` layers around the main path, and let Moodle's own `require_*` functions act as guards instead of wrapping logic in nested conditionals.

Wrong:

```php
public function process(int $itemid): string {
    if ($itemid > 0) {
        $item = $this->find($itemid);
        if ($item) {
            if (has_capability('local/example:manage', $this->context)) {
                if ($item->status === self::STATUS_QUEUED) {
                    return $this->run($item);
                } else {
                    return get_string('notqueued', 'local_example');
                }
            } else {
                return get_string('nopermission', 'local_example');
            }
        } else {
            return get_string('notfound', 'local_example');
        }
    } else {
        return get_string('invalidid', 'local_example');
    }
}
```

Preferred:

```php
public function process(int $itemid): string {
    require_capability('local/example:manage', $this->context);

    $item = $this->find($itemid);
    if (!$item) {
        throw new \moodle_exception('notfound', 'local_example');
    }

    if ($item->status !== self::STATUS_QUEUED) {
        return get_string('notqueued', 'local_example');
    }

    return $this->run($item);
}
```

Why it matters:

- Deep nesting hides which branch is the real behavior
- Long `else` chains make later edits attach new special cases to the wrong level
- Early failure handling matches Moodle's `require_login()` and `require_capability()` style

Recommended remediation:

- Validate input, existence, and access first, then return or throw
- Remove `else` branches that only exist because the failure case was not handled early
- Use Moodle exceptions or `moodle_exception` for genuinely exceptional states
- Extract a helper when a single function still needs many independent decisions

Reference: [Coding style](https://moodledev.io/general/development/policies/codingstyle)
