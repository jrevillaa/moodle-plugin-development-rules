---
title: Assume Report Tables Will Grow
impact: HIGH
impactDescription: Prevents scalability and usability issues on report-style screens
tags: moodle, report, table, pagination, performance
---

## Assume Report Tables Will Grow

**Impact: HIGH (prevents scalability and usability issues on report-style screens)**

If a screen displays tabular or report-style data, assume the dataset may exceed a small bounded size. Pagination, sorting, and filtering should be baseline functionality, not a later patch. Bulk actions must also define whether selection means the current page, explicitly selected rows across pages, or all matching results.

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
- Bulk selection becomes dangerous when page boundaries or “all results” semantics are implicit

Recommended remediation:

- Validate paging, filter, and sort inputs
- Use the right DB API for the query shape
- Render through table-friendly Moodle patterns such as `table_sql` where appropriate
- Preserve explicit selected IDs across pages without loading every matching record into PHP
- Make “current page”, “selected rows”, and “all filtered results” distinct actions
- Revalidate filters, capabilities, and selected IDs server-side before a bulk mutation

Reference: [DML API](https://moodledev.io/docs/apis/core/dml)
