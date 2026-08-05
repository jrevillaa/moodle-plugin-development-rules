---
title: Define One Status Contract For Writers Readers And Parent Aggregates
impact: HIGH
impactDescription: Prevents workflows from completing with contradictory child and batch states
tags: moodle, status, workflow, queue, data-integrity
---

## Define One Status Contract For Writers Readers And Parent Aggregates

**Impact: HIGH (prevents workflows from completing with contradictory child and batch states)**

When a workflow persists status values, define one documented set of domain constants and use it in writers, readers, tasks, and views. Parent or batch status should be recalculated from child records through one shared operation.

Wrong:

```php
// Task considers 2 deleted.
$DB->set_field('local_example_item', 'status', 2, ['id' => $itemid]);

// Batch aggregation considers only 3 deleted.
$remaining = $DB->count_records_select('local_example_item', 'batchid = ? AND status <> 3', [$batchid]);
```

Preferred:

```php
$DB->set_field(
    'local_example_item',
    'status',
    deletion_service::STATUS_DELETED,
    ['id' => $itemid]
);
$service->refresh_batch($batchid);
```

Why it matters:

- Different numeric meanings leave completed jobs permanently in progress
- Views can report a state that contradicts the task writer
- Parent state becomes stale when every caller implements aggregation differently

Recommended remediation:

- Document a single status lifecycle with named constants
- Recalculate parent status from children in one shared domain operation
- Keep legacy numeric migrations as literals inside self-contained upgrade steps
- Test enqueue → processing → child status → parent status, including error cases

Reference: [DML API](https://moodledev.io/docs/apis/core/dml)
