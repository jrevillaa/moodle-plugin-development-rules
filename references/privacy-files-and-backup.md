# Privacy Files And Backup

## Respect Privacy API Boundaries

When the plugin stores, exports, or deletes personal data, implement the relevant Moodle Privacy API responsibilities instead of ad hoc data handling.

Review privacy impact whenever the plugin:

- Stores user-generated content
- Tracks activity or status by user
- Exposes exports
- Deletes or anonymizes data

## Use File API Correctly

Use Moodle File API for managed files, draft areas, and stored file lifecycle. Do not treat uploaded files as arbitrary filesystem artifacts.

Prefer:

- Proper file areas
- Draft-to-permanent flows where the subsystem expects them
- File access checks aligned with context and capability rules

Avoid:

- Custom file storage conventions outside Moodle file abstractions
- Direct path assumptions that bypass file lifecycle handling

## Handle Backup And Restore Deliberately

If the plugin stores meaningful domain data that should survive course or site lifecycle operations, review whether backup and restore support is required by the plugin type and use case.

Do not assume backup/restore is irrelevant without checking the plugin's role in Moodle data portability.

## Review Heuristics

Flag the implementation if you see:

- User data stored with no privacy consideration
- Managed files handled outside Moodle File API
- File access not protected by context and capability checks
- Domain data introduced without reviewing backup/restore implications

## Remediation Language

Use wording like:

- "This feature stores user data; review the plugin's Privacy API obligations."
- "Use Moodle File API and draft handling here instead of custom file plumbing."
- "Check whether this data needs backup and restore support for the plugin type."
