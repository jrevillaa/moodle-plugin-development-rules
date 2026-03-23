---
title: Render Non-Trivial Views Through Mustache and Renderers
impact: HIGH
impactDescription: Improves separation of concerns and Moodle-native UI structure
tags: moodle, mustache, renderer, output
---

## Render Non-Trivial Views Through Mustache and Renderers

**Impact: HIGH (improves separation of concerns and Moodle-native UI structure)**

Do not concatenate substantial view markup directly in PHP. Prepare data in PHP and render non-trivial UI through Mustache and renderer or output classes.

Wrong:

```php
echo '<div class="card">';
echo '<h3>' . format_string($item->name) . '</h3>';
echo '<p>' . s($item->description) . '</p>';
echo '</div>';
```

Preferred:

```php
$data = [
    'name' => format_string($item->name),
    'description' => format_text($item->description, FORMAT_HTML),
];

echo $OUTPUT->render_from_template('local_example/item_card', $data);
```

Why it matters:

- Rendering logic should not be mixed with data access and control flow
- Mustache templates make non-trivial UI more maintainable and reusable
- Renderer flow fits Moodle's output conventions

Recommended remediation:

- Prepare template data in PHP
- Move markup to a Mustache template
- Use renderers or output classes for reusable view flows

Reference: [Templates Guide](https://moodledev.io/docs/guides/templates)
