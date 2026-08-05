# Events Tasks And Cache

Formal rule companions:

- `rules/async-scheduled-task.md`
- `rules/async-adhoc-deferred-work.md`
- `rules/async-task-progress-and-manual-run.md`
- `rules/async-events-observers.md`
- `rules/async-cache-invalidation.md`

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

## Narrate Progress And Manual Runs

Multi-step background work—especially chained outbound web-service calls that build the next request from the previous response—must narrate progress.

Prefer:

- `mtrace()` at each meaningful step so scheduled-task / cron logs show where work started, advanced, skipped, or failed
- A manual-run UI that streams task output live and ends with a return action, matching core `tool_task` “Run now” behavior
- Queueing the work when an interactive stream is not required, while still keeping `mtrace` for later diagnosis

Avoid:

- An Execute button that leaves the browser spinning until the whole pipeline finishes with no intermediate output
- Silent task bodies that only succeed or throw at the end of a long chain
- Custom spinners that hide timeouts and give operators no stage marker when the process dies
## Use Hooks And Callbacks Before Custom Plumbing

When Moodle exposes a hook or callback for the needed behavior, prefer it over custom registry or bootstrap logic.

## Cache Intentionally

Use caching only when there is a repeated-read problem worth solving. Define the cache scope and invalidation strategy up front.

Prefer:

- Cached derived data that is expensive to compute repeatedly
- Explicit invalidation tied to the data lifecycle
- Cache definitions declared in `db/caches.php`

Avoid:

- Caching data with unclear invalidation rules
- Using cache to hide inefficient queries that should be fixed first
- Theme or summary caches that never reset after settings or source data change

## Review Heuristics

Flag the implementation if you see:

- Expensive work performed synchronously in request flow without need
- Recurrent jobs implemented in page code instead of scheduled tasks
- One-off deferred work forced into a scheduled task instead of an adhoc task
- Execute / Run buttons that start multi-step or chained remote work behind a silent spinner
- Task `execute()` methods with no `mtrace` between meaningful stages of a long pipeline
- Manual-run pages that finish without streamed progress and a return action
- Observer logic used where a direct service call is more correct
- Cache introduced without invalidation strategy

## Remediation Language

Use wording like:

- "Move this repeated maintenance work into a scheduled task."
- "Dispatch this heavy follow-up operation through an adhoc task."
- "Add `mtrace` at each remote step so cron logs show where the chain failed."
- "Replace the silent spinner with a streamed task-output view and a return button, like tool_task."
- "Use an observer only if this truly belongs to the event lifecycle."
- "Define cache invalidation explicitly before introducing this cache."
