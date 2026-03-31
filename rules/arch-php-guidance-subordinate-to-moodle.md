---
title: Keep Generic PHP Best Practices Subordinate To Moodle Conventions
impact: HIGH
impactDescription: Prevents PSR and SOLID advice from fighting Moodle-native APIs and structure
tags: moodle, php, psr, solid, architecture, conventions
---

## Keep Generic PHP Best Practices Subordinate To Moodle Conventions

**Impact: HIGH (prevents PSR and SOLID advice from fighting Moodle-native APIs and structure)**

Use PSR, SOLID, and general PHP best practices as supporting heuristics, not as primary architecture rules for Moodle plugins. When generic PHP advice conflicts with Moodle APIs, file layout, globals, callbacks, or subsystem conventions, prefer Moodle.

Wrong:

```php
class delete_item_service {
    public function __construct(
        private request_interface $request,
        private authorization_interface $authorization,
        private item_repository_interface $items,
    ) {}

    public function handle(): void {
        $id = (int)$this->request->get('id');

        if (!$this->authorization->allows('local/example:manage')) {
            throw new forbidden_exception();
        }

        $this->items->delete($id);
    }
}
```

Preferred:

```php
$id = required_param('id', PARAM_INT);
$context = context_system::instance();

require_login();
require_capability('local/example:manage', $context);
require_sesskey();

$DB->delete_records('local_example_items', ['id' => $id]);
```

Why it matters:

- Moodle already provides framework-native ways to resolve parameters, context, capabilities, URLs, rendering, forms, files, and persistence
- Forcing generic service layers or PSR-style abstractions everywhere can hide the real Moodle integration points and make plugins harder to maintain
- Good PHP design still matters, but it should strengthen Moodle structure instead of replacing it

Recommended remediation:

- Apply SOLID only where it clarifies a real domain responsibility
- Prefer Moodle APIs over raw PHP or framework-agnostic abstractions when Moodle already solves the problem
- Follow Moodle file placement, callback shapes, naming, and subsystem structure before importing generic PSR preferences
- Extract helpers or services only when they reduce real coupling, not just to satisfy abstract design purity

Reference: [Moodle Developer Documentation](https://moodledev.io)
