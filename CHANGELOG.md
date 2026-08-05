# Changelog

## 3.0.0 - August 2026

Major release of the Moodle Plugin Development Rules skill.

This version turns the skill into a full Moodle-first engineering and release-safety system for agents: formal rules, on-demand references, always-on proportionate Release Gate, Moodle 5.x knowledge, strict maintainability standards, and operational traps learned from real plugin failures.

### Highlights

- Always-on proportionate Release Gate with Verified / Not applicable / Not verified reporting
- Moodle 5.x Boost / Bootstrap 5.3 formal UI rule and platform baseline
- Strict structure rules adapted from thermo-nuclear review: thin entrypoints, guard clauses, no scattered special cases, one canonical implementation, no queries in loops, file decomposition
- Critical outbound HTTP rule for Moodle's `arg_separator.output = '&amp;'` vs `http_build_query(..., '', '&')`
- Self-contained upgrades, verified core APIs/schema, queue/status contracts, idempotent delivery, service/token verification, legacy parity
- Contextual operational UX using Form API help and accessible icon actions
- Lean runtime loading: `SKILL.md` → `references/rules-index.md` → only needed `rules/` and references
- `AGENTS.md` remains a generated full catalog, not default agent context
- Moodle-inspired branching: `main` for development, `vX.Y-stable` for installable lines, SemVer tags, GitHub Releases

### Formal rule count

43 formal rules with extracted test cases, plus supporting references for audit, routing, release gate, maintainability, and Moodle 5.x.

### Development history since 2.0.0

Unreleased incremental drafts `2.1.0`–`2.4.0` are folded into this major release.

## 2.4.0 - August 2026 (development draft, folded into 3.0.0)

Made Release Gate always-on and proportionate, optimized agent context loading, and added the outbound HTTP `&amp;` separator trap as a formal Critical rule.

Added:

- `external-http-query-separator` for Moodle's `arg_separator.output = '&amp;'` interaction with `http_build_query()`
- `references/context-loading.md` explaining what to load and why `AGENTS.md` must not be always-applied
- generated `references/rules-index.md` as the compact on-demand rule catalog

Changed:

- Release Gate is no longer an optional mode; every Fix/Migration/Theme/UI/completion path ends with a proportionate Verified / Not applicable / Not verified summary
- `src/build.mjs` now emits both the full `AGENTS.md` catalog and the compact rules index
- `AGENTS.md` header now states it is for humans/installers, not default agent context

## 2.3.0 - August 2026

Added a strict maintainability layer for plugin code order, adapted from the thermo-nuclear code quality review standard and re-expressed in Moodle terms.

Added formal rules:

- `arch-thin-entrypoints`
- `arch-guard-clauses-over-nesting`
- `arch-no-scattered-special-cases`
- `arch-single-canonical-implementation`
- `arch-decompose-large-files`
- `data-no-queries-in-loops`

Added reference:

- `maintainability-and-structure.md` for spaghetti growth, duplication, fat entrypoints, loop cost, and file sprawl

Updated:

- `arch` section raised to HIGH impact and renamed around structure and maintainability
- `architecture-and-naming.md` with guard clauses, flag parameters, file size, and canonical ownership
- routing, review checklist, quick triage, and anti-patterns with structural entries
- `SKILL.md` non-negotiables and remediation language

## 2.2.0 - August 2026

Added a release-safety layer derived from real Moodle plugin upgrade and operations failures.

Added formal rules:

- `compat-upgrade-self-contained`
- `compat-verify-core-contracts`
- `data-persistence-flow-consistency`
- `data-status-contract`
- `data-status-labels-without-seed-dependency`
- `data-inclusive-date-filters`
- `external-idempotent-delivery`
- `external-service-token-verification`
- `quality-reference-parity`
- `ui-contextual-guidance`

Expanded:

- `data-paginated-tables` for current-page / selected / all-results bulk semantics
- `references/release-gate-checklist.md` as a mandatory handoff gate
- Release Gate operating mode in `SKILL.md`
- audit/review/testing references for upgrade smoke, queue status contracts, token wiring, and contextual operational UX

Intent:

- stop agents from inventing core APIs, putting plugin classes in upgrades, drifting queue tables/statuses, or declaring release readiness without verified checks

## 2.1.0 - August 2026

Closed the gap between promised sections and formal rules, made the skill agent-agnostic, and promoted Moodle 5.x into first-class skill knowledge.

Added formal rules:

- `async-events-observers`
- `async-cache-invalidation`
- `async-adhoc-deferred-work`
- `lifecycle-backup-restore`
- `ui-moodle5-theme`

Added or expanded references:

- `routing.md` for compact topic routing
- `moodle5-platform.md` for Moodle 5.x platform baseline and PHP matrix notes
- stronger plugin-type must-check lists
- Moodle/PHP matrix in PHP guidance
- audit examples and anti-patterns for Moodle 5 UI, backup/restore, events, cache, and adhoc tasks

Updated:

- `SKILL.md` description and workflow to be agent-agnostic
- operating modes with starter reference tables
- generated `AGENTS.md` and `test-cases.json`
- README positioning and usage prompts

## 2.0.0 - March 2026

Major expansion of the skill from a compact Moodle plugin ruleset into a broader Moodle engineering guide.

Added:

- Moodle-filtered PHP best-practices guidance
- Moodle-first coding style and PHPCS guidance
- PHP feature gating by Moodle and PHP support matrix
- rules for keeping generic PHP guidance subordinate to Moodle conventions
- stronger external API guidance for contracts, service exposure, and write safety
- a formal rule for transaction-safe multi-step write endpoints
- scenario-based testing guidance for success, failure, interruption, and recovery paths
- Moodle 5.x theme and UI guidance for Boost, Bootstrap 5.3, SCSS, and template overrides

Expanded:

- README positioning and usage examples
- skill routing in `SKILL.md`
- generated `AGENTS.md`
- extracted `test-cases.json`

Intent:

- make the skill useful not only for rule lookup, but for real Moodle plugin implementation, hardening, review, and modernization work
