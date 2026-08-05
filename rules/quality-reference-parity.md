---
title: Prove Behavioral Parity When Replacing A Working Legacy Flow
impact: HIGH
impactDescription: Prevents rewrites from silently dropping expected Moodle behavior
tags: moodle, migration, regression, parity, testing
---

## Prove Behavioral Parity When Replacing A Working Legacy Flow

**Impact: HIGH (prevents rewrites from silently dropping expected Moodle behavior)**

When a rewrite replaces a known working plugin or workflow, inspect the reference implementation before declaring the new path complete. Preserve required outcomes, not necessarily its internal structure.

Wrong:

```php
// New seed flow creates a course but skips the reference backup/restore settings.
$childid = create_course($data);
```

Preferred:

```php
// Scenario test derived from the reference behavior.
$childid = $seedservice->replicate($templateid, $target);
$child = get_course($childid);

$this->assertSame($template->format, $child->format);
$this->assert_child_enrolments_preserved($childid);
```

Why it matters:

- A cleaner rewrite can still regress required behavior
- Backup/restore settings, course format, files, enrolments, and cleanup rules are easy to overlook
- UI enhancements do not compensate for a broken core workflow

Recommended remediation:

- Trace the critical reference path and record observable outcomes
- Compare backup settings, restore behavior, retained data, and removed data
- Add scenario tests for the required parity contract
- Stabilize the core behavior before adding secondary UI features

Reference: [Testing](https://moodledev.io/general/development/process/testing)
