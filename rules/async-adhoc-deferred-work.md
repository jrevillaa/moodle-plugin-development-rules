---
title: Defer Expensive One-Off Work With Adhoc Tasks
impact: MEDIUM
impactDescription: Keeps interactive requests responsive while preserving durable background processing
tags: moodle, task, adhoc, async, performance
---

## Defer Expensive One-Off Work With Adhoc Tasks

**Impact: MEDIUM (keeps interactive requests responsive while preserving durable background processing)**

When a user action or event triggers expensive one-off follow-up work, queue an adhoc task instead of blocking the request. Reserve scheduled tasks for recurrent jobs.

Wrong:

```php
// Runs synchronously on form submit for every selected course.
foreach ($courseids as $courseid) {
    local_example_rebuild_course_index($courseid);
}
```

Preferred:

```php
foreach ($courseids as $courseid) {
    $task = new \local_example\task\rebuild_course_index();
    $task->set_custom_data(['courseid' => $courseid]);
    \core\task\manager::queue_adhoc_task($task);
}
```

Why it matters:

- Request-time heavy work creates timeouts and poor UX
- Adhoc tasks fit deferred one-off work better than scheduled tasks
- Durable queueing survives the original request boundary

Recommended remediation:

- Queue an adhoc task for expensive follow-up work triggered by an action or event
- Keep the request focused on validation, authorization, and enqueueing
- Use scheduled tasks only when the work is recurrent

Reference: [Task API](https://moodledev.io/docs/apis/subsystems/task)
