---
title: Load Legacy Moodle Libs Before Using Their Symbols
impact: CRITICAL
impactDescription: Prevents Class not found and Undefined constant failures in namespaced plugin code
tags: moodle, require_once, tablelib, locallib, namespaces, constants
---

## Load Legacy Moodle Libs Before Using Their Symbols

**Impact: CRITICAL (prevents Class not found and Undefined constant failures in namespaced plugin code)**

Many Moodle symbols are still provided by include files rather than the class autoloader: `table_sql` / `flexible_table` (`lib/tablelib.php`), activity constants such as `ASSIGN_*` (`mod/assign/locallib.php`), and similar legacy helpers. Namespaced plugin classes must `require_once` those libs before use, and must reference global constants with a leading `\`.

Wrong:

```php
namespace local_example\table;

class pending_table extends \table_sql { // Class "table_sql" not found
}

namespace local_example\detector;

$status = ASSIGN_SUBMISSION_STATUS_SUBMITTED;
// Resolves as local_example\detector\ASSIGN_SUBMISSION_STATUS_SUBMITTED
```

Preferred:

```php
namespace local_example\table;

defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->libdir . '/tablelib.php');

class pending_table extends \table_sql {
}

namespace local_example\detector;

defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->dirroot . '/mod/assign/locallib.php');

$status = \ASSIGN_SUBMISSION_STATUS_SUBMITTED;
$released = \ASSIGN_MARKING_WORKFLOW_STATE_RELEASED;
```

Why it matters:

- Autoload covers many modern classes, but not every historical Moodle symbol
- Inside a namespace, bare constants are looked up locally first
- Failures often appear only on the page or cron path that first hits the class

Recommended remediation:

- Require the owning lib next to the first use of the symbol
- Prefer leading `\` for global constants and class aliases from includes
- Mirror how core callers include the same lib in the target Moodle branch
- Cover the failing page/task in a smoke path after the fix

Reference: [Coding style](https://moodledev.io/general/development/policies/codingstyle)
