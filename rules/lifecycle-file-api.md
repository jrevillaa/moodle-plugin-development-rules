---
title: Use Moodle File API for Managed Files
impact: MEDIUM
impactDescription: Prevents brittle file handling and permission mistakes
tags: moodle, file-api, draft, files
---

## Use Moodle File API for Managed Files

**Impact: MEDIUM (prevents brittle file handling and permission mistakes)**

Managed files should use Moodle File API and its lifecycle patterns instead of custom file handling assumptions.

Wrong:

```php
move_uploaded_file($_FILES['attachment']['tmp_name'], '/tmp/example.txt');
```

Preferred:

```php
$draftitemid = file_get_submitted_draft_itemid('attachment');
file_save_draft_area_files(
    $draftitemid,
    $context->id,
    'local_example',
    'attachment',
    $itemid,
    ['subdirs' => 0]
);
```

Why it matters:

- File lifecycle in Moodle is context-aware and permission-sensitive
- Custom file handling bypasses expected draft and storage flows
- File API reduces portability and access-control mistakes

Recommended remediation:

- Use draft item flows and named file areas
- Align file access with context and capability rules

Reference: [Moodle Developer Documentation](https://moodledev.io)
