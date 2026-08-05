---
title: Keep Upgrade Steps Self-Contained And Stable
impact: CRITICAL
impactDescription: Prevents upgrade failures caused by unavailable or evolving plugin classes
tags: moodle, upgrade, classmap, deployment, compatibility
---

## Keep Upgrade Steps Self-Contained And Stable

**Impact: CRITICAL (prevents upgrade failures caused by unavailable or evolving plugin classes)**

Code in `db/upgrade.php` is historical migration code. Keep each step self-contained with XMLDB, Moodle DML, literal legacy values, and configuration APIs. Do not call new classes from the same plugin: autoload discovery may not yet include them during upgrade, and later class changes can break old migration paths.

Wrong:

```php
if ($oldversion < 2026080500) {
    \local_example\deletion_service::refresh_batch($batchid);
    set_config('status', \local_example\deletion_service::STATUS_DELETED, 'local_example');
    upgrade_plugin_savepoint(true, 2026080500, 'local', 'example');
}
```

Preferred:

```php
if ($oldversion < 2026080500) {
    // Keep the legacy value local to this frozen migration step.
    $deletedstatus = 3;
    $DB->set_field('local_example_batch', 'status', $deletedstatus, ['id' => $batchid]);
    set_config('status', $deletedstatus, 'local_example');
    upgrade_plugin_savepoint(true, 2026080500, 'local', 'example');
}
```

Why it matters:

- Plugin class discovery may be stale while Moodle is upgrading newly deployed code
- Historical upgrade steps must keep working after domain classes and constants evolve
- A failed upgrade blocks administration pages, CLI upgrade, and deployment

Recommended remediation:

- Limit upgrade steps to XMLDB, parameterized DML/SQL, literal legacy values, and `get_config()` / `set_config()`
- Duplicate only the minimum migration-specific SQL instead of calling mutable plugin services
- Queue post-upgrade work only after the savepoint when it is safe and explicitly designed to be deferred
- Test the upgrade path from a representative older plugin version

Reference: [Upgrade API](https://moodledev.io/docs/guides/upgrade)
