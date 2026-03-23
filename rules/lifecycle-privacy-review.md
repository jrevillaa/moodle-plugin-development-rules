---
title: Review Privacy API Obligations for User Data
impact: MEDIUM
impactDescription: Prevents hidden personal-data liabilities in plugin features
tags: moodle, privacy, user-data, lifecycle
---

## Review Privacy API Obligations for User Data

**Impact: MEDIUM (prevents hidden personal-data liabilities in plugin features)**

Whenever a plugin stores or exports data tied to users, review whether the feature creates Privacy API obligations.

Wrong:

```php
$record = (object)[
    'userid' => $USER->id,
    'notes' => $notes,
];
$DB->insert_record('local_example_notes', $record);
```

Preferred:

```php
// Store the data intentionally and review whether the plugin needs
// privacy metadata, export, or deletion support for these records.
$record = (object)[
    'userid' => $USER->id,
    'notes' => $notes,
];
$DB->insert_record('local_example_notes', $record);
```

Why it matters:

- User-linked data may trigger export and deletion responsibilities
- Privacy obligations are easy to overlook during feature development
- The review should happen when the feature is introduced, not later

Recommended remediation:

- Audit whether the feature stores personal data
- Review the relevant Privacy API requirements for the plugin type
- Do not assume user-linked data is operationally trivial

Reference: [Privacy API](https://moodledev.io/docs/apis/subsystems/privacy)
