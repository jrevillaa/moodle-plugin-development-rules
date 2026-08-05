# Usage Prompts

Use prompts like these to demonstrate or test the skill. The skill is agent-agnostic; `$moodle-plugin-development-rules` works with Cursor, Claude, Codex, and similar skill runtimes.

## Audit Prompts

- `Use $moodle-plugin-development-rules to audit this Moodle plugin and classify every finding as Critical, Major, or Minor.`
- `Use $moodle-plugin-development-rules to review this report plugin for scalability, DB API correctness, exports, and access control.`
- `Use $moodle-plugin-development-rules to validate whether this admin tool follows Moodle-native patterns for forms, rendering, capabilities, and tasks.`
- `Use $moodle-plugin-development-rules to audit this mod_* plugin for backup/restore, privacy, events, and capability coverage.`

## Refactor Prompts

- `Use $moodle-plugin-development-rules to refactor this page so it uses Form API, Mustache, renderers, and get_string().`
- `Use $moodle-plugin-development-rules to replace direct JS loading with AMD modules and proper Moodle page requirements calls.`
- `Use $moodle-plugin-development-rules to modernize this legacy plugin while preserving support for the current Moodle baseline.`
- `Use $moodle-plugin-development-rules to migrate this UI to Moodle 5.x Boost and Bootstrap 5.3 conventions.`

## Review Prompts

- `Use $moodle-plugin-development-rules to review whether this external API should stay in externallib.php or move to classes/external.`
- `Use $moodle-plugin-development-rules to check whether this plugin introduces Privacy API, File API, or backup/restore obligations.`
- `Use $moodle-plugin-development-rules to review this plugin for missing tests, weak helper boundaries, and hardcoded strings.`
- `Use $moodle-plugin-development-rules to review whether this heavy follow-up work should be an adhoc task, scheduled task, or observer.`
- `Use $moodle-plugin-development-rules to check this cache usage for definition scope and invalidation on write.`
- `Use $moodle-plugin-development-rules to review this queue workflow for table consistency, status contracts, and inclusive date filters.`
- `Use $moodle-plugin-development-rules to review this operational page for concise contextual help: view lead, Form API field help, and accessible icon actions.`

## Structure Prompts

- `Use $moodle-plugin-development-rules to review this plugin for spaghetti growth, duplicated logic, fat page entrypoints, and file sprawl.`
- `Use $moodle-plugin-development-rules to flatten this nested logic with guard clauses and move domain work into classes/.`
- `Use $moodle-plugin-development-rules to remove per-row queries from these loops using set-based Moodle DB calls.`

## Release Gate Prompts

- `Use $moodle-plugin-development-rules and keep Release Gate always active: finish with Verified / Not applicable / Not verified for the relevant checks.`
- `Use $moodle-plugin-development-rules to validate upgrade.php self-containment, core API verification, and a staging upgrade smoke path.`
- `Use $moodle-plugin-development-rules to verify service/token wiring and idempotent external delivery before consumer handoff.`
- `Use $moodle-plugin-development-rules to review this outbound Banner/HTTP client for http_build_query separators and exact request-URL smoke checks.`
