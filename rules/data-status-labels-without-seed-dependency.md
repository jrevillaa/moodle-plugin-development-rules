---
title: Do Not Depend On Seed Rows To Render Stable Status Labels
impact: MEDIUM
impactDescription: Prevents valid workflow rows from disappearing when lookup data was not installed
tags: moodle, status, strings, install, database
---

## Do Not Depend On Seed Rows To Render Stable Status Labels

**Impact: MEDIUM (prevents valid workflow rows from disappearing when lookup data was not installed)**

For a small stable status set, keep persisted values in documented constants and render labels through `get_string()`. Do not require an inner join to a lookup table merely to display labels; missing seed rows can hide valid data.

Wrong:

```php
$sql = "SELECT q.*, s.name
          FROM {local_example_queue} q
          JOIN {local_example_status} s ON s.id = q.status";
```

Preferred:

```php
$label = get_string('status' . $record->status, 'local_example');
```

Why it matters:

- Missing install seeds can turn a populated queue into an empty result
- User-facing labels belong in language packs
- Stable domain states are easier to review when values and labels are explicit

Recommended remediation:

- Use documented status constants for persisted values
- Map labels through language strings
- If lookup data is genuinely dynamic, seed it through `db/install.php` and migrate it through `db/upgrade.php`
- Use a left join only when missing optional metadata must not hide the domain row

Reference: [String API](https://moodledev.io/docs/apis/subsystems/string)
