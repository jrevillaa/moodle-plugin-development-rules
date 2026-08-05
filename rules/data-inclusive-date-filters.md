---
title: Translate Inclusive Calendar Dates Into Correct Timestamp Bounds
impact: MEDIUM
impactDescription: Prevents date filters from silently excluding most of the final day
tags: moodle, date, timezone, filter, database
---

## Translate Inclusive Calendar Dates Into Correct Timestamp Bounds

**Impact: MEDIUM (prevents date filters from silently excluding most of the final day)**

When a UI says that a calendar “To” date is inclusive, do not compare timestamps against midnight at the start of that day. Convert the user-visible range to a start-inclusive, end-exclusive interval using Moodle-aware date handling and the relevant timezone.

Wrong:

```php
$sql = 'course.startdate >= :fromdate AND course.startdate <= :todate';
// :todate is 2026-08-05 00:00:00, excluding the rest of August 5.
```

Preferred:

```php
$timezone = \core_date::get_user_timezone_object();
$endexclusive = (new \DateTimeImmutable('@' . $todate))
    ->setTimezone($timezone)
    ->setTime(0, 0)
    ->modify('+1 day')
    ->getTimestamp();
$sql = 'course.startdate >= :fromdate AND course.startdate < :endexclusive';
$params = ['fromdate' => usergetmidnight($fromdate), 'endexclusive' => $endexclusive];
```

Why it matters:

- Moodle date selectors commonly represent calendar days at midnight
- Inclusive `<= midnight` ranges exclude records later on the selected day
- User timezone and daylight-saving boundaries can affect timestamp conversion

Recommended remediation:

- Express calendar ranges as `[start, end-exclusive)`
- Use Moodle date/time helpers appropriate to the user's timezone
- State in contextual help that the “To” date includes the full day
- Test records at the start and end boundaries in a non-UTC timezone

Reference: [Moodle Developer Documentation](https://moodledev.io)
