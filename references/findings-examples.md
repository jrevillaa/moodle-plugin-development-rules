# Findings Examples

Use these examples to keep audit output consistent and high-signal.

## Critical

Rule violated:

- Capability enforcement is missing on a state-changing action.

Why it matters:

- UI visibility is not authorization. In Moodle, actions must be protected server-side in the correct context.

Recommended remediation:

- Resolve the correct context, require login where appropriate, and enforce the capability before processing the request.

## Critical

Rule violated:

- Schema change is applied at runtime instead of through `db/upgrade.php`.

Why it matters:

- Moodle deployments need deterministic, versioned upgrade paths. Runtime DDL creates inconsistent environments.

Recommended remediation:

- Move the structural change into an upgrade step, bump the plugin version, and keep `install.xml` aligned.

## Critical

Rule violated:

- A historical upgrade step calls a newly introduced class from the same plugin.

Why it matters:

- Plugin class discovery may be stale during upgrade, and later class changes can break old migrations.

Recommended remediation:

- Keep the step self-contained with XMLDB, parameterized DML/SQL, literal legacy values, and config APIs.

## Critical

Rule violated:

- A scheduled-task method was used without verifying that it exists in the target Moodle branch.

Why it matters:

- An invented method name turns version deployment into a fatal upgrade failure.

Recommended remediation:

- Inspect the target core class and a real core caller, then smoke-test the upgrade before bumping the plugin version.

## Critical

Rule violated:

- Outbound API URLs were built with `http_build_query()` and Moodle's HTML `&amp;` separator.

Why it matters:

- The remote service can return HTTP 200 with empty results because it receives params named `amp;page` instead of `page`.

Recommended remediation:

- Build wire URLs with `http_build_query($params, '', '&')` and verify the exact request URL before blaming the remote system.

## Major

Rule violated:

- A report screen renders a growing dataset without pagination or sorting.

Why it matters:

- Report plugins should assume real data volume. Without scalable table handling, performance and usability degrade quickly.

Recommended remediation:

- Move the listing to a Moodle-native table flow with validated filters, pagination, and sorting backed by the appropriate DB API.

## Major

Rule violated:

- Moodle 5.x UI still uses Bootstrap 4 attributes and utilities.

Why it matters:

- Moodle 5.x expects Boost and Bootstrap 5.3 patterns. Legacy markup creates broken interactions and inconsistent UI.

Recommended remediation:

- Replace `data-toggle` / legacy spacing helpers with `data-bs-*` and Bootstrap 5 utilities, and prefer Mustache/theme overrides.

## Major

Rule violated:

- Activity stores course-scoped data with no backup/restore support.

Why it matters:

- Backup, restore, and course copy will silently drop plugin data that should travel with the course.

Recommended remediation:

- Implement the module backup/restore structure steps for the records and files that must persist.

## Major

Rule violated:

- Derived data is cached with no invalidation on write.

Why it matters:

- Stale cache entries create hard-to-debug Moodle state after updates.

Recommended remediation:

- Define cache keys clearly and delete or replace entries on every mutation path.

## Major

Rule violated:

- The enqueue path and task processor use different queue tables and status meanings.

Why it matters:

- The UI can report success while the task sees no work, or completed children can leave a batch permanently in progress.

Recommended remediation:

- Align all tables with `install.xml`, define one status contract, and smoke-test entrypoint → row → task → final state.

## Major

Rule violated:

- An external delivery can resend already acknowledged data when time windows overlap.

Why it matters:

- Normal retries can create duplicate attendance, grades, or enrolments in the receiving system.

Recommended remediation:

- Persist a stable delivery key, attempts, and acknowledgement state; test overlap and timeout-after-send scenarios.

## Minor

Rule violated:

- A date filter and row action icons do not explain their Moodle field or action target.

Why it matters:

- Users must guess whether dates mean creation or `course.startdate`, and icon-only actions are ambiguous.

Recommended remediation:

- Use precise Form API labels/help and accessible action-icon text; add a compact legend only when repeated symbols need it.

## Minor

Rule violated:

- User-facing labels are hardcoded in PHP.

Why it matters:

- Hardcoded text weakens consistency and translation support.

Recommended remediation:

- Move the text to the language pack and read it with `get_string()`.

## Minor

Rule violated:

- Recurrent cleanup still runs at the end of a page request.

Why it matters:

- Request-time maintenance is unpredictable and belongs in the task subsystem.

Recommended remediation:

- Move the recurrent work into a scheduled task and keep the page focused on user interaction.
