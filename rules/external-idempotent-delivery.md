---
title: Make Retried External Deliveries Idempotent
impact: HIGH
impactDescription: Prevents duplicate records when windows overlap or requests are retried
tags: moodle, external, idempotency, retry, integration
---

## Make Retried External Deliveries Idempotent

**Impact: HIGH (prevents duplicate records when windows overlap or requests are retried)**

External delivery workflows must assume retries, overlapping time windows, and interrupted acknowledgements. Persist a stable delivery identity or watermark and do not resend data that the remote system has already acknowledged.

Wrong:

```php
$records = get_attendance_between($from, $to);
foreach ($records as $record) {
    send_to_remote($record);
}
```

Preferred:

```php
$records = get_pending_attendance_between($from, $to);
foreach ($records as $record) {
    $response = send_to_remote($record, $record->deliverykey);
    if ($response->acknowledged) {
        mark_delivery_acknowledged($record->id, $response->reference);
    }
}
```

Why it matters:

- Cron retries and overlapping windows are normal operational behavior
- Duplicate attendance, grades, or enrolments can be harder to repair than a failed send
- Persisted attempts and acknowledgements provide an audit trail

Recommended remediation:

- Define the idempotency key or watermark before implementing delivery
- Persist attempt, response, acknowledgement, and error state
- Skip already acknowledged records on retries
- Test overlapping windows, timeout-after-send, and explicit retry scenarios

Reference: [Task API](https://moodledev.io/docs/apis/subsystems/task)
