---
title: Decompose Files Before They Sprawl
impact: MEDIUM
impactDescription: Keeps plugin files scannable instead of accumulating unrelated responsibilities
tags: moodle, file-size, decomposition, structure, maintainability
---

## Decompose Files Before They Sprawl

**Impact: MEDIUM (keeps plugin files scannable instead of accumulating unrelated responsibilities)**

Treat a change that pushes a plugin file past roughly a thousand lines as a decomposition signal, not a normal increment. In Moodle plugins this usually shows up as `locallib.php`, `lib.php`, or a single class absorbing unrelated responsibilities.

Wrong:

```php
// locallib.php keeps growing past 1000 lines.
function local_example_get_courses() { /* ... */ }
function local_example_render_table() { /* ... */ }
function local_example_send_report() { /* ... */ }
function local_example_sync_remote() { /* ... */ }
function local_example_build_zip() { /* ... */ }
```

Preferred:

```php
// classes/course_query.php, classes/output/course_table.php,
// classes/report_mailer.php, classes/remote_sync.php
$courses = (new \local_example\course_query())->get_filtered($filters);
echo $OUTPUT->render(new \local_example\output\course_table($courses));
```

Why it matters:

- Large mixed files hide responsibility boundaries and encourage more sprawl
- Autoloaded classes under `classes/` are easier to locate, test, and review
- Reviewers cannot reason about a diff inside a file they cannot scan

Recommended remediation:

- Split by responsibility into autoloaded classes under `classes/`
- Keep `lib.php` for Moodle callbacks rather than domain logic
- Decompose before adding to an already oversized file
- Waive the threshold only when the file stays clearly organized and cohesive

Reference: [Plugin files](https://moodledev.io/docs/apis/commonfiles)
