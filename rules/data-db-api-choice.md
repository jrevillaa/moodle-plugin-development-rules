---
title: Choose the Moodle DB API Based on Query Shape
impact: HIGH
impactDescription: Improves correctness, readability, and scalability of data access
tags: moodle, dml, sql, get_records, get_records_sql
---

## Choose the Moodle DB API Based on Query Shape

**Impact: HIGH (improves correctness, readability, and scalability of data access)**

Do not default blindly to either simple record helpers or SQL-based helpers. Choose the Moodle DB API that matches the access pattern.

Wrong:

```php
$records = $DB->get_records('user', null, 'lastname ASC');
```

Preferred:

```php
$records = $DB->get_records('user', ['deleted' => 0], 'lastname ASC', 'id, firstname, lastname');
```

Wrong:

```php
$records = $DB->get_records('local_example_items');
```

Preferred:

```php
$records = $DB->get_records_sql(
    "SELECT i.id, i.name, c.fullname
       FROM {local_example_items} i
       JOIN {course} c ON c.id = i.courseid
   ORDER BY c.fullname ASC, i.name ASC",
    []
);
```

Why it matters:

- Single-table simple reads are clearer with focused helper methods
- Joins, pagination, and aggregation usually require SQL-based APIs
- Good DB API choice improves both readability and performance

Recommended remediation:

- Use `get_record()` and `get_records()` for simple access
- Use `get_record_sql()` and `get_records_sql()` for complex query shapes
- Fetch only the fields the screen or action needs

Reference: [DML API](https://moodledev.io/docs/apis/core/dml)
