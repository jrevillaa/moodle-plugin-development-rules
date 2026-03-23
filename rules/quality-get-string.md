---
title: Move User-Facing Text to Language Strings
impact: MEDIUM
impactDescription: Improves translation support and consistency
tags: moodle, strings, get_string, i18n
---

## Move User-Facing Text to Language Strings

**Impact: MEDIUM (improves translation support and consistency)**

Do not hardcode user-facing text in PHP, templates, or UI setup when it belongs in the language pack.

Wrong:

```php
$PAGE->set_title('Manage items');
echo html_writer::tag('button', 'Save');
```

Preferred:

```php
$PAGE->set_title(get_string('manageitems', 'local_example'));
echo html_writer::tag('button', get_string('savechanges'));
```

Why it matters:

- Hardcoded text weakens translation support
- Language strings improve consistency across Moodle UI
- String identifiers make future maintenance easier

Recommended remediation:

- Move labels, headings, buttons, and notifications to the language pack
- Use `get_string()` consistently for user-facing text

Reference: [Moodle Developer Documentation](https://moodledev.io)
