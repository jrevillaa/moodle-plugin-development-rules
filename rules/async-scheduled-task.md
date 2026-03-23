---
title: Move Recurrent Heavy Work to Scheduled Tasks
impact: MEDIUM
impactDescription: Keeps request-time flows responsive and operationally predictable
tags: moodle, task, scheduled, async, performance
---

## Move Recurrent Heavy Work to Scheduled Tasks

**Impact: MEDIUM (keeps request-time flows responsive and operationally predictable)**

Recurring maintenance, synchronization, or recalculation work should run in scheduled tasks instead of piggybacking on page requests.

Wrong:

```php
// Runs every time the page loads.
local_example_sync_all_records();
```

Preferred:

```php
namespace local_example\task;

class sync_records extends \core\task\scheduled_task {
    public function get_name() {
        return get_string('tasksyncrecords', 'local_example');
    }

    public function execute() {
        local_example_sync_all_records();
    }
}
```

Why it matters:

- Heavy recurrent work can slow pages unpredictably
- Scheduled tasks create a clearer operational boundary
- Repeated work belongs to the task subsystem, not UI entrypoints

Recommended remediation:

- Move periodic processing to a scheduled task
- Keep page requests focused on user interaction

Reference: [Moodle Developer Documentation](https://moodledev.io)
