---
title: Do Not Run Queries Or Heavy Work Inside Loops
impact: HIGH
impactDescription: Prevents per-row query storms and unbounded loop cost on real Moodle data
tags: moodle, performance, database, loops, scalability
---

## Do Not Run Queries Or Heavy Work Inside Loops

**Impact: HIGH (prevents per-row query storms and unbounded loop cost on real Moodle data)**

Do not query the database, build contexts, or call remote services once per row. Fetch what the loop needs in one set-based query, then iterate in memory. Nested loops over Moodle records are usually a sign that the query shape is wrong.

Wrong:

```php
foreach ($items as $item) {
    $course = $DB->get_record('course', ['id' => $item->courseid]);
    $item->coursename = $course->fullname;

    foreach ($DB->get_records('local_example_log', ['itemid' => $item->id]) as $log) {
        $item->attempts++;
    }
}
```

Preferred:

```php
[$insql, $params] = $DB->get_in_or_equal(array_column($items, 'courseid'), SQL_PARAMS_NAMED);

$coursenames = $DB->get_records_select_menu('course', "id $insql", $params, '', 'id, fullname');
$attempts = $DB->get_records_sql(
    "SELECT itemid, COUNT(1) AS attempts
       FROM {local_example_log}
      GROUP BY itemid",
    []
);

foreach ($items as $item) {
    $item->coursename = $coursenames[$item->courseid] ?? '';
    $item->attempts = $attempts[$item->id]->attempts ?? 0;
}
```

Why it matters:

- Per-row queries scale linearly with data and dominate page time
- Nested record loops turn a slow page into a timeout on production data
- Set-based queries express the real intent more clearly

Recommended remediation:

- Preload related records with one query using `get_in_or_equal()` or a join
- Aggregate counts in SQL instead of counting rows in PHP
- Batch remote calls or move the work into a scheduled/adhoc task
- Process large datasets with recordsets and bounded batches instead of loading everything

Reference: [DML API](https://moodledev.io/docs/apis/core/dml)
