---
title: Define Cache Scope And Invalidation Before Caching
impact: MEDIUM
impactDescription: Prevents stale data and cache-driven bugs when derived results are stored
tags: moodle, cache, invalidation, async, performance
---

## Define Cache Scope And Invalidation Before Caching

**Impact: MEDIUM (prevents stale data and cache-driven bugs when derived results are stored)**

Introduce Moodle cache only when there is a repeated-read cost worth paying for. Define the cache definition, key scope, and invalidation path before shipping the cache write.

Wrong:

```php
$cache = \cache::make('local_example', 'summary');
$cache->set($courseid, local_example_build_summary($courseid));
// Writers later update source tables with no purge or set overwrite.
```

Preferred:

```php
$cache = \cache::make('local_example', 'summary');
$summary = $cache->get($courseid);
if ($summary === false) {
    $summary = local_example_build_summary($courseid);
    $cache->set($courseid, $summary);
}

// On mutation:
$cache->delete($courseid);
```

Why it matters:

- Cache without invalidation silently serves stale Moodle data
- Cache is not a substitute for fixing an inefficient query shape
- Explicit keys and purge points make cache behavior reviewable

Recommended remediation:

- Declare the cache in `db/caches.php` with a clear purpose
- Invalidate or replace entries on every relevant write path
- Prefer fixing the query or moving work to a task before adding cache

Reference: [Cache API](https://moodledev.io/docs/apis/subsystems/cache)
