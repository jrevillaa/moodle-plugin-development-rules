---
title: Keep One Canonical Implementation Per Domain Operation
impact: HIGH
impactDescription: Prevents duplicated logic from drifting between pages, tasks, and external functions
tags: moodle, duplication, reuse, architecture, maintainability
---

## Keep One Canonical Implementation Per Domain Operation

**Impact: HIGH (prevents duplicated logic from drifting between pages, tasks, and external functions)**

When the same domain operation is needed by a page, a task, a CLI script, and an external function, implement it once and call it from each entrypoint. Copy-pasted queries and rules drift as soon as one caller is fixed.

Wrong:

```php
// classes/task/process_queue.php
$items = $DB->get_records_select('local_example_items', 'status = 1 AND timequeued < ?', [time() - 60]);

// index.php
$items = $DB->get_records_select('local_example_items', 'status = 1', []);

// classes/external/get_pending.php
$items = $DB->get_records('local_example_items', ['status' => 1]);
```

Preferred:

```php
// classes/queue.php owns the query and its rules.
$items = (new \local_example\queue())->get_pending();
```

Why it matters:

- Divergent copies produce different results for the same question
- A bug fixed in one caller silently persists in the others
- Reviewers cannot tell which copy is authoritative

Recommended remediation:

- Extract the operation once into a cohesive, domain-named class or function
- Replace each duplicate with a call to the canonical implementation
- Reuse existing Moodle core and plugin helpers before writing a near-duplicate
- Extract only real duplication; do not create speculative service layers

Reference: [Moodle Developer Documentation](https://moodledev.io)
