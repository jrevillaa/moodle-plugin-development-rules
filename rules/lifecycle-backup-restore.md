---
title: Review Backup And Restore When Domain Data Must Travel With The Course
impact: MEDIUM-HIGH
impactDescription: Prevents silent data loss when courses are backed up, restored, or duplicated
tags: moodle, backup, restore, lifecycle, mod, portability
---

## Review Backup And Restore When Domain Data Must Travel With The Course

**Impact: MEDIUM-HIGH (prevents silent data loss when courses are backed up, restored, or duplicated)**

If a plugin stores course-scoped or activity-scoped domain data that should survive backup, restore, import, or course copy, implement Moodle backup/restore support for that plugin type instead of assuming the database rows will travel automatically.

Wrong:

```php
// Activity stores important settings and user attempts in plugin tables,
// but no backup/restore classes are provided for the module.
$DB->insert_record('example', [
    'course' => $courseid,
    'name' => $name,
    'intro' => $intro,
]);
```

Preferred:

```php
// For a mod_* plugin, provide backup and restore steps that include
// the activity structure and related records that must travel with the course.
class backup_example_activity_structure_step extends backup_activity_structure_step {
    protected function define_structure() {
        $example = new backup_nested_element('example', ['id'], ['name', 'intro', 'introformat']);
        $example->set_source_table('example', ['id' => backup::VAR_ACTIVITYID]);
        return $this->prepare_activity_structure($example);
    }
}
```

Why it matters:

- Course backup/restore and copy flows are part of Moodle data portability
- Missing backup/restore support silently drops plugin data during common admin operations
- Activity modules and other course-attached plugin types have stronger expectations here than generic `local` plugins

Recommended remediation:

- Decide whether the stored data must survive backup, restore, import, or course copy
- For `mod_*` and other course-attached types, implement the expected backup/restore classes and structure steps
- Include related files and user data only when the plugin type and privacy boundaries require it
- Cover restore with automated tests when the structure is non-trivial

Reference: [Backup API](https://moodledev.io/docs/apis/subsystems/backup)
