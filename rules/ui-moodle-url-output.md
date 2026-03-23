---
title: Use Moodle URLs and Output Helpers
impact: MEDIUM
impactDescription: Improves output safety and keeps navigation code Moodle-native
tags: moodle, moodle_url, output, navigation
---

## Use Moodle URLs and Output Helpers

**Impact: MEDIUM (improves output safety and keeps navigation code Moodle-native)**

Do not build internal URLs or action markup by hand when Moodle provides URL and output helpers.

Wrong:

```php
$url = '/local/example/view.php?id=' . $id;
echo '<a href="' . $url . '">Open</a>';
```

Preferred:

```php
$url = new moodle_url('/local/example/view.php', ['id' => $id]);
echo html_writer::link($url, get_string('open', 'local_example'));
```

Why it matters:

- Moodle helpers reduce brittle string concatenation
- URL generation becomes safer and more maintainable
- Output helpers align actions with Moodle conventions

Recommended remediation:

- Build internal routes with `moodle_url`
- Use output helpers and renderer methods for actions and UI fragments

Reference: [Moodle Developer Documentation](https://moodledev.io)
