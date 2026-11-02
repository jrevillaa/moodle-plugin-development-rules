---
title: Set Explicit Defaults When Creating Activities Outside Form API
impact: HIGH
impactDescription: Prevents NOT NULL insert failures when add_moduleinfo runs from CLI or seed scripts
tags: moodle, add_moduleinfo, cli, seed, assign, feedback, quiz, defaults
---

## Set Explicit Defaults When Creating Activities Outside Form API

**Impact: HIGH (prevents NOT NULL insert failures when add_moduleinfo runs from CLI or seed scripts)**

`add_moduleinfo()` and related module factories do not reliably apply the defaults that the browser Form API would. In CLI seeds, generators, and repair scripts—especially under MySQL strict mode—unset fields become SQL `NULL` and fail columns defined as `NOT NULL` without a DB default.

Wrong:

```php
$moduleinfo = (object) [
    'modulename' => 'assign',
    'module' => $assignmoduleid,
    'name' => 'Demo task',
    'course' => $course->id,
    'section' => 0,
    'visible' => 1,
    'duedate' => time() - DAYSECS,
    'grade' => 20,
    'markingworkflow' => 1,
];
add_moduleinfo($moduleinfo, $course); // submissiondrafts / notifications / dates often NULL
```

Preferred:

```php
$moduleinfo = (object) [
    'modulename' => 'assign',
    'module' => $assignmoduleid,
    'name' => 'Demo task',
    'course' => $course->id,
    'section' => 0,
    'visible' => 1,
    'intro' => '',
    'introformat' => FORMAT_HTML,
    'alwaysshowdescription' => 1,
    'submissiondrafts' => 0,
    'requiresubmissionstatement' => 0,
    'sendnotifications' => 0,
    'sendlatenotifications' => 0,
    'sendstudentnotifications' => 0,
    'allowsubmissionsfromdate' => 0,
    'duedate' => time() - DAYSECS,
    'cutoffdate' => time(),
    'gradingduedate' => time() + DAYSECS,
    'grade' => 20,
    'teamsubmission' => 0,
    'requireallteammemberssubmit' => 0,
    'blindmarking' => 0,
    'markingworkflow' => 1,
    'markingallocation' => 0,
    'attemptreopenmethod' => 'none',
    'assignsubmission_onlinetext_enabled' => 1,
];
add_moduleinfo($moduleinfo, $course);
```

Why it matters:

- Web defaults come from forms and editors, not from `add_moduleinfo` alone
- Strict SQL modes turn missing defaults into hard insert errors mid-seed
- Partial seeds leave courses half-created and confuse later cron/demo runs

Recommended remediation:

- Inspect the module `install.xml` / form defaults for `NOT NULL` fields before writing seed code
- Set every required scalar explicitly (`0`, `''`, `'none'`, `FORMAT_HTML`, …)
- For `feedback`, include text/editor fields such as `page_after_submit` / format; for `quiz`, set behaviour and attempt defaults
- Catch `dml_exception` in CLI seeds and print `$e->debuginfo` so the next missing column is obvious
- Make seeds idempotent: reuse existing courses/modules instead of recreating on every failure

Reference: [Activity modules](https://moodledev.io/docs/apis/plugintypes/mod)
