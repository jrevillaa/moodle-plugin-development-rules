---
title: Protect Multi-Step External Writes With Transaction And Recovery Design
impact: HIGH
impactDescription: Prevents inconsistent Moodle state when write-oriented external APIs fail mid-operation
tags: moodle, external, webservice, transactions, rollback, write
---

## Protect Multi-Step External Writes With Transaction And Recovery Design

**Impact: HIGH (prevents inconsistent Moodle state when write-oriented external APIs fail mid-operation)**

When an external API performs multiple related writes, do not assume the happy path. Design the endpoint so partial failure does not leave Moodle data in an inconsistent state.

Wrong:

```php
namespace local_example\external;

class import_enrolments extends \external_api {
    public static function execute(int $courseid, array $userids): array {
        global $DB;

        foreach ($userids as $userid) {
            $DB->insert_record('local_example_queue', [
                'courseid' => $courseid,
                'userid' => $userid,
            ]);

            enrol_try_internal_enrol($courseid, $userid);
        }

        return ['ok' => true];
    }
}
```

Preferred:

```php
namespace local_example\external;

class import_enrolments extends \external_api {
    public static function execute(int $courseid, array $userids): array {
        global $DB;

        $transaction = $DB->start_delegated_transaction();

        foreach ($userids as $userid) {
            $DB->insert_record('local_example_queue', [
                'courseid' => $courseid,
                'userid' => $userid,
            ]);

            enrol_try_internal_enrol($courseid, $userid);
        }

        $transaction->allow_commit();

        return ['ok' => true];
    }
}
```

Why it matters:

- External write endpoints often create or update several related Moodle records in sequence
- A failure in the middle of the operation can leave partial queue entries, half-created entities, or mismatched state
- Recovery behavior is part of the contract, especially for enrolment, activity creation, grading, or bulk-import endpoints

Recommended remediation:

- Review whether the endpoint needs a delegated transaction or another explicit recovery strategy
- Define what should happen on partial failure: rollback, skip-and-report, or resumable recovery
- Add tests for interrupted processing and partial-write scenarios
- Keep the write path focused so transaction boundaries are easy to reason about

Reference: [External API](https://moodledev.io/docs/apis/subsystems/external)
