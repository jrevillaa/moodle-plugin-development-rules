---
title: Validate External API Contracts And Minimize Service Exposure
impact: HIGH
impactDescription: Prevents weak web service contracts, missing access validation, and overexposed endpoints
tags: moodle, external, webservice, validation, services
---

## Validate External API Contracts And Minimize Service Exposure

**Impact: HIGH (prevents weak web service contracts, missing access validation, and overexposed endpoints)**

External APIs should define explicit input and output contracts, validate parameters and context early, and expose only the minimum necessary surface in `db/services.php`.

Wrong:

```php
namespace local_example\external;

class enrol_users extends \external_api {
    public static function execute($courseid, $userid) {
        global $DB;

        $DB->insert_record('local_example_enrolments', [
            'courseid' => $courseid,
            'userid' => $userid,
        ]);

        return ['ok' => true];
    }
}
```

Preferred:

```php
namespace local_example\external;

class enrol_users extends \external_api {
    public static function execute_parameters(): \external_function_parameters {
        return new \external_function_parameters([
            'courseid' => new \external_value(PARAM_INT, 'Course id'),
            'userid' => new \external_value(PARAM_INT, 'User id'),
        ]);
    }

    public static function execute(int $courseid, int $userid): array {
        $params = self::validate_parameters(self::execute_parameters(), [
            'courseid' => $courseid,
            'userid' => $userid,
        ]);

        $context = \context_course::instance($params['courseid']);
        self::validate_context($context);
        require_capability('local/example:enrol', $context);

        return ['ok' => true];
    }

    public static function execute_returns(): \external_single_structure {
        return new \external_single_structure([
            'ok' => new \external_value(PARAM_BOOL, 'Whether the enrolment completed'),
        ]);
    }
}
```

Why it matters:

- External functions are framework contracts, not loose helper methods
- Missing `validate_parameters()` or `validate_context()` weakens security and input guarantees
- Weak `execute_returns()` definitions make clients brittle and hard to maintain
- Broad or careless `db/services.php` exposure increases attack surface and coupling

Recommended remediation:

- Define `execute_parameters()`, `execute()`, and `execute_returns()` explicitly
- Call `validate_parameters()` before touching domain data
- Resolve and validate the correct context before capability checks
- Keep `db/services.php` entries minimal, accurate, and capability-bounded
- Expose only the endpoints and service bundles that are actually needed

Reference: [External API](https://moodledev.io/docs/apis/subsystems/external)
