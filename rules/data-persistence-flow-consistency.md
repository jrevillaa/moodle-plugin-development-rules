---
title: Keep Persistence Contracts Consistent Across The Full Workflow
impact: HIGH
impactDescription: Prevents producers and consumers from reading different tables or fields
tags: moodle, database, workflow, queue, consistency
---

## Keep Persistence Contracts Consistent Across The Full Workflow

**Impact: HIGH (prevents producers and consumers from reading different tables or fields)**

For queues and multi-step workflows, trace the full producer-to-consumer path. Enqueue code, tasks, reports, and cleanup must use the tables and fields declared in `db/install.xml`. Reuse one focused persistence boundary when several entrypoints perform the same operation.

Wrong:

```php
// Producer writes a legacy table name.
$DB->insert_record('local_bulk_delete_queue', $record);

// Task reads the installed table name, so it never sees the row.
$queued = $DB->get_records('local_delete_by_date_queue', ['status' => 1]);
```

Preferred:

```php
// Both the enqueue path and task reuse the same queue operation.
$queue->enqueue($record);
$queued = $queue->get_pending();
```

Why it matters:

- A UI can report success while the task sees an empty queue
- Table-name drift is not detected by isolated page or task tests
- Repeated persistence logic makes migrations and status changes easy to miss

Recommended remediation:

- Compare every referenced table and field with `db/install.xml`
- Trace and smoke-test UI/API → database row → task → final state
- Keep enqueue and process queries in one cohesive domain-specific boundary when reuse is real
- Avoid speculative repository layers; extract only the shared persistence operation

Reference: [DML API](https://moodledev.io/docs/apis/core/dml)
