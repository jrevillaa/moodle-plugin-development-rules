---
title: Guard Empty Timestamps Before userdate And Similar Formatters
impact: MEDIUM
impactDescription: Prevents epoch dates such as 1969/1970 from appearing when a process has never run
tags: moodle, userdate, timestamp, empty-state, ux
---

## Guard Empty Timestamps Before userdate And Similar Formatters

**Impact: MEDIUM (prevents epoch dates such as 1969/1970 from appearing when a process has never run)**

Config values, nullable DB columns, and “last run” fields are often `0` or empty before the first successful process. Passing them straight into `userdate()` renders the Unix epoch in the user timezone and looks like corrupt data.

Wrong:

```php
echo get_string('updateduntil', 'local_example', userdate((int) get_config('local_example', 'last_process_time')));
```

Preferred:

```php
$when = (int) get_config('local_example', 'last_process_time');
if ($when <= 0) {
    echo get_string('updateduntil_never', 'local_example');
} else {
    echo get_string('updateduntil', 'local_example', userdate($when));
}
```

Why it matters:

- Operators misread “Dec 1969 / Jan 1970” as a timezone or DB bug
- Empty-state UX should say the job has not run yet
- The same trap applies to exports, emails, and dashboards

Recommended remediation:

- Treat `<= 0` (or `null`) as “never” for process/run timestamps
- Add a dedicated language string for the empty state
- Apply the same guard to CSV/Excel columns that format dates

Reference: [String API](https://moodledev.io/docs/apis/subsystems/string)
