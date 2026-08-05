---
title: Use Events And Observers For Cross-Cutting Domain Reactions
impact: MEDIUM
impactDescription: Keeps lifecycle reactions consistent across entrypoints instead of duplicating side effects
tags: moodle, events, observers, async, lifecycle
---

## Use Events And Observers For Cross-Cutting Domain Reactions

**Impact: MEDIUM (keeps lifecycle reactions consistent across entrypoints instead of duplicating side effects)**

When a domain change should trigger the same follow-up from multiple entrypoints, prefer Moodle events and observers over copying side-effect calls into every page, form, or external function.

Wrong:

```php
// Called from several pages and an external API independently.
local_example_recalculate_progress($itemid);
local_example_notify_watchers($itemid);
```

Preferred:

```php
$event = \local_example\event\item_updated::create([
    'context' => $context,
    'objectid' => $itemid,
]);
$event->trigger();

// Observer reacts once for every entrypoint that triggers the event.
```

Why it matters:

- Domain reactions duplicated across pages drift and get missed on new entrypoints
- Events make lifecycle behavior explicit and auditable
- Observers belong to cross-cutting reactions, not to core transactional work that must succeed inline

Recommended remediation:

- Trigger a Moodle event at the domain change boundary
- Move shared reactions into observers registered in `db/events.php`
- Keep mandatory transactional work in the calling use case; use observers for consistent follow-up behavior

Reference: [Events API](https://moodledev.io/docs/apis/core/events)
