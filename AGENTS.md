# Moodle Plugin Development Rules

**Version 3.1.0**  
Independent  
August 2026

> **Note:**  
> This document is generated from the individual rule files in `rules/`.  
> It is a full catalog for humans and installers.  
> Agents should prefer `SKILL.md`, `references/rules-index.md`, and on-demand `rules/` files instead of loading this whole document.

---

## Abstract

Comprehensive Moodle plugin development, maintainability, and always-on release-safety guide for AI agents and reviewers. Covers Moodle-native architecture, thin entrypoints, guard clauses, spaghetti and duplication control, loop cost, file decomposition, self-contained upgrades, verified core APIs/schema, consistent queue and status workflows, capabilities, forms, admin page setup and breadcrumbs, contextual operational UI, renderers, Mustache, AMD JavaScript, DB API usage, external API contracts, outbound HTTP query-separator safety, token/service verification, idempotent delivery, events/observers, tasks with mtrace progress narration and Moodle-native manual-run output, cache invalidation, PHP compatibility, Moodle 5.x Boost/Bootstrap 5.3, privacy, files, backup/restore, legacy parity, and scenario-based testing. Agents load SKILL.md plus on-demand rules/references; AGENTS.md remains a generated full catalog, not the default runtime context. Findings are prioritized for audit workflows and completed changes pass a proportionate release gate.

---

## Rule Files

- `amd-module-loading.md` - Implement Browser Logic as AMD Modules
- `arch-decompose-large-files.md` - Decompose Files Before They Sprawl
- `arch-guard-clauses-over-nesting.md` - Prefer Guard Clauses Over Deep Conditional Nesting
- `arch-helper-boundaries.md` - Keep Helpers Cohesive and Domain-Specific
- `arch-no-scattered-special-cases.md` - Do Not Scatter Special Cases Across Shared Moodle Flows
- `arch-php-guidance-subordinate-to-moodle.md` - Keep Generic PHP Best Practices Subordinate To Moodle Conventions
- `arch-single-canonical-implementation.md` - Keep One Canonical Implementation Per Domain Operation
- `arch-thin-entrypoints.md` - Keep Page Entrypoints Thin And Delegate Domain Work
- `async-adhoc-deferred-work.md` - Defer Expensive One-Off Work With Adhoc Tasks
- `async-cache-invalidation.md` - Define Cache Scope And Invalidation Before Caching
- `async-events-observers.md` - Use Events And Observers For Cross-Cutting Domain Reactions
- `async-scheduled-task.md` - Move Recurrent Heavy Work to Scheduled Tasks
- `async-task-progress-and-manual-run.md` - Narrate Task Progress And Never Run Heavy Work As A Silent Spinner
- `compat-php-version-gating.md` - Gate PHP Modernization By Moodle And PHP Support Matrix
- `compat-upgrade-path.md` - Route Persistent Changes Through Moodle Upgrades
- `compat-upgrade-self-contained.md` - Keep Upgrade Steps Self-Contained And Stable
- `compat-verify-core-contracts.md` - Verify Moodle APIs And Schema Before Using Them
- `data-db-api-choice.md` - Choose the Moodle DB API Based on Query Shape
- `data-inclusive-date-filters.md` - Translate Inclusive Calendar Dates Into Correct Timestamp Bounds
- `data-no-queries-in-loops.md` - Do Not Run Queries Or Heavy Work Inside Loops
- `data-paginated-tables.md` - Assume Report Tables Will Grow
- `data-persistence-flow-consistency.md` - Keep Persistence Contracts Consistent Across The Full Workflow
- `data-status-contract.md` - Define One Status Contract For Writers Readers And Parent Aggregates
- `data-status-labels-without-seed-dependency.md` - Do Not Depend On Seed Rows To Render Stable Status Labels
- `external-class-based-api.md` - Prefer classes/external for New External APIs
- `external-contract-and-exposure.md` - Validate External API Contracts And Minimize Service Exposure
- `external-http-query-separator.md` - Use Literal Ampersands When Building Outbound HTTP Query Strings
- `external-idempotent-delivery.md` - Make Retried External Deliveries Idempotent
- `external-service-token-verification.md` - Verify Service And Token Wiring Before External Release
- `external-write-transaction-safety.md` - Protect Multi-Step External Writes With Transaction And Recovery Design
- `lifecycle-backup-restore.md` - Review Backup And Restore When Domain Data Must Travel With The Course
- `lifecycle-file-api.md` - Use Moodle File API for Managed Files
- `lifecycle-privacy-review.md` - Review Privacy API Obligations for User Data
- `quality-accessible-labels.md` - Use Clear Labels and Accessible Actions
- `quality-get-string.md` - Move User-Facing Text to Language Strings
- `quality-reference-parity.md` - Prove Behavioral Parity When Replacing A Working Legacy Flow
- `quality-scenario-based-testing.md` - Test Features Against Expected Success And Failure Scenarios
- `quality-testing-coverage.md` - Add Automated Coverage for Non-Trivial Behavior
- `security-capability-checks.md` - Resolve Context and Enforce Capabilities Early
- `ui-admin-setup-and-breadcrumbs.md` - Set Up Admin Pages And Visible Breadcrumbs Correctly
- `ui-contextual-guidance.md` - Explain Operational Views Filters And Icon Actions In Context
- `ui-form-api.md` - Use Form API for Real Input Workflows
- `ui-moodle-url-output.md` - Use Moodle URLs and Output Helpers
- `ui-moodle5-theme.md` - Build Moodle 5.x UI On Boost And Bootstrap 5.3
- `ui-mustache-renderers.md` - Render Non-Trivial Views Through Mustache and Renderers

---

## Full Rules

### Implement Browser Logic as AMD Modules

**Impact:** HIGH (Aligns JavaScript with Moodle-native loading and modularity)

## Implement Browser Logic as AMD Modules

**Impact: HIGH (aligns JavaScript with Moodle-native loading and modularity)**

Do not require raw JavaScript files directly from PHP output for new plugin behavior. Put browser logic in `amd/src/` and load it through Moodle page requirements APIs.

Wrong:

```php
$PAGE->requires->js('/local/example/js/main.js');
```

Preferred:

```php
$PAGE->requires->js_call_amd('local_example/main', 'init', [$itemid]);
```

Why it matters:

- Moodle expects modular frontend code for maintainable plugin behavior
- AMD loading keeps browser behavior explicit and reusable
- Raw file loading encourages brittle and non-standard JS integration

Recommended remediation:

- Move the JS entrypoint to `amd/src/<module>.js`
- Expose an `init()` method
- Load it with `js_call_amd()`

Reference: [JavaScript Modules](https://moodledev.io/docs/guides/javascript/modules)

### Decompose Files Before They Sprawl

**Impact:** MEDIUM (Keeps plugin files scannable instead of accumulating unrelated responsibilities)

## Decompose Files Before They Sprawl

**Impact: MEDIUM (keeps plugin files scannable instead of accumulating unrelated responsibilities)**

Treat a change that pushes a plugin file past roughly a thousand lines as a decomposition signal, not a normal increment. In Moodle plugins this usually shows up as `locallib.php`, `lib.php`, or a single class absorbing unrelated responsibilities.

Wrong:

```php
// locallib.php keeps growing past 1000 lines.
function local_example_get_courses() { /* ... */ }
function local_example_render_table() { /* ... */ }
function local_example_send_report() { /* ... */ }
function local_example_sync_remote() { /* ... */ }
function local_example_build_zip() { /* ... */ }
```

Preferred:

```php
// classes/course_query.php, classes/output/course_table.php,
// classes/report_mailer.php, classes/remote_sync.php
$courses = (new \local_example\course_query())->get_filtered($filters);
echo $OUTPUT->render(new \local_example\output\course_table($courses));
```

Why it matters:

- Large mixed files hide responsibility boundaries and encourage more sprawl
- Autoloaded classes under `classes/` are easier to locate, test, and review
- Reviewers cannot reason about a diff inside a file they cannot scan

Recommended remediation:

- Split by responsibility into autoloaded classes under `classes/`
- Keep `lib.php` for Moodle callbacks rather than domain logic
- Decompose before adding to an already oversized file
- Waive the threshold only when the file stays clearly organized and cohesive

Reference: [Plugin files](https://moodledev.io/docs/apis/commonfiles)

### Prefer Guard Clauses Over Deep Conditional Nesting

**Impact:** MEDIUM-HIGH (Keeps Moodle logic readable by removing avoidable else branches and nesting)

## Prefer Guard Clauses Over Deep Conditional Nesting

**Impact: MEDIUM-HIGH (keeps Moodle logic readable by removing avoidable else branches and nesting)**

Handle invalid, empty, and unauthorized cases early and return. Avoid stacking `if`/`else` layers around the main path, and let Moodle's own `require_*` functions act as guards instead of wrapping logic in nested conditionals.

Wrong:

```php
public function process(int $itemid): string {
    if ($itemid > 0) {
        $item = $this->find($itemid);
        if ($item) {
            if (has_capability('local/example:manage', $this->context)) {
                if ($item->status === self::STATUS_QUEUED) {
                    return $this->run($item);
                } else {
                    return get_string('notqueued', 'local_example');
                }
            } else {
                return get_string('nopermission', 'local_example');
            }
        } else {
            return get_string('notfound', 'local_example');
        }
    } else {
        return get_string('invalidid', 'local_example');
    }
}
```

Preferred:

```php
public function process(int $itemid): string {
    require_capability('local/example:manage', $this->context);

    $item = $this->find($itemid);
    if (!$item) {
        throw new \moodle_exception('notfound', 'local_example');
    }

    if ($item->status !== self::STATUS_QUEUED) {
        return get_string('notqueued', 'local_example');
    }

    return $this->run($item);
}
```

Why it matters:

- Deep nesting hides which branch is the real behavior
- Long `else` chains make later edits attach new special cases to the wrong level
- Early failure handling matches Moodle's `require_login()` and `require_capability()` style

Recommended remediation:

- Validate input, existence, and access first, then return or throw
- Remove `else` branches that only exist because the failure case was not handled early
- Use Moodle exceptions or `moodle_exception` for genuinely exceptional states
- Extract a helper when a single function still needs many independent decisions

Reference: [Coding style](https://moodledev.io/general/development/policies/codingstyle)

### Keep Helpers Cohesive and Domain-Specific

**Impact:** MEDIUM (Prevents generic helper dumping grounds and mixed responsibilities)

## Keep Helpers Cohesive and Domain-Specific

**Impact: MEDIUM (prevents generic helper dumping grounds and mixed responsibilities)**

Create helper classes only when they encapsulate a real reusable domain responsibility. Avoid generic utility classes that mix formatting, DB access, permissions, and rendering.

Wrong:

```php
class helper {
    public static function get_items() {}
    public static function can_edit() {}
    public static function render_table() {}
}
```

Preferred:

```php
class item_query_helper {
    public static function get_filtered_items(array $filters): array {
        // Query-focused responsibility.
    }
}
```

Why it matters:

- Generic helpers become maintenance hotspots quickly
- Mixed responsibilities hide architecture problems
- Moodle code is easier to review when responsibilities are explicit

Recommended remediation:

- Split helpers by domain responsibility
- Keep rendering, access checks, and DB queries in their proper layers
- Prefer more specific names over generic utility buckets

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Do Not Scatter Special Cases Across Shared Moodle Flows

**Impact:** HIGH (Prevents spaghetti growth from ad hoc branches bolted into unrelated code paths)

## Do Not Scatter Special Cases Across Shared Moodle Flows

**Impact: HIGH (prevents spaghetti growth from ad hoc branches bolted into unrelated code paths)**

When a new requirement needs different behavior, do not sprinkle plugin-specific or mode-specific `if` checks through shared functions, renderers, tasks, and callbacks. Give the variation one owner: a dedicated class, a typed dispatch map, or a distinct method.

Wrong:

```php
function local_example_render_row($record, $mode = null, $isexport = false, $legacy = false) {
    if ($mode === 'seed' && !$legacy) {
        $label = get_string('seedrow', 'local_example');
    } else if ($isexport && $mode !== 'seed') {
        $label = $record->name;
    } else if ($legacy) {
        $label = $record->oldname ?? $record->name;
    } else {
        $label = format_string($record->name);
    }

    return $label;
}
```

Preferred:

```php
// One owner per behavior, selected explicitly.
$formatters = [
    'seed' => new \local_example\output\seed_row_formatter(),
    'export' => new \local_example\output\export_row_formatter(),
    'view' => new \local_example\output\view_row_formatter(),
];

$label = $formatters[$rowtype]->format($record);
```

Why it matters:

- Boolean and mode flags multiply until every caller must understand every branch
- Scattered special cases make Moodle callbacks, renderers, and tasks drift apart
- Each new case increases the risk of changing behavior for unrelated entrypoints

Recommended remediation:

- Replace flag parameters with explicit, named behaviors
- Dispatch on a documented type instead of chaining conditionals
- Keep shared Moodle functions generic and push variation to the caller's own class
- If a temporary branch is unavoidable, document why and when it is removed

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Keep Generic PHP Best Practices Subordinate To Moodle Conventions

**Impact:** HIGH (Prevents PSR and SOLID advice from fighting Moodle-native APIs and structure)

## Keep Generic PHP Best Practices Subordinate To Moodle Conventions

**Impact: HIGH (prevents PSR and SOLID advice from fighting Moodle-native APIs and structure)**

Use PSR, SOLID, and general PHP best practices as supporting heuristics, not as primary architecture rules for Moodle plugins. When generic PHP advice conflicts with Moodle APIs, file layout, globals, callbacks, or subsystem conventions, prefer Moodle.

Wrong:

```php
class delete_item_service {
    public function __construct(
        private request_interface $request,
        private authorization_interface $authorization,
        private item_repository_interface $items,
    ) {}

    public function handle(): void {
        $id = (int)$this->request->get('id');

        if (!$this->authorization->allows('local/example:manage')) {
            throw new forbidden_exception();
        }

        $this->items->delete($id);
    }
}
```

Preferred:

```php
$id = required_param('id', PARAM_INT);
$context = context_system::instance();

require_login();
require_capability('local/example:manage', $context);
require_sesskey();

$DB->delete_records('local_example_items', ['id' => $id]);
```

Why it matters:

- Moodle already provides framework-native ways to resolve parameters, context, capabilities, URLs, rendering, forms, files, and persistence
- Forcing generic service layers or PSR-style abstractions everywhere can hide the real Moodle integration points and make plugins harder to maintain
- Good PHP design still matters, but it should strengthen Moodle structure instead of replacing it

Recommended remediation:

- Apply SOLID only where it clarifies a real domain responsibility
- Prefer Moodle APIs over raw PHP or framework-agnostic abstractions when Moodle already solves the problem
- Follow Moodle file placement, callback shapes, naming, and subsystem structure before importing generic PSR preferences
- Extract helpers or services only when they reduce real coupling, not just to satisfy abstract design purity

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Keep One Canonical Implementation Per Domain Operation

**Impact:** HIGH (Prevents duplicated logic from drifting between pages, tasks, and external functions)

## Keep One Canonical Implementation Per Domain Operation

**Impact: HIGH (prevents duplicated logic from drifting between pages, tasks, and external functions)**

When the same domain operation is needed by a page, a task, a CLI script, and an external function, implement it once and call it from each entrypoint. Copy-pasted queries and rules drift as soon as one caller is fixed.

Wrong:

```php
// classes/task/process_queue.php
$items = $DB->get_records_select('local_example_items', 'status = 1 AND timequeued < ?', [time() - 60]);

// index.php
$items = $DB->get_records_select('local_example_items', 'status = 1', []);

// classes/external/get_pending.php
$items = $DB->get_records('local_example_items', ['status' => 1]);
```

Preferred:

```php
// classes/queue.php owns the query and its rules.
$items = (new \local_example\queue())->get_pending();
```

Why it matters:

- Divergent copies produce different results for the same question
- A bug fixed in one caller silently persists in the others
- Reviewers cannot tell which copy is authoritative

Recommended remediation:

- Extract the operation once into a cohesive, domain-named class or function
- Replace each duplicate with a call to the canonical implementation
- Reuse existing Moodle core and plugin helpers before writing a near-duplicate
- Extract only real duplication; do not create speculative service layers

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Keep Page Entrypoints Thin And Delegate Domain Work

**Impact:** HIGH (Prevents fat page scripts that mix routing, access, queries, mutation, and markup)

## Keep Page Entrypoints Thin And Delegate Domain Work

**Impact: HIGH (prevents fat page scripts that mix routing, access, queries, mutation, and markup)**

A Moodle page script should set up the request and delegate. Keep parameter reading, page/context setup, access checks, and output orchestration in the entrypoint, and move queries, mutations, and business rules into plugin classes.

Wrong:

```php
require(__DIR__ . '/../../config.php');

$action = optional_param('action', '', PARAM_ALPHA);
$context = context_system::instance();
require_login();

if ($action === 'delete') {
    $ids = required_param_array('ids', PARAM_INT);
    foreach ($ids as $id) {
        $record = $DB->get_record('local_example_items', ['id' => $id]);
        if ($record && $record->status != 3) {
            $DB->delete_records('local_example_files', ['itemid' => $id]);
            $DB->set_field('local_example_items', 'status', 3, ['id' => $id]);
            echo '<div class="alert">Deleted ' . $record->name . '</div>';
        }
    }
}
```

Preferred:

```php
require(__DIR__ . '/../../config.php');

$action = optional_param('action', '', PARAM_ALPHA);
$context = context_system::instance();

require_login();
require_capability('local/example:manage', $context);

$manager = new \local_example\item_manager();

if ($action === 'delete') {
    require_sesskey();
    $result = $manager->delete_items(required_param_array('ids', PARAM_INT));
    redirect($returnurl, get_string('itemsdeleted', 'local_example', $result->count));
}

echo $OUTPUT->header();
echo $renderer->render($manager->get_list_view($filters));
echo $OUTPUT->footer();
```

Why it matters:

- Fat entrypoints hide the real access boundary and the real domain rules
- Logic trapped in a page script cannot be reused by tasks, external functions, or CLI
- Mixed concerns make the page untestable with PHPUnit

Recommended remediation:

- Keep `required_param()`, context, capability, sesskey, and redirect/output flow in the entrypoint
- Move queries, writes, and business rules into `classes/`
- Reuse the same domain operation from pages, tasks, and external functions
- Render through a renderer and Mustache instead of echoing markup mid-logic

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Defer Expensive One-Off Work With Adhoc Tasks

**Impact:** MEDIUM (Keeps interactive requests responsive while preserving durable background processing)

## Defer Expensive One-Off Work With Adhoc Tasks

**Impact: MEDIUM (keeps interactive requests responsive while preserving durable background processing)**

When a user action or event triggers expensive one-off follow-up work, queue an adhoc task instead of blocking the request. Reserve scheduled tasks for recurrent jobs.

Wrong:

```php
// Runs synchronously on form submit for every selected course.
foreach ($courseids as $courseid) {
    local_example_rebuild_course_index($courseid);
}
```

Preferred:

```php
foreach ($courseids as $courseid) {
    $task = new \local_example\task\rebuild_course_index();
    $task->set_custom_data(['courseid' => $courseid]);
    \core\task\manager::queue_adhoc_task($task);
}
```

Why it matters:

- Request-time heavy work creates timeouts and poor UX
- Adhoc tasks fit deferred one-off work better than scheduled tasks
- Durable queueing survives the original request boundary

Recommended remediation:

- Queue an adhoc task for expensive follow-up work triggered by an action or event
- Keep the request focused on validation, authorization, and enqueueing
- Use scheduled tasks only when the work is recurrent

Reference: [Task API](https://moodledev.io/docs/apis/subsystems/task)

### Define Cache Scope And Invalidation Before Caching

**Impact:** MEDIUM (Prevents stale data and cache-driven bugs when derived results are stored)

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

### Use Events And Observers For Cross-Cutting Domain Reactions

**Impact:** MEDIUM (Keeps lifecycle reactions consistent across entrypoints instead of duplicating side effects)

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

### Move Recurrent Heavy Work to Scheduled Tasks

**Impact:** MEDIUM (Keeps request-time flows responsive and operationally predictable)

## Move Recurrent Heavy Work to Scheduled Tasks

**Impact: MEDIUM (keeps request-time flows responsive and operationally predictable)**

Recurring maintenance, synchronization, or recalculation work should run in scheduled tasks instead of piggybacking on page requests.

Wrong:

```php
// Runs every time the page loads.
local_example_sync_all_records();
```

Preferred:

```php
namespace local_example\task;

class sync_records extends \core\task\scheduled_task {
    public function get_name() {
        return get_string('tasksyncrecords', 'local_example');
    }

    public function execute() {
        local_example_sync_all_records();
    }
}
```

Why it matters:

- Heavy recurrent work can slow pages unpredictably
- Scheduled tasks create a clearer operational boundary
- Repeated work belongs to the task subsystem, not UI entrypoints

Recommended remediation:

- Move periodic processing to a scheduled task
- Keep page requests focused on user interaction

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Narrate Task Progress And Never Run Heavy Work As A Silent Spinner

**Impact:** HIGH (Prevents opaque timeouts and makes multi-step background work diagnosable in cron and manual-run UIs)

## Narrate Task Progress And Never Run Heavy Work As A Silent Spinner

**Impact: HIGH (prevents opaque timeouts and makes multi-step background work diagnosable in cron and manual-run UIs)**

Do not offer an Execute / Run button that starts multi-step or chained work—especially outbound web-service chains that assemble the next call from the previous response—and then leave the browser spinning with no progress. Put that work in a scheduled or adhoc task, narrate each meaningful step with `mtrace()`, and for manual runs use a Moodle-native progress/log view that streams output and ends with a return action, the same way core `tool_task` does when an admin forces a scheduled task.

Wrong:

```php
// Plugin page: button runs the whole chain in the same request.
if (optional_param('run', 0, PARAM_BOOL)) {
    require_sesskey();
    $terms = $client->get_terms();
    foreach ($terms as $term) {
        $sections = $client->get_sections($term->code); // Builds next URL from prior response.
        foreach ($sections as $section) {
            $client->sync_section($section);
        }
    }
    redirect($returnurl, get_string('done', 'local_example'));
}
```

Preferred:

```php
// classes/task/sync_banner.php — narrate every meaningful step for cron and manual run.
public function execute() {
    mtrace('Banner sync started');

    $terms = $this->client->get_terms();
    mtrace('Fetched ' . count($terms) . ' active terms');

    foreach ($terms as $term) {
        mtrace('Syncing term ' . $term->code);
        $sections = $this->client->get_sections($term->code);
        mtrace('  term ' . $term->code . ': ' . count($sections) . ' sections');

        foreach ($sections as $section) {
            $this->client->sync_section($section);
            mtrace('  synced section ' . $section->crn);
        }
    }

    mtrace('Banner sync finished');
}

// Manual-run page: open the page first, stream task output, then offer return.
echo $OUTPUT->header();
echo html_writer::start_tag('pre', ['class' => 'task-output']);
\core\task\manager::run_from_cli($task); // Task mtrace lines appear live, as in tool_task.
echo html_writer::end_tag('pre');
echo $OUTPUT->single_button($returnurl, get_string('back'));
echo $OUTPUT->footer();
```

Why it matters:

- Chained remote calls and multi-step syncs routinely exceed request timeouts when run behind a silent spinner
- Without step narration, cron and operators cannot tell whether failure was auth, term fetch, section paging, or a later write
- Moodle's own “Run now” UI for scheduled tasks streams `mtrace` output and then offers a way back; plugin manual runs should match that expectation
- A finished “Back/Return” control reorients the operator to the button page or task log instead of leaving them on a dead loading state

Recommended remediation:

- Move multi-step, chained, or remote-heavy work into scheduled or adhoc tasks instead of the button request
- Call `mtrace()` (or `mtrace_exception()` on caught failures) at each meaningful stage: start, each remote hop, counts, skips, and finish
- Persist enough status/watermark state so a failure mid-chain is recoverable and the log shows where it stopped
- For “run manually”, render the page first, stream progress through Moodle task/`mtrace` output (or an equivalent `progress_trace` view), then show a return action to the originating view or log
- Never leave the browser on an empty spinner while the full pipeline completes with no intermediate output
- Prefer queueing and letting cron run when the operator does not need an interactive stream; still keep `mtrace` so scheduled-task logs narrate progress

Reference: [Task API](https://moodledev.io/docs/apis/subsystems/task)

### Gate PHP Modernization By Moodle And PHP Support Matrix

**Impact:** CRITICAL (Prevents incompatible syntax recommendations and unsafe refactors across Moodle branches)

## Gate PHP Modernization By Moodle And PHP Support Matrix

**Impact: CRITICAL (prevents incompatible syntax recommendations and unsafe refactors across Moodle branches)**

Do not suggest or apply modern PHP syntax mechanically in Moodle plugins. Check the target Moodle branch and its supported PHP versions before introducing language features, stricter type contracts, or style-driven refactors.

Wrong:

```php
enum sync_status: string {
    case pending = 'pending';
    case done = 'done';
}

final class sync_result {
    public function __construct(
        public readonly sync_status $status,
    ) {}
}
```

Preferred:

```php
// First verify the target Moodle branch and supported PHP versions.
// Then choose the most modern syntax that is actually safe for that branch.
class sync_result {
    /** @var string */
    private $status;

    public function __construct(string $status) {
        $this->status = $status;
    }

    public function get_status(): string {
        return $this->status;
    }
}
```

Why it matters:

- Moodle plugin compatibility is constrained by the supported PHP versions of the target Moodle branch
- A "cleaner" PHP refactor can still be wrong if the syntax is unavailable in the deployment matrix
- Tightening types or adopting new syntax without checking callback signatures and subsystem expectations can break stable branches

Recommended remediation:

- Check the plugin's target Moodle branch before proposing PHP modernizations
- Only suggest features supported by that branch's PHP matrix
- Prefer the newest safe syntax, not the newest possible syntax
- Be especially careful with enums, `readonly`, attributes, promoted properties, union types, and newer exception or typing patterns

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Route Persistent Changes Through Moodle Upgrades

**Impact:** CRITICAL (Prevents broken deployments and inconsistent schema state)

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

### Keep Upgrade Steps Self-Contained And Stable

**Impact:** CRITICAL (Prevents upgrade failures caused by unavailable or evolving plugin classes)

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

### Verify Moodle APIs And Schema Before Using Them

**Impact:** CRITICAL (Prevents release failures caused by invented methods, fields, or version assumptions)

## Verify Moodle APIs And Schema Before Using Them

**Impact: CRITICAL (prevents release failures caused by invented methods, fields, or version assumptions)**

Do not infer Moodle method or column names from memory. Before using a version-sensitive core API or writing operational SQL, verify the contract in the target Moodle branch: inspect the core class, locate a real core caller, or inspect the installed schema.

Wrong:

```php
$task->set_dayofweek('*');

$records = $DB->get_records_sql(
    'SELECT s.iprestriction FROM {external_services} s'
);
```

Preferred:

```php
// Verified against core\task\scheduled_task in the target branch.
$task->set_day_of_week('*');

// Fetch only columns verified in the target branch schema.
$records = $DB->get_records('external_services', null, 'name ASC', 'id, name, enabled');
```

Why it matters:

- Plausible-looking API names can still be nonexistent
- Moodle schemas and APIs differ across supported branches
- Upgrade and operational scripts fail at the worst possible deployment boundary

Recommended remediation:

- Search the target Moodle core for the method definition and at least one real caller
- Inspect `install.xml`, XMLDB definitions, or the actual environment schema before writing operational SQL
- Prefer Moodle administration APIs and focused DML over speculative SQL
- Run a representative smoke check against the supported Moodle branch before bumping the plugin version

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Choose the Moodle DB API Based on Query Shape

**Impact:** HIGH (Improves correctness, readability, and scalability of data access)

## Choose the Moodle DB API Based on Query Shape

**Impact: HIGH (improves correctness, readability, and scalability of data access)**

Do not default blindly to either simple record helpers or SQL-based helpers. Choose the Moodle DB API that matches the access pattern.

Wrong:

```php
$records = $DB->get_records('user', null, 'lastname ASC');
```

Preferred:

```php
$records = $DB->get_records('user', ['deleted' => 0], 'lastname ASC', 'id, firstname, lastname');
```

Wrong:

```php
$records = $DB->get_records('local_example_items');
```

Preferred:

```php
$records = $DB->get_records_sql(
    "SELECT i.id, i.name, c.fullname
       FROM {local_example_items} i
       JOIN {course} c ON c.id = i.courseid
   ORDER BY c.fullname ASC, i.name ASC",
    []
);
```

Why it matters:

- Single-table simple reads are clearer with focused helper methods
- Joins, pagination, and aggregation usually require SQL-based APIs
- Good DB API choice improves both readability and performance

Recommended remediation:

- Use `get_record()` and `get_records()` for simple access
- Use `get_record_sql()` and `get_records_sql()` for complex query shapes
- Fetch only the fields the screen or action needs

Reference: [DML API](https://moodledev.io/docs/apis/core/dml)

### Translate Inclusive Calendar Dates Into Correct Timestamp Bounds

**Impact:** MEDIUM (Prevents date filters from silently excluding most of the final day)

## Translate Inclusive Calendar Dates Into Correct Timestamp Bounds

**Impact: MEDIUM (prevents date filters from silently excluding most of the final day)**

When a UI says that a calendar “To” date is inclusive, do not compare timestamps against midnight at the start of that day. Convert the user-visible range to a start-inclusive, end-exclusive interval using Moodle-aware date handling and the relevant timezone.

Wrong:

```php
$sql = 'course.startdate >= :fromdate AND course.startdate <= :todate';
// :todate is 2026-08-05 00:00:00, excluding the rest of August 5.
```

Preferred:

```php
$timezone = \core_date::get_user_timezone_object();
$endexclusive = (new \DateTimeImmutable('@' . $todate))
    ->setTimezone($timezone)
    ->setTime(0, 0)
    ->modify('+1 day')
    ->getTimestamp();
$sql = 'course.startdate >= :fromdate AND course.startdate < :endexclusive';
$params = ['fromdate' => usergetmidnight($fromdate), 'endexclusive' => $endexclusive];
```

Why it matters:

- Moodle date selectors commonly represent calendar days at midnight
- Inclusive `<= midnight` ranges exclude records later on the selected day
- User timezone and daylight-saving boundaries can affect timestamp conversion

Recommended remediation:

- Express calendar ranges as `[start, end-exclusive)`
- Use Moodle date/time helpers appropriate to the user's timezone
- State in contextual help that the “To” date includes the full day
- Test records at the start and end boundaries in a non-UTC timezone

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Do Not Run Queries Or Heavy Work Inside Loops

**Impact:** HIGH (Prevents per-row query storms and unbounded loop cost on real Moodle data)

## Do Not Run Queries Or Heavy Work Inside Loops

**Impact: HIGH (prevents per-row query storms and unbounded loop cost on real Moodle data)**

Do not query the database, build contexts, or call remote services once per row. Fetch what the loop needs in one set-based query, then iterate in memory. Nested loops over Moodle records are usually a sign that the query shape is wrong.

Wrong:

```php
foreach ($items as $item) {
    $course = $DB->get_record('course', ['id' => $item->courseid]);
    $item->coursename = $course->fullname;

    foreach ($DB->get_records('local_example_log', ['itemid' => $item->id]) as $log) {
        $item->attempts++;
    }
}
```

Preferred:

```php
[$insql, $params] = $DB->get_in_or_equal(array_column($items, 'courseid'), SQL_PARAMS_NAMED);

$coursenames = $DB->get_records_select_menu('course', "id $insql", $params, '', 'id, fullname');
$attempts = $DB->get_records_sql(
    "SELECT itemid, COUNT(1) AS attempts
       FROM {local_example_log}
      GROUP BY itemid",
    []
);

foreach ($items as $item) {
    $item->coursename = $coursenames[$item->courseid] ?? '';
    $item->attempts = $attempts[$item->id]->attempts ?? 0;
}
```

Why it matters:

- Per-row queries scale linearly with data and dominate page time
- Nested record loops turn a slow page into a timeout on production data
- Set-based queries express the real intent more clearly

Recommended remediation:

- Preload related records with one query using `get_in_or_equal()` or a join
- Aggregate counts in SQL instead of counting rows in PHP
- Batch remote calls or move the work into a scheduled/adhoc task
- Process large datasets with recordsets and bounded batches instead of loading everything

Reference: [DML API](https://moodledev.io/docs/apis/core/dml)

### Assume Report Tables Will Grow

**Impact:** HIGH (Prevents scalability and usability issues on report-style screens)

## Assume Report Tables Will Grow

**Impact: HIGH (prevents scalability and usability issues on report-style screens)**

If a screen displays tabular or report-style data, assume the dataset may exceed a small bounded size. Pagination, sorting, and filtering should be baseline functionality, not a later patch. Bulk actions must also define whether selection means the current page, explicitly selected rows across pages, or all matching results.

Wrong:

```php
$records = $DB->get_records('local_example_log');
foreach ($records as $record) {
    echo html_writer::div(s($record->message));
}
```

Preferred:

```php
$perpage = 25;
$page = optional_param('page', 0, PARAM_INT);
$offset = $page * $perpage;

$records = $DB->get_records_sql(
    "SELECT id, message, timecreated
       FROM {local_example_log}
   ORDER BY timecreated DESC",
    [],
    $offset,
    $perpage
);
```

Why it matters:

- Report plugins often grow beyond initial assumptions
- Full-record loading harms performance and usability
- Pagination and sorting should be designed into the query shape
- Bulk selection becomes dangerous when page boundaries or “all results” semantics are implicit

Recommended remediation:

- Validate paging, filter, and sort inputs
- Use the right DB API for the query shape
- Render through table-friendly Moodle patterns such as `table_sql` where appropriate
- Preserve explicit selected IDs across pages without loading every matching record into PHP
- Make “current page”, “selected rows”, and “all filtered results” distinct actions
- Revalidate filters, capabilities, and selected IDs server-side before a bulk mutation

Reference: [DML API](https://moodledev.io/docs/apis/core/dml)

### Keep Persistence Contracts Consistent Across The Full Workflow

**Impact:** HIGH (Prevents producers and consumers from reading different tables or fields)

## Keep Persistence Contracts Consistent Across The Full Workflow

**Impact: HIGH (prevents producers and consumers from reading different tables or fields)**

For queues and multi-step workflows, trace the full producer-to-consumer path. Enqueue code, tasks, reports, and cleanup must use the tables and fields declared in `db/install.xml`. Reuse one focused persistence boundary when several entrypoints perform the same operation.

Wrong:

```php
// Producer writes a legacy table name.
$DB->insert_record('local_bulk_delete_queue', $record);

// Task reads the installed table name, so it never sees the row.
$queued = $DB->get_records('local_delete_by_date_queue', ['status' => 1]);
```

Preferred:

```php
// Both the enqueue path and task reuse the same queue operation.
$queue->enqueue($record);
$queued = $queue->get_pending();
```

Why it matters:

- A UI can report success while the task sees an empty queue
- Table-name drift is not detected by isolated page or task tests
- Repeated persistence logic makes migrations and status changes easy to miss

Recommended remediation:

- Compare every referenced table and field with `db/install.xml`
- Trace and smoke-test UI/API → database row → task → final state
- Keep enqueue and process queries in one cohesive domain-specific boundary when reuse is real
- Avoid speculative repository layers; extract only the shared persistence operation

Reference: [DML API](https://moodledev.io/docs/apis/core/dml)

### Define One Status Contract For Writers Readers And Parent Aggregates

**Impact:** HIGH (Prevents workflows from completing with contradictory child and batch states)

## Define One Status Contract For Writers Readers And Parent Aggregates

**Impact: HIGH (prevents workflows from completing with contradictory child and batch states)**

When a workflow persists status values, define one documented set of domain constants and use it in writers, readers, tasks, and views. Parent or batch status should be recalculated from child records through one shared operation.

Wrong:

```php
// Task considers 2 deleted.
$DB->set_field('local_example_item', 'status', 2, ['id' => $itemid]);

// Batch aggregation considers only 3 deleted.
$remaining = $DB->count_records_select('local_example_item', 'batchid = ? AND status <> 3', [$batchid]);
```

Preferred:

```php
$DB->set_field(
    'local_example_item',
    'status',
    deletion_service::STATUS_DELETED,
    ['id' => $itemid]
);
$service->refresh_batch($batchid);
```

Why it matters:

- Different numeric meanings leave completed jobs permanently in progress
- Views can report a state that contradicts the task writer
- Parent state becomes stale when every caller implements aggregation differently

Recommended remediation:

- Document a single status lifecycle with named constants
- Recalculate parent status from children in one shared domain operation
- Keep legacy numeric migrations as literals inside self-contained upgrade steps
- Test enqueue → processing → child status → parent status, including error cases

Reference: [DML API](https://moodledev.io/docs/apis/core/dml)

### Do Not Depend On Seed Rows To Render Stable Status Labels

**Impact:** MEDIUM (Prevents valid workflow rows from disappearing when lookup data was not installed)

## Do Not Depend On Seed Rows To Render Stable Status Labels

**Impact: MEDIUM (prevents valid workflow rows from disappearing when lookup data was not installed)**

For a small stable status set, keep persisted values in documented constants and render labels through `get_string()`. Do not require an inner join to a lookup table merely to display labels; missing seed rows can hide valid data.

Wrong:

```php
$sql = "SELECT q.*, s.name
          FROM {local_example_queue} q
          JOIN {local_example_status} s ON s.id = q.status";
```

Preferred:

```php
$label = get_string('status' . $record->status, 'local_example');
```

Why it matters:

- Missing install seeds can turn a populated queue into an empty result
- User-facing labels belong in language packs
- Stable domain states are easier to review when values and labels are explicit

Recommended remediation:

- Use documented status constants for persisted values
- Map labels through language strings
- If lookup data is genuinely dynamic, seed it through `db/install.php` and migrate it through `db/upgrade.php`
- Use a left join only when missing optional metadata must not hide the domain row

Reference: [String API](https://moodledev.io/docs/apis/subsystems/string)

### Prefer classes/external for New External APIs

**Impact:** MEDIUM-HIGH (Improves structure, compatibility clarity, and maintainability)

## Prefer classes/external for New External APIs

**Impact: MEDIUM-HIGH (improves structure, compatibility clarity, and maintainability)**

When the supported Moodle version allows it, implement new web services in `classes/external/` instead of defaulting to legacy `externallib.php`.

Wrong:

```php
function local_example_get_items() {
    global $DB;
    return $DB->get_records('local_example_items');
}
```

Preferred:

```php
namespace local_example\external;

class get_items extends \external_api {
    public static function execute() {
        global $DB;
        return $DB->get_records('local_example_items');
    }
}
```

Why it matters:

- New external APIs should follow the modern namespaced structure when supported
- External transport code should be separated from broader plugin logic
- Class-based structure makes validation and return contracts easier to maintain

Recommended remediation:

- Place new external classes under `classes/external/`
- Keep parameter validation, access control, and return structure explicit
- Reuse domain logic instead of embedding it all in the external method

Reference: [External API](https://moodledev.io/docs/apis/subsystems/external)

### Validate External API Contracts And Minimize Service Exposure

**Impact:** HIGH (Prevents weak web service contracts, missing access validation, and overexposed endpoints)

## Validate External API Contracts And Minimize Service Exposure

**Impact: HIGH (prevents weak web service contracts, missing access validation, and overexposed endpoints)**

External APIs should define explicit input and output contracts, validate parameters and context early, and expose only the minimum necessary surface in `db/services.php`.

Wrong:

```php
namespace local_example\external;

class enrol_users extends \external_api {
    public static function execute($courseid, $userid) {
        global $DB;

        $DB->insert_record('local_example_enrolments', [
            'courseid' => $courseid,
            'userid' => $userid,
        ]);

        return ['ok' => true];
    }
}
```

Preferred:

```php
namespace local_example\external;

class enrol_users extends \external_api {
    public static function execute_parameters(): \external_function_parameters {
        return new \external_function_parameters([
            'courseid' => new \external_value(PARAM_INT, 'Course id'),
            'userid' => new \external_value(PARAM_INT, 'User id'),
        ]);
    }

    public static function execute(int $courseid, int $userid): array {
        $params = self::validate_parameters(self::execute_parameters(), [
            'courseid' => $courseid,
            'userid' => $userid,
        ]);

        $context = \context_course::instance($params['courseid']);
        self::validate_context($context);
        require_capability('local/example:enrol', $context);

        return ['ok' => true];
    }

    public static function execute_returns(): \external_single_structure {
        return new \external_single_structure([
            'ok' => new \external_value(PARAM_BOOL, 'Whether the enrolment completed'),
        ]);
    }
}
```

Why it matters:

- External functions are framework contracts, not loose helper methods
- Missing `validate_parameters()` or `validate_context()` weakens security and input guarantees
- Weak `execute_returns()` definitions make clients brittle and hard to maintain
- Broad or careless `db/services.php` exposure increases attack surface and coupling

Recommended remediation:

- Define `execute_parameters()`, `execute()`, and `execute_returns()` explicitly
- Call `validate_parameters()` before touching domain data
- Resolve and validate the correct context before capability checks
- Keep `db/services.php` entries minimal, accurate, and capability-bounded
- Expose only the endpoints and service bundles that are actually needed

Reference: [External API](https://moodledev.io/docs/apis/subsystems/external)

### Use Literal Ampersands When Building Outbound HTTP Query Strings

**Impact:** CRITICAL (Prevents silent empty API results when Moodle's HTML arg_separator turns query params into amp;page)

## Use Literal Ampersands When Building Outbound HTTP Query Strings

**Impact: CRITICAL (prevents silent empty API results when Moodle's HTML arg_separator turns query params into amp;page)**

Moodle core sets `arg_separator.output` to `&amp;` so HTML attributes stay valid. That global setting also affects `http_build_query()`. For outbound HTTP clients, curl, OAuth, and third-party APIs, pass an explicit literal `'&'` separator. Never rely on the PHP default inside a Moodle request.

Wrong:

```php
// Moodle has set arg_separator.output to '&amp;'.
$query = http_build_query([
    'termCode' => $term,
    'page' => 0,
    'size' => 100,
]);
// Becomes: termCode=202610&amp;page=0&amp;size=100
$url = $baseurl . '/sections?' . $query;
```

Preferred:

```php
$query = http_build_query(
    [
        'termCode' => $term,
        'page' => 0,
        'size' => 100,
    ],
    '',
    '&'
);
// Becomes: termCode=202610&page=0&size=100
$url = $baseurl . '/sections?' . $query;
```

Why it matters:

- The remote API may return HTTP 200 with an empty payload because it sees params named `amp;page` and `amp;size`
- The failure looks like “Banner/Moodle has no data” when connectivity and auth are fine
- `moodle_url` and HTML output correctly want `&amp;`; outbound wire protocols need raw `&`
- This behavior has existed across many Moodle versions; it is not a Moodle 4.x or 5.x novelty

Recommended remediation:

- Always pass `'&'` as the third argument to `http_build_query()` for outbound HTTP
- Prefer a shared HTTP client helper that owns URL building for every remote call
- Log or assert the exact request URL in integration smoke tests and confirm it contains `&`, not `&amp;`
- Do not “fix” this by decoding HTML entities after the fact; build the wire URL correctly
- Keep HTML page links on Moodle URL/output helpers; do not reuse HTML-encoded strings for curl

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Make Retried External Deliveries Idempotent

**Impact:** HIGH (Prevents duplicate records when windows overlap or requests are retried)

## Make Retried External Deliveries Idempotent

**Impact: HIGH (prevents duplicate records when windows overlap or requests are retried)**

External delivery workflows must assume retries, overlapping time windows, and interrupted acknowledgements. Persist a stable delivery identity or watermark and do not resend data that the remote system has already acknowledged.

Wrong:

```php
$records = get_attendance_between($from, $to);
foreach ($records as $record) {
    send_to_remote($record);
}
```

Preferred:

```php
$records = get_pending_attendance_between($from, $to);
foreach ($records as $record) {
    $response = send_to_remote($record, $record->deliverykey);
    if ($response->acknowledged) {
        mark_delivery_acknowledged($record->id, $response->reference);
    }
}
```

Why it matters:

- Cron retries and overlapping windows are normal operational behavior
- Duplicate attendance, grades, or enrolments can be harder to repair than a failed send
- Persisted attempts and acknowledgements provide an audit trail

Recommended remediation:

- Define the idempotency key or watermark before implementing delivery
- Persist attempt, response, acknowledgement, and error state
- Skip already acknowledged records on retries
- Test overlapping windows, timeout-after-send, and explicit retry scenarios

Reference: [Task API](https://moodledev.io/docs/apis/subsystems/task)

### Verify Service And Token Wiring Before External Release

**Impact:** MEDIUM-HIGH (Prevents deployed functions from remaining unavailable to the real consumer)

## Verify Service And Token Wiring Before External Release

**Impact: MEDIUM-HIGH (prevents deployed functions from remaining unavailable to the real consumer)**

Registration in `db/services.php` does not prove that an existing token can call the function. Before releasing an external API change, verify the service-function association, token user, capabilities, and applicable IP or time restrictions with a real transport request.

Wrong:

```php
// Assume this registration automatically updates every existing token.
$functions = [
    'local_example_create_items' => [
        'classname' => '\local_example\external\create_items',
        'methodname' => 'execute',
    ],
];
```

Preferred:

```php
// Register the function, then verify the deployed service/token separately.
// Run a minimal authenticated request using the same service and user as the consumer.
$functions = [
    'local_example_create_items' => [
        'classname' => '\local_example\external\create_items',
        'methodname' => 'execute',
    ],
];
```

Why it matters:

- Existing custom services and tokens are operational state, not only plugin code
- A function can exist in Moodle while remaining forbidden to the consumer
- User capability, service membership, IP, and validity restrictions all affect access

Recommended remediation:

- Document how to associate the function with the intended custom service
- Verify the token's user and restrictions through Moodle administration or verified schema
- Run a minimal REST/curl smoke request with the real service configuration
- Do not expose token values in logs, documentation, or test output

Reference: [Web services](https://moodledev.io/docs/apis/subsystems/external)

### Protect Multi-Step External Writes With Transaction And Recovery Design

**Impact:** HIGH (Prevents inconsistent Moodle state when write-oriented external APIs fail mid-operation)

## Protect Multi-Step External Writes With Transaction And Recovery Design

**Impact: HIGH (prevents inconsistent Moodle state when write-oriented external APIs fail mid-operation)**

When an external API performs multiple related writes, do not assume the happy path. Design the endpoint so partial failure does not leave Moodle data in an inconsistent state.

Wrong:

```php
namespace local_example\external;

class import_enrolments extends \external_api {
    public static function execute(int $courseid, array $userids): array {
        global $DB;

        foreach ($userids as $userid) {
            $DB->insert_record('local_example_queue', [
                'courseid' => $courseid,
                'userid' => $userid,
            ]);

            enrol_try_internal_enrol($courseid, $userid);
        }

        return ['ok' => true];
    }
}
```

Preferred:

```php
namespace local_example\external;

class import_enrolments extends \external_api {
    public static function execute(int $courseid, array $userids): array {
        global $DB;

        $transaction = $DB->start_delegated_transaction();

        foreach ($userids as $userid) {
            $DB->insert_record('local_example_queue', [
                'courseid' => $courseid,
                'userid' => $userid,
            ]);

            enrol_try_internal_enrol($courseid, $userid);
        }

        $transaction->allow_commit();

        return ['ok' => true];
    }
}
```

Why it matters:

- External write endpoints often create or update several related Moodle records in sequence
- A failure in the middle of the operation can leave partial queue entries, half-created entities, or mismatched state
- Recovery behavior is part of the contract, especially for enrolment, activity creation, grading, or bulk-import endpoints

Recommended remediation:

- Review whether the endpoint needs a delegated transaction or another explicit recovery strategy
- Define what should happen on partial failure: rollback, skip-and-report, or resumable recovery
- Add tests for interrupted processing and partial-write scenarios
- Keep the write path focused so transaction boundaries are easy to reason about

Reference: [External API](https://moodledev.io/docs/apis/subsystems/external)

### Review Backup And Restore When Domain Data Must Travel With The Course

**Impact:** MEDIUM-HIGH (Prevents silent data loss when courses are backed up, restored, or duplicated)

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

### Use Moodle File API for Managed Files

**Impact:** MEDIUM (Prevents brittle file handling and permission mistakes)

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

### Review Privacy API Obligations for User Data

**Impact:** MEDIUM (Prevents hidden personal-data liabilities in plugin features)

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

### Use Clear Labels and Accessible Actions

**Impact:** MEDIUM (Improves accessibility and UI clarity for Moodle users)

## Use Clear Labels and Accessible Actions

**Impact: MEDIUM (improves accessibility and UI clarity for Moodle users)**

Form controls, action links, and icon-driven UI should expose clear accessible meaning.

Wrong:

```php
echo '<a href="' . $url . '"><i class="icon fa fa-edit"></i></a>';
```

Preferred:

```php
echo $OUTPUT->action_icon(
    $url,
    new pix_icon('t/edit', get_string('edit'))
);
```

Why it matters:

- Icon-only actions can be ambiguous or inaccessible
- Clear action text and labels improve usability for all users
- Moodle output helpers often provide better semantics than raw markup

Recommended remediation:

- Prefer output helpers with accessible labels
- Make sure action meaning is explicit in strings or accessible text

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Move User-Facing Text to Language Strings

**Impact:** MEDIUM (Improves translation support and consistency)

## Move User-Facing Text to Language Strings

**Impact: MEDIUM (improves translation support and consistency)**

Do not hardcode user-facing text in PHP, templates, or UI setup when it belongs in the language pack.

Wrong:

```php
$PAGE->set_title('Manage items');
echo html_writer::tag('button', 'Save');
```

Preferred:

```php
$PAGE->set_title(get_string('manageitems', 'local_example'));
echo html_writer::tag('button', get_string('savechanges'));
```

Why it matters:

- Hardcoded text weakens translation support
- Language strings improve consistency across Moodle UI
- String identifiers make future maintenance easier

Recommended remediation:

- Move labels, headings, buttons, and notifications to the language pack
- Use `get_string()` consistently for user-facing text

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Prove Behavioral Parity When Replacing A Working Legacy Flow

**Impact:** HIGH (Prevents rewrites from silently dropping expected Moodle behavior)

## Prove Behavioral Parity When Replacing A Working Legacy Flow

**Impact: HIGH (prevents rewrites from silently dropping expected Moodle behavior)**

When a rewrite replaces a known working plugin or workflow, inspect the reference implementation before declaring the new path complete. Preserve required outcomes, not necessarily its internal structure.

Wrong:

```php
// New seed flow creates a course but skips the reference backup/restore settings.
$childid = create_course($data);
```

Preferred:

```php
// Scenario test derived from the reference behavior.
$childid = $seedservice->replicate($templateid, $target);
$child = get_course($childid);

$this->assertSame($template->format, $child->format);
$this->assert_child_enrolments_preserved($childid);
```

Why it matters:

- A cleaner rewrite can still regress required behavior
- Backup/restore settings, course format, files, enrolments, and cleanup rules are easy to overlook
- UI enhancements do not compensate for a broken core workflow

Recommended remediation:

- Trace the critical reference path and record observable outcomes
- Compare backup settings, restore behavior, retained data, and removed data
- Add scenario tests for the required parity contract
- Stabilize the core behavior before adding secondary UI features

Reference: [Testing](https://moodledev.io/general/development/process/testing)

### Test Features Against Expected Success And Failure Scenarios

**Impact:** HIGH (Prevents under-tested workflows by covering realistic functional and error scenarios)

## Test Features Against Expected Success And Failure Scenarios

**Impact: HIGH (prevents under-tested workflows by covering realistic functional and error scenarios)**

When adding a feature, do not stop at the happy path. Create a test set that covers correct behavior, expected validation failures, interrupted flows, and realistic edge cases for that workflow.

Wrong:

```php
// New CSV enrolment feature added.
// Only manual testing of the successful import path was performed.
```

Preferred:

```php
// Add coverage for the normal path and for realistic failure scenarios:
// - valid CSV with expected enrolments
// - missing required column
// - empty row or malformed value
// - interrupted or partial upload
// - user without required capability
// - duplicate or already-enrolled records
// - clear user-facing error reporting where applicable
```

Why it matters:

- Moodle features often fail at boundaries such as permissions, malformed input, partial form submissions, or interrupted file handling
- Happy-path-only testing leaves the highest-risk behaviors unverified
- Good scenario coverage improves both correctness and the quality of recovery and error messaging

Recommended remediation:

- For each feature, identify the success path, validation failures, permission failures, and operational edge cases
- Add PHPUnit coverage for backend logic and Behat coverage when the workflow is form-, file-, or UI-driven
- Test realistic error cases such as missing fields, invalid formats, duplicates, interrupted uploads, and partial processing
- Verify not only the failure but also the expected remediation behavior, such as rollback, skip rules, error aggregation, or actionable feedback

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Add Automated Coverage for Non-Trivial Behavior

**Impact:** MEDIUM (Reduces regressions in capability-sensitive and data-heavy features)

## Add Automated Coverage for Non-Trivial Behavior

**Impact: MEDIUM (reduces regressions in capability-sensitive and data-heavy features)**

Non-trivial plugin behavior should be backed by PHPUnit or Behat coverage depending on the risk surface.

Wrong:

```php
// Complex feature added with no automated tests.
```

Preferred:

```php
// Add PHPUnit coverage for domain logic and Behat coverage when the
// workflow spans UI, permissions, or rendered behavior.
```

Why it matters:

- Capability-sensitive and report-like features are easy to regress
- Automated coverage increases confidence in refactors and upgrades
- The right test type depends on the behavior under change

Recommended remediation:

- Use PHPUnit for domain logic and data behavior
- Use Behat for UI and workflow-sensitive behavior
- Add tests as part of the change, not as optional follow-up

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Resolve Context and Enforce Capabilities Early

**Impact:** CRITICAL (Prevents unauthorized access and insecure server-side actions)

## Resolve Context and Enforce Capabilities Early

**Impact: CRITICAL (prevents unauthorized access and insecure server-side actions)**

Resolve the correct Moodle context before processing a page, action, export, AJAX request, or external function. UI visibility is never a substitute for server-side authorization.

Wrong:

```php
$id = required_param('id', PARAM_INT);
$record = $DB->get_record('local_example_items', ['id' => $id], '*', MUST_EXIST);

if (optional_param('delete', 0, PARAM_BOOL)) {
    $DB->delete_records('local_example_items', ['id' => $id]);
}
```

Preferred:

```php
$id = required_param('id', PARAM_INT);
$record = $DB->get_record('local_example_items', ['id' => $id], '*', MUST_EXIST);
$context = context_system::instance();

require_login();
require_capability('local/example:manage', $context);

if (optional_param('delete', 0, PARAM_BOOL)) {
    require_sesskey();
    $DB->delete_records('local_example_items', ['id' => $id]);
}
```

Why it matters:

- Capabilities are mandatory framework boundaries in Moodle
- State-changing actions must be protected server-side
- The correct context determines who is actually allowed to act

Recommended remediation:

- Resolve the target context first
- Require login where appropriate
- Enforce the capability before processing the action
- Add sesskey validation for state-changing requests

Reference: [Access API](https://moodledev.io/docs/apis/subsystems/access)

### Set Up Admin Pages And Visible Breadcrumbs Correctly

**Impact:** HIGH (Keeps Site administration navigation working and always orients users with a real breadcrumb path)

## Set Up Admin Pages And Visible Breadcrumbs Correctly

**Impact: HIGH (keeps Site administration navigation working and always orients users with a real breadcrumb path)**

Decide whether a page is Site-administration-only or also reachable by other roles. Admin-only screens must register an `admin_externalpage` and call `admin_externalpage_setup()`. Every page—admin or shared—must show breadcrumbs that reflect the real navigation path. Non-admin roles will not see Site administration tabs; breadcrumbs are their orientation.

Wrong:

```php
// Admin tool page with no externalpage registration/setup and no navbar path.
require(__DIR__ . '/../../config.php');
require_login();
$context = context_system::instance();
require_capability('local/example:manage', $context);

$PAGE->set_context($context);
$PAGE->set_url(new moodle_url('/local/example/manage.php'));
$PAGE->set_title(get_string('manage', 'local_example'));

echo $OUTPUT->header();
// Content...
echo $OUTPUT->footer();
```

Preferred:

```php
// settings.php — Site administration registration
$ADMIN->add(
    'localplugins',
    new admin_externalpage(
        'local_example_manage',
        get_string('manage', 'local_example'),
        new moodle_url('/local/example/manage.php'),
        'local/example:manage'
    )
);

// manage.php — admin-only page
require(__DIR__ . '/../../config.php');
require_once($CFG->libdir . '/adminlib.php');
admin_externalpage_setup('local_example_manage');

echo $OUTPUT->header();
// Content...
echo $OUTPUT->footer();

// report.php — shared page other roles can open
$courseid = required_param('courseid', PARAM_INT);
$course = get_course($courseid);
$context = context_course::instance($course->id);

require_login($course);
require_capability('local/example:view', $context);

$url = new moodle_url('/local/example/report.php', ['courseid' => $course->id]);
$PAGE->set_url($url);
$PAGE->set_context($context);
$PAGE->set_pagelayout('report');
$PAGE->set_title(get_string('report', 'local_example'));
$PAGE->set_heading(format_string($course->fullname));

// Non-admins will not see Site administration tabs. Breadcrumbs must still show the real path.
$PAGE->navbar->add(get_string('report', 'local_example'), $url);

echo $OUTPUT->header();
// Content...
echo $OUTPUT->footer();
```

Why it matters:

- `admin_externalpage_setup()` wires the page into the admin tree so Site administration navigation, active section, and admin breadcrumbs work
- Registration URL and `$PAGE->set_url()` must match the canonical page URL or the admin breadcrumb never activates
- Managers, teachers, and other roles do not see Site administration tabs; without visible breadcrumbs they lose the path back to the parent context
- Breadcrumbs are part of Moodle orientation, not an optional decoration

Recommended remediation:

- For admin-only screens: add `admin_externalpage` in `settings.php`, call `admin_externalpage_setup($pagename)` early, then use normal `$OUTPUT->header()` / `footer()`
- Prefer standard `admin_settingpage` settings when the screen is only config fields in `config_plugins`; use `admin_externalpage` for custom operational screens
- For shared or course-scoped screens: do not pretend they are Site administration pages; set context/layout/URL and build `$PAGE->navbar` (or navigation nodes) with the real parent path
- Keep breadcrumbs visible and accurate for every role that can open the page
- Never rely on admin secondary navigation to orient users who cannot see it

Reference: [Admin settings](https://moodledev.io/docs/apis/subsystems/admin), [Navigation API](https://moodledev.io/docs/apis/core/navigation)

### Explain Operational Views Filters And Icon Actions In Context

**Impact:** MEDIUM (Prevents users from guessing what a view, field, or compact action actually does)

## Explain Operational Views Filters And Icon Actions In Context

**Impact: MEDIUM (prevents users from guessing what a view, field, or compact action actually does)**

Operational views should include only the context needed to act correctly: a short lead explaining the view, field-level help for ambiguous filters, and accessible labels or a compact legend for icon actions. Avoid both unexplained controls and large informational walls.

Wrong:

```php
$mform->addElement('date_selector', 'fromdate', get_string('from'));
$mform->addElement('date_selector', 'todate', get_string('to'));
echo '<a href="' . $runurl . '"><i class="fa fa-play"></i></a>';
```

Preferred:

```php
$mform->addElement('date_selector', 'fromdate', get_string('coursestartfrom', 'local_example'));
$mform->addHelpButton('fromdate', 'coursestartfrom', 'local_example');

$mform->addElement('date_selector', 'todate', get_string('coursestartto', 'local_example'));
$mform->addHelpButton('todate', 'coursestartto', 'local_example');

echo $OUTPUT->action_icon(
    $runurl,
    new pix_icon('t/play', get_string('runrowtask', 'local_example', $record->name))
);
```

Why it matters:

- “From” and “To” do not reveal whether a filter uses creation time, `course.startdate`, or another field
- Icon-only controls can be ambiguous even when visually familiar
- Long inline explanations hide the actionable content they are meant to clarify

Recommended remediation:

- Add a translated lead of at most one or two short sentences on operational views
- Use Form API labels and `addHelpButton()` for field-specific meaning, boundaries, and exclusions
- Use Moodle output helpers with meaningful accessible labels for icons
- Add a compact legend only when several repeated symbols or states need decoding
- Put secondary detail in a collapsible `<details>` section or help popup, not in the primary flow
- State important exclusions explicitly, such as `SITEID`, `startdate = 0`, or inclusive date bounds

Reference: [Form API](https://moodledev.io/docs/apis/subsystems/form)

### Use Form API for Real Input Workflows

**Impact:** HIGH (Improves validation, maintainability, and Moodle-native behavior)

## Use Form API for Real Input Workflows

**Impact: HIGH (improves validation, maintainability, and Moodle-native behavior)**

When a feature collects user input, use `moodleform` instead of building `<form>` markup manually in PHP.

Wrong:

```php
echo '<form method="post">';
echo '<input type="text" name="name" />';
echo '<button type="submit">Save</button>';
echo '</form>';
```

Preferred:

```php
class item_form extends moodleform {
    public function definition() {
        $mform = $this->_form;
        $mform->addElement('text', 'name', get_string('name', 'local_example'));
        $mform->setType('name', PARAM_TEXT);
        $this->add_action_buttons();
    }
}
```

Why it matters:

- Form API centralizes validation, defaults, and submission handling
- It aligns forms with Moodle expectations and reduces ad hoc processing
- It avoids fragile echoed HTML and duplicated token logic

Recommended remediation:

- Move the form to a `moodleform` subclass
- Define elements in `definition()`
- Handle submitted data through the form object

Reference: [Form API](https://moodledev.io/docs/apis/subsystems/form)

### Use Moodle URLs and Output Helpers

**Impact:** MEDIUM (Improves output safety and keeps navigation code Moodle-native)

## Use Moodle URLs and Output Helpers

**Impact: MEDIUM (improves output safety and keeps navigation code Moodle-native)**

Do not build internal URLs or action markup by hand when Moodle provides URL and output helpers.

Wrong:

```php
$url = '/local/example/view.php?id=' . $id;
echo '<a href="' . $url . '">Open</a>';
```

Preferred:

```php
$url = new moodle_url('/local/example/view.php', ['id' => $id]);
echo html_writer::link($url, get_string('open', 'local_example'));
```

Why it matters:

- Moodle helpers reduce brittle string concatenation
- URL generation becomes safer and more maintainable
- Output helpers align actions with Moodle conventions

Recommended remediation:

- Build internal routes with `moodle_url`
- Use output helpers and renderer methods for actions and UI fragments

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Build Moodle 5.x UI On Boost And Bootstrap 5.3

**Impact:** HIGH (Keeps theme and frontend work compatible with Moodle 5.x rendering and styling expectations)

## Build Moodle 5.x UI On Boost And Bootstrap 5.3

**Impact: HIGH (keeps theme and frontend work compatible with Moodle 5.x rendering and styling expectations)**

For Moodle 5.x theme and UI work, treat Boost and Bootstrap 5.3 as the default baseline. Prefer SCSS, Mustache overrides, renderers, and theme settings over Bootstrap 4 markup, ad hoc CSS patches, or echoed HTML structure changes.

Wrong:

```html
<button class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
    Open
</button>
<div class="text-left ml-3 hidden">Legacy layout helpers</div>
```

Preferred:

```html
<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
    {{#str}} open, local_example {{/str}}
</button>
<div class="text-start ms-3 visually-hidden">{{#str}} helpertext, local_example {{/str}}</div>
```

Why it matters:

- Moodle 5.x UI is Boost- and Bootstrap 5.3-centered
- Bootstrap 4 attributes and utilities create broken or inconsistent interfaces
- Theme structure, SCSS phases, and template overrides are the maintainable extension points
- Theme settings that change SCSS must reset theme caches or visual updates will not appear

Recommended remediation:

- Use `data-bs-*` attributes and Bootstrap 5 spacing/alignment utilities
- Put structural UI changes in Mustache templates or renderers, not PHP string concatenation
- Organize theme SCSS through pre/main/extra phases and Moodle theme file layout
- Reset theme caches when settings affect generated CSS
- Confirm the target branch is Moodle 5.x before assuming Bootstrap 5 defaults

Reference: [Themes](https://moodledev.io/docs/guides/themes)

### Render Non-Trivial Views Through Mustache and Renderers

**Impact:** HIGH (Improves separation of concerns and Moodle-native UI structure)

## Render Non-Trivial Views Through Mustache and Renderers

**Impact: HIGH (improves separation of concerns and Moodle-native UI structure)**

Do not concatenate substantial view markup directly in PHP. Prepare data in PHP and render non-trivial UI through Mustache and renderer or output classes.

Wrong:

```php
echo '<div class="card">';
echo '<h3>' . format_string($item->name) . '</h3>';
echo '<p>' . s($item->description) . '</p>';
echo '</div>';
```

Preferred:

```php
$data = [
    'name' => format_string($item->name),
    'description' => format_text($item->description, FORMAT_HTML),
];

echo $OUTPUT->render_from_template('local_example/item_card', $data);
```

Why it matters:

- Rendering logic should not be mixed with data access and control flow
- Mustache templates make non-trivial UI more maintainable and reusable
- Renderer flow fits Moodle's output conventions

Recommended remediation:

- Prepare template data in PHP
- Move markup to a Mustache template
- Use renderers or output classes for reusable view flows

Reference: [Templates Guide](https://moodledev.io/docs/guides/templates)

## References

- https://moodledev.io
- https://moodledev.io/docs/apis/core/dml
- https://moodledev.io/docs/apis/subsystems/form
- https://moodledev.io/docs/apis/subsystems/admin
- https://moodledev.io/docs/apis/core/navigation
- https://moodledev.io/docs/guides/templates
- https://moodledev.io/docs/guides/javascript/modules
- https://moodledev.io/docs/apis/subsystems/access
- https://moodledev.io/docs/apis/subsystems/external
- https://moodledev.io/docs/apis/subsystems/privacy
- https://moodledev.io/docs/apis/subsystems/backup
- https://moodledev.io/docs/apis/subsystems/cache
- https://moodledev.io/docs/apis/subsystems/task
- https://moodledev.io/docs/apis/core/events
- https://moodledev.io/docs/guides/themes
- https://moodledev.io/general/development/policies/php
- https://moodledev.io/general/development/policies/codingstyle
- https://moodledev.io/docs/apis/commonfiles

