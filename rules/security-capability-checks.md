---
title: Resolve Context and Enforce Capabilities Early
impact: CRITICAL
impactDescription: Prevents unauthorized access and insecure server-side actions
tags: moodle, capability, context, security
---

## Resolve Context and Enforce Capabilities Early

**Impact: CRITICAL (prevents unauthorized access and insecure server-side actions)**

Resolve the correct Moodle context before processing a page, action, export, AJAX request, or external function. UI visibility is never a substitute for server-side authorization.

Wrong:

```php
$id = required_param('id', PARAM_INT);
$record = $DB->get_record('local_example_items', ['id' => $id], '*', MUST_EXIST);

if (optional_param('delete', 0, PARAM_BOOL)) {
    $DB->delete_records('local_example_items', ['id' => $id]);
}
```

Preferred:

```php
$id = required_param('id', PARAM_INT);
$record = $DB->get_record('local_example_items', ['id' => $id], '*', MUST_EXIST);
$context = context_system::instance();

require_login();
require_capability('local/example:manage', $context);

if (optional_param('delete', 0, PARAM_BOOL)) {
    require_sesskey();
    $DB->delete_records('local_example_items', ['id' => $id]);
}
```

Why it matters:

- Capabilities are mandatory framework boundaries in Moodle
- State-changing actions must be protected server-side
- The correct context determines who is actually allowed to act

Recommended remediation:

- Resolve the target context first
- Require login where appropriate
- Enforce the capability before processing the action
- Add sesskey validation for state-changing requests

Reference: [Access API](https://moodledev.io/docs/apis/subsystems/access)
