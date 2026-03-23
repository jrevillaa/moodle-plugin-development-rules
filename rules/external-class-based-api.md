---
title: Prefer classes/external for New External APIs
impact: MEDIUM-HIGH
impactDescription: Improves structure, compatibility clarity, and maintainability
tags: moodle, external, webservice, api
---

## Prefer classes/external for New External APIs

**Impact: MEDIUM-HIGH (improves structure, compatibility clarity, and maintainability)**

When the supported Moodle version allows it, implement new web services in `classes/external/` instead of defaulting to legacy `externallib.php`.

Wrong:

```php
function local_example_get_items() {
    global $DB;
    return $DB->get_records('local_example_items');
}
```

Preferred:

```php
namespace local_example\external;

class get_items extends \external_api {
    public static function execute() {
        global $DB;
        return $DB->get_records('local_example_items');
    }
}
```

Why it matters:

- New external APIs should follow the modern namespaced structure when supported
- External transport code should be separated from broader plugin logic
- Class-based structure makes validation and return contracts easier to maintain

Recommended remediation:

- Place new external classes under `classes/external/`
- Keep parameter validation, access control, and return structure explicit
- Reuse domain logic instead of embedding it all in the external method

Reference: [External API](https://moodledev.io/docs/apis/subsystems/external)
