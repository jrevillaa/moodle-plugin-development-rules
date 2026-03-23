# Events Tasks And Cache

## Use Events And Observers Deliberately

Use Moodle events and observers when behavior should react to domain changes instead of being wired manually into unrelated page flows.

Prefer observers when:

- The reaction should happen consistently across entrypoints
- The triggering action may happen from multiple paths
- The logic is cross-cutting and belongs to the domain lifecycle

Avoid using observers for work that should be a direct transactional part of the calling use case.

## Choose The Right Background Mechanism

Use scheduled tasks for recurring maintenance work. Use adhoc tasks for deferred one-off processing. Do not block page requests with expensive work if the operation can be deferred safely.

Prefer:

- Scheduled tasks for recurrent sync, cleanup, recalculation, or integrity routines
- Adhoc tasks for expensive follow-up work triggered by user actions or events

## Use Hooks And Callbacks Before Custom Plumbing

When Moodle exposes a hook or callback for the needed behavior, prefer it over custom registry or bootstrap logic.

## Cache Intentionally

Use caching only when there is a repeated-read problem worth solving. Define the cache scope and invalidation strategy up front.

Prefer:

- Cached derived data that is expensive to compute repeatedly
- Explicit invalidation tied to the data lifecycle

Avoid:

- Caching data with unclear invalidation rules
- Using cache to hide inefficient queries that should be fixed first

## Review Heuristics

Flag the implementation if you see:

- Expensive work performed synchronously in request flow without need
- Recurrent jobs implemented in page code instead of scheduled tasks
- Observer logic used where a direct service call is more correct
- Cache introduced without invalidation strategy

## Remediation Language

Use wording like:

- "Move this repeated maintenance work into a scheduled task."
- "Dispatch this heavy follow-up operation through an adhoc task."
- "Use an observer only if this truly belongs to the event lifecycle."
- "Define cache invalidation explicitly before introducing this cache."
