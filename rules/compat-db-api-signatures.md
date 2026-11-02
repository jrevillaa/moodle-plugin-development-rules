---
title: Call Moodle DB Helpers With Verified Signatures
impact: CRITICAL
impactDescription: Prevents silent wrong SQL and runtime database failures from invented helper arguments
tags: moodle, dml, get_record_select, signatures, compatibility
---

## Call Moodle DB Helpers With Verified Signatures

**Impact: CRITICAL (prevents silent wrong SQL and runtime database failures from invented helper arguments)**

Before calling `$DB->get_record*`, `get_records*`, `get_fieldset*`, or similar helpers, verify the real method signature in the target Moodle branch. Do not invent a `$sort` argument, swap `$fields` with `$strictness`, or assume every helper mirrors `get_records()`.

Wrong:

```php
// get_record_select() has no $sort parameter. The 4th argument is $fields.
$program = $DB->get_record_select('local_example_program', 'enabled = 1', null, 'id ASC', '*');
```

Preferred:

```php
$program = $DB->get_record_sql(
    'SELECT * FROM {local_example_program} WHERE enabled = 1 ORDER BY id ASC',
    null,
    IGNORE_MISSING
);

// Or, when multiple rows are fine:
$programs = $DB->get_records('local_example_program', ['enabled' => 1], 'id ASC');
```

Why it matters:

- A plausible “sort” argument can silently become the SELECT field list
- Cron, CLI, and upgrade paths fail with opaque database errors
- The bug looks like data/config when it is actually an API misuse

Recommended remediation:

- Open `lib/dml/moodle_database.php` (or the branch docs) and match the exact parameter order
- Prefer `get_record_sql()` / `get_records_sql()` when you need joins or `ORDER BY`
- Use `get_records()` / `get_record()` only when their documented filters and sort params fit
- Smoke the exact query path in CLI/cron, not only the web UI

Reference: [DML API](https://moodledev.io/docs/apis/core/dml)
