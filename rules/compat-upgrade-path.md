---
title: Route Persistent Changes Through Moodle Upgrades
impact: CRITICAL
impactDescription: Prevents broken deployments and inconsistent schema state
tags: moodle, upgrade, version, install
---

## Route Persistent Changes Through Moodle Upgrades

**Impact: CRITICAL (prevents broken deployments and inconsistent schema state)**

Schema changes, new capabilities, and persistent configuration evolution should go through Moodle's upgrade path rather than ad hoc runtime fixes.

Wrong:

```php
if (!$DB->get_manager()->field_exists($table, $field)) {
    $DB->get_manager()->add_field($table, $field);
}
```

Preferred:

```php
function xmldb_local_example_upgrade($oldversion) {
    global $DB;

    $dbman = $DB->get_manager();

    if ($oldversion < 2026032300) {
        $table = new xmldb_table('local_example_items');
        $field = new xmldb_field('status', XMLDB_TYPE_CHAR, '20', null, null, null, 'draft');

        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        upgrade_plugin_savepoint(true, 2026032300, 'local', 'example');
    }

    return true;
}
```

Why it matters:

- Runtime schema mutation is brittle and hard to reason about
- Moodle expects persistent changes to be versioned and repeatable
- Upgrade paths must be deterministic across environments

Recommended remediation:

- Put schema evolution in `db/upgrade.php`
- Update `version.php` when needed
- Review install XML and capabilities alongside structural changes

Reference: [Moodle Developer Documentation](https://moodledev.io)
