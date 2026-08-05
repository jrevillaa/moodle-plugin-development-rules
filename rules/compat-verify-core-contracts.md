---
title: Verify Moodle APIs And Schema Before Using Them
impact: CRITICAL
impactDescription: Prevents release failures caused by invented methods, fields, or version assumptions
tags: moodle, core-api, schema, compatibility, verification
---

## Verify Moodle APIs And Schema Before Using Them

**Impact: CRITICAL (prevents release failures caused by invented methods, fields, or version assumptions)**

Do not infer Moodle method or column names from memory. Before using a version-sensitive core API or writing operational SQL, verify the contract in the target Moodle branch: inspect the core class, locate a real core caller, or inspect the installed schema.

Wrong:

```php
$task->set_dayofweek('*');

$records = $DB->get_records_sql(
    'SELECT s.iprestriction FROM {external_services} s'
);
```

Preferred:

```php
// Verified against core\task\scheduled_task in the target branch.
$task->set_day_of_week('*');

// Fetch only columns verified in the target branch schema.
$records = $DB->get_records('external_services', null, 'name ASC', 'id, name, enabled');
```

Why it matters:

- Plausible-looking API names can still be nonexistent
- Moodle schemas and APIs differ across supported branches
- Upgrade and operational scripts fail at the worst possible deployment boundary

Recommended remediation:

- Search the target Moodle core for the method definition and at least one real caller
- Inspect `install.xml`, XMLDB definitions, or the actual environment schema before writing operational SQL
- Prefer Moodle administration APIs and focused DML over speculative SQL
- Run a representative smoke check against the supported Moodle branch before bumping the plugin version

Reference: [Moodle Developer Documentation](https://moodledev.io)
