---
title: Use Clear Labels and Accessible Actions
impact: MEDIUM
impactDescription: Improves accessibility and UI clarity for Moodle users
tags: moodle, accessibility, labels, ui
---

## Use Clear Labels and Accessible Actions

**Impact: MEDIUM (improves accessibility and UI clarity for Moodle users)**

Form controls, action links, and icon-driven UI should expose clear accessible meaning.

Wrong:

```php
echo '<a href="' . $url . '"><i class="icon fa fa-edit"></i></a>';
```

Preferred:

```php
echo $OUTPUT->action_icon(
    $url,
    new pix_icon('t/edit', get_string('edit'))
);
```

Why it matters:

- Icon-only actions can be ambiguous or inaccessible
- Clear action text and labels improve usability for all users
- Moodle output helpers often provide better semantics than raw markup

Recommended remediation:

- Prefer output helpers with accessible labels
- Make sure action meaning is explicit in strings or accessible text

Reference: [Moodle Developer Documentation](https://moodledev.io)
