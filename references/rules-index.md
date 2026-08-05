# Rules Index

Generated catalog of 43 formal rules for version 3.0.0.

Use this index to choose the relevant rule file, then read only that file under `rules/`.
Do not load `AGENTS.md` by default.

## `amd-`

- [`amd-module-loading.md`](../rules/amd-module-loading.md) — **Implement Browser Logic as AMD Modules** (HIGH — Aligns JavaScript with Moodle-native loading and modularity)

## `arch-`

- [`arch-decompose-large-files.md`](../rules/arch-decompose-large-files.md) — **Decompose Files Before They Sprawl** (MEDIUM — Keeps plugin files scannable instead of accumulating unrelated responsibilities)
- [`arch-guard-clauses-over-nesting.md`](../rules/arch-guard-clauses-over-nesting.md) — **Prefer Guard Clauses Over Deep Conditional Nesting** (MEDIUM-HIGH — Keeps Moodle logic readable by removing avoidable else branches and nesting)
- [`arch-helper-boundaries.md`](../rules/arch-helper-boundaries.md) — **Keep Helpers Cohesive and Domain-Specific** (MEDIUM — Prevents generic helper dumping grounds and mixed responsibilities)
- [`arch-no-scattered-special-cases.md`](../rules/arch-no-scattered-special-cases.md) — **Do Not Scatter Special Cases Across Shared Moodle Flows** (HIGH — Prevents spaghetti growth from ad hoc branches bolted into unrelated code paths)
- [`arch-php-guidance-subordinate-to-moodle.md`](../rules/arch-php-guidance-subordinate-to-moodle.md) — **Keep Generic PHP Best Practices Subordinate To Moodle Conventions** (HIGH — Prevents PSR and SOLID advice from fighting Moodle-native APIs and structure)
- [`arch-single-canonical-implementation.md`](../rules/arch-single-canonical-implementation.md) — **Keep One Canonical Implementation Per Domain Operation** (HIGH — Prevents duplicated logic from drifting between pages, tasks, and external functions)
- [`arch-thin-entrypoints.md`](../rules/arch-thin-entrypoints.md) — **Keep Page Entrypoints Thin And Delegate Domain Work** (HIGH — Prevents fat page scripts that mix routing, access, queries, mutation, and markup)

## `async-`

- [`async-adhoc-deferred-work.md`](../rules/async-adhoc-deferred-work.md) — **Defer Expensive One-Off Work With Adhoc Tasks** (MEDIUM — Keeps interactive requests responsive while preserving durable background processing)
- [`async-cache-invalidation.md`](../rules/async-cache-invalidation.md) — **Define Cache Scope And Invalidation Before Caching** (MEDIUM — Prevents stale data and cache-driven bugs when derived results are stored)
- [`async-events-observers.md`](../rules/async-events-observers.md) — **Use Events And Observers For Cross-Cutting Domain Reactions** (MEDIUM — Keeps lifecycle reactions consistent across entrypoints instead of duplicating side effects)
- [`async-scheduled-task.md`](../rules/async-scheduled-task.md) — **Move Recurrent Heavy Work to Scheduled Tasks** (MEDIUM — Keeps request-time flows responsive and operationally predictable)

## `compat-`

- [`compat-php-version-gating.md`](../rules/compat-php-version-gating.md) — **Gate PHP Modernization By Moodle And PHP Support Matrix** (CRITICAL — Prevents incompatible syntax recommendations and unsafe refactors across Moodle branches)
- [`compat-upgrade-path.md`](../rules/compat-upgrade-path.md) — **Route Persistent Changes Through Moodle Upgrades** (CRITICAL — Prevents broken deployments and inconsistent schema state)
- [`compat-upgrade-self-contained.md`](../rules/compat-upgrade-self-contained.md) — **Keep Upgrade Steps Self-Contained And Stable** (CRITICAL — Prevents upgrade failures caused by unavailable or evolving plugin classes)
- [`compat-verify-core-contracts.md`](../rules/compat-verify-core-contracts.md) — **Verify Moodle APIs And Schema Before Using Them** (CRITICAL — Prevents release failures caused by invented methods, fields, or version assumptions)

## `data-`

- [`data-db-api-choice.md`](../rules/data-db-api-choice.md) — **Choose the Moodle DB API Based on Query Shape** (HIGH — Improves correctness, readability, and scalability of data access)
- [`data-inclusive-date-filters.md`](../rules/data-inclusive-date-filters.md) — **Translate Inclusive Calendar Dates Into Correct Timestamp Bounds** (MEDIUM — Prevents date filters from silently excluding most of the final day)
- [`data-no-queries-in-loops.md`](../rules/data-no-queries-in-loops.md) — **Do Not Run Queries Or Heavy Work Inside Loops** (HIGH — Prevents per-row query storms and unbounded loop cost on real Moodle data)
- [`data-paginated-tables.md`](../rules/data-paginated-tables.md) — **Assume Report Tables Will Grow** (HIGH — Prevents scalability and usability issues on report-style screens)
- [`data-persistence-flow-consistency.md`](../rules/data-persistence-flow-consistency.md) — **Keep Persistence Contracts Consistent Across The Full Workflow** (HIGH — Prevents producers and consumers from reading different tables or fields)
- [`data-status-contract.md`](../rules/data-status-contract.md) — **Define One Status Contract For Writers Readers And Parent Aggregates** (HIGH — Prevents workflows from completing with contradictory child and batch states)
- [`data-status-labels-without-seed-dependency.md`](../rules/data-status-labels-without-seed-dependency.md) — **Do Not Depend On Seed Rows To Render Stable Status Labels** (MEDIUM — Prevents valid workflow rows from disappearing when lookup data was not installed)

## `external-`

- [`external-class-based-api.md`](../rules/external-class-based-api.md) — **Prefer classes/external for New External APIs** (MEDIUM-HIGH — Improves structure, compatibility clarity, and maintainability)
- [`external-contract-and-exposure.md`](../rules/external-contract-and-exposure.md) — **Validate External API Contracts And Minimize Service Exposure** (HIGH — Prevents weak web service contracts, missing access validation, and overexposed endpoints)
- [`external-http-query-separator.md`](../rules/external-http-query-separator.md) — **Use Literal Ampersands When Building Outbound HTTP Query Strings** (CRITICAL — Prevents silent empty API results when Moodle's HTML arg_separator turns query params into amp;page)
- [`external-idempotent-delivery.md`](../rules/external-idempotent-delivery.md) — **Make Retried External Deliveries Idempotent** (HIGH — Prevents duplicate records when windows overlap or requests are retried)
- [`external-service-token-verification.md`](../rules/external-service-token-verification.md) — **Verify Service And Token Wiring Before External Release** (MEDIUM-HIGH — Prevents deployed functions from remaining unavailable to the real consumer)
- [`external-write-transaction-safety.md`](../rules/external-write-transaction-safety.md) — **Protect Multi-Step External Writes With Transaction And Recovery Design** (HIGH — Prevents inconsistent Moodle state when write-oriented external APIs fail mid-operation)

## `lifecycle-`

- [`lifecycle-backup-restore.md`](../rules/lifecycle-backup-restore.md) — **Review Backup And Restore When Domain Data Must Travel With The Course** (MEDIUM-HIGH — Prevents silent data loss when courses are backed up, restored, or duplicated)
- [`lifecycle-file-api.md`](../rules/lifecycle-file-api.md) — **Use Moodle File API for Managed Files** (MEDIUM — Prevents brittle file handling and permission mistakes)
- [`lifecycle-privacy-review.md`](../rules/lifecycle-privacy-review.md) — **Review Privacy API Obligations for User Data** (MEDIUM — Prevents hidden personal-data liabilities in plugin features)

## `quality-`

- [`quality-accessible-labels.md`](../rules/quality-accessible-labels.md) — **Use Clear Labels and Accessible Actions** (MEDIUM — Improves accessibility and UI clarity for Moodle users)
- [`quality-get-string.md`](../rules/quality-get-string.md) — **Move User-Facing Text to Language Strings** (MEDIUM — Improves translation support and consistency)
- [`quality-reference-parity.md`](../rules/quality-reference-parity.md) — **Prove Behavioral Parity When Replacing A Working Legacy Flow** (HIGH — Prevents rewrites from silently dropping expected Moodle behavior)
- [`quality-scenario-based-testing.md`](../rules/quality-scenario-based-testing.md) — **Test Features Against Expected Success And Failure Scenarios** (HIGH — Prevents under-tested workflows by covering realistic functional and error scenarios)
- [`quality-testing-coverage.md`](../rules/quality-testing-coverage.md) — **Add Automated Coverage for Non-Trivial Behavior** (MEDIUM — Reduces regressions in capability-sensitive and data-heavy features)

## `security-`

- [`security-capability-checks.md`](../rules/security-capability-checks.md) — **Resolve Context and Enforce Capabilities Early** (CRITICAL — Prevents unauthorized access and insecure server-side actions)

## `ui-`

- [`ui-contextual-guidance.md`](../rules/ui-contextual-guidance.md) — **Explain Operational Views Filters And Icon Actions In Context** (MEDIUM — Prevents users from guessing what a view, field, or compact action actually does)
- [`ui-form-api.md`](../rules/ui-form-api.md) — **Use Form API for Real Input Workflows** (HIGH — Improves validation, maintainability, and Moodle-native behavior)
- [`ui-moodle-url-output.md`](../rules/ui-moodle-url-output.md) — **Use Moodle URLs and Output Helpers** (MEDIUM — Improves output safety and keeps navigation code Moodle-native)
- [`ui-moodle5-theme.md`](../rules/ui-moodle5-theme.md) — **Build Moodle 5.x UI On Boost And Bootstrap 5.3** (HIGH — Keeps theme and frontend work compatible with Moodle 5.x rendering and styling expectations)
- [`ui-mustache-renderers.md`](../rules/ui-mustache-renderers.md) — **Render Non-Trivial Views Through Mustache and Renderers** (HIGH — Improves separation of concerns and Moodle-native UI structure)

