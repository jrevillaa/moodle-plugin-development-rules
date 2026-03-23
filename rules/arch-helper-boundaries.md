---
title: Keep Helpers Cohesive and Domain-Specific
impact: MEDIUM
impactDescription: Prevents generic helper dumping grounds and mixed responsibilities
tags: moodle, helpers, architecture, maintainability
---

## Keep Helpers Cohesive and Domain-Specific

**Impact: MEDIUM (prevents generic helper dumping grounds and mixed responsibilities)**

Create helper classes only when they encapsulate a real reusable domain responsibility. Avoid generic utility classes that mix formatting, DB access, permissions, and rendering.

Wrong:

```php
class helper {
    public static function get_items() {}
    public static function can_edit() {}
    public static function render_table() {}
}
```

Preferred:

```php
class item_query_helper {
    public static function get_filtered_items(array $filters): array {
        // Query-focused responsibility.
    }
}
```

Why it matters:

- Generic helpers become maintenance hotspots quickly
- Mixed responsibilities hide architecture problems
- Moodle code is easier to review when responsibilities are explicit

Recommended remediation:

- Split helpers by domain responsibility
- Keep rendering, access checks, and DB queries in their proper layers
- Prefer more specific names over generic utility buckets

Reference: [Moodle Developer Documentation](https://moodledev.io)
