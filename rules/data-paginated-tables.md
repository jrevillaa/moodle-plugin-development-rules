---
title: Assume Report Tables Will Grow
impact: HIGH
impactDescription: Prevents scalability and usability issues on report-style screens
tags: moodle, report, table, pagination, performance
---

## Assume Report Tables Will Grow

**Impact: HIGH (prevents scalability and usability issues on report-style screens)**

If a screen displays tabular or report-style data, assume the dataset may exceed a small bounded size. Pagination, sorting, and filtering should be baseline functionality, not a later patch.

Wrong:

```php
$records = $DB->get_records('local_example_log');
foreach ($records as $record) {
    echo html_writer::div(s($record->message));
}
```

Preferred:

```php
$perpage = 25;
$page = optional_param('page', 0, PARAM_INT);
$offset = $page * $perpage;

$records = $DB->get_records_sql(
    "SELECT id, message, timecreated
       FROM {local_example_log}
   ORDER BY timecreated DESC",
    [],
    $offset,
    $perpage
);
```

Why it matters:

- Report plugins often grow beyond initial assumptions
- Full-record loading harms performance and usability
- Pagination and sorting should be designed into the query shape

Recommended remediation:

- Validate paging, filter, and sort inputs
- Use the right DB API for the query shape
- Render through table-friendly Moodle patterns

Reference: [DML API](https://moodledev.io/docs/apis/core/dml)
