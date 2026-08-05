# Moodle Plugin Development Rules

A Moodle-first engineering skill for agents and LLMs that need to audit, modernize, and build Moodle plugins correctly.

This skill helps an agent stop behaving like a generic PHP assistant and start behaving like a Moodle-aware reviewer and implementer.

It pushes the agent toward Moodle-native decisions for:

- security and capability checks
- code order: thin entrypoints, guard clauses, no scattered special cases, no duplicated logic
- performance structure: no per-row queries, no nested record loops, decomposed files
- Form API, Mustache, renderers, and AMD modules
- DB API choice, pagination, exports, and upgrades
- self-contained upgrades and verified core APIs/schema
- consistent queue tables, status contracts, and end-to-end workflow smoke
- external APIs, service/token wiring, idempotent delivery, and transaction-safe writes
- outbound HTTP query separators forced to literal `&` (never Moodle's HTML `&amp;` on the wire)
- always-on proportionate Release Gate before claiming readiness
- events, observers, scheduled/adhoc tasks, and cache invalidation
- privacy, files, and backup/restore obligations
- concise contextual help for operational views, filters, and icon actions
- PHP compatibility and coding style without drifting away from Moodle
- realistic scenario-based testing, including failures and recovery paths
- Moodle 5.x Boost, Bootstrap 5.3, SCSS, and UI/theme changes

The repository is explicitly Moodle-first and agent-agnostic. It can incorporate generic PHP best practices, but only when they align with Moodle-supported PHP versions, coding style, and subsystem conventions.

## Elevator Pitch

If you want an AI coding agent to review or write Moodle plugin code without inventing random framework patterns, forcing generic PSR advice, or skipping the hard parts like permissions, upgrades, and failure scenarios, this skill is built for that.

It gives the agent a Moodle-native rule system, a review workflow, reference notes, and concrete remediation patterns so the output is closer to what an experienced Moodle maintainer would expect.

## Version 3.0

Version `3.0.0` is the current stable major release.

It combines Moodle-first implementation rules, always-on release safety, Moodle 5.x knowledge, strict maintainability standards, and cheap agent context loading.

See [BRANCHING.md](./BRANCHING.md) for the Moodle-inspired branch/tag/release model:

- `main` for active development
- `v3.0-stable` for the installable 3.0 line
- `v3.0.0` tags and GitHub Releases for published installs

## Version 2.4

Version `2.4.0` was a development draft folded into `3.0.0`. It introduced always-on Release Gate work, cheap context loading, and the outbound HTTP `&amp;` separator rule.

## Version 2.3

Version `2.3.0` was a development draft folded into `3.0.0`. It added a strict maintainability layer for plugin code order, adapted from the thermo-nuclear code quality review standard and re-expressed in Moodle terms.

It now formally covers:

- thin page entrypoints instead of fat page scripts
- guard clauses instead of deep `if`/`else` nesting
- contained special cases instead of flags scattered through shared flows
- one canonical implementation per domain operation
- no queries, context building, or remote calls inside loops
- file decomposition before `locallib.php`-style sprawl

## Version 2.2

Version `2.2.0` adds a release-safety layer so agents do not declare Moodle plugin changes ready after inventing APIs, breaking upgrades, or skipping operational smoke.

It now formally covers:

- self-contained upgrades that never call mutable plugin classes
- verification of core methods and schema fields before use
- queue/table and status-contract consistency across the full workflow
- idempotent external delivery and real service/token verification
- legacy-flow parity checks for rewrites
- concise contextual operational UX using Form API help and accessible icons
- a Release Gate checklist that distinguishes verified, not applicable, and not verified checks

## Version 2.1

Version `2.1.0` closes the gap between section promises and formal rules, makes the skill agent-agnostic, and promotes Moodle 5.x into first-class knowledge.

It now formally covers:

- events/observers, adhoc tasks, and cache invalidation as rules (not only references)
- backup/restore obligations as a formal lifecycle rule
- Moodle 5.x Boost + Bootstrap 5.3 UI as a formal UI rule
- a Moodle/PHP matrix and Moodle 5.x platform baseline for agents
- compact mode/topic routing so agents load only what they need

## Version 2.0

Version `2.0.0` expands the skill beyond the original rule set.

It now covers:

- Moodle-native plugin architecture and security
- Form API, renderers, Mustache, output helpers, and AMD JavaScript
- DB API choice, pagination, upgrades, and scalability
- External APIs, service exposure, and transaction-safe write endpoints
- PHP compatibility gating, Moodle-first coding style, and PHPCS guidance
- Scenario-based testing for success, failure, interruption, and recovery paths
- Moodle 5.x theme, Boost, Bootstrap 5.3, SCSS, and UI override guidance

This is a major version because the skill is no longer just a compact Moodle plugin rule list. It is now a broader Moodle engineering guide for building, reviewing, modernizing, and hardening plugin code.

## What The Skill Does

Use this skill when you want an agent to:

- audit a Moodle plugin and classify findings as `Critical`, `Major`, or `Minor`
- implement Moodle-native fixes instead of generic PHP or framework abstractions
- review external APIs, permissions, and service exposure
- modernize legacy plugin code without breaking supported Moodle or PHP versions
- apply PHP best practices only when they fit Moodle conventions
- design tests around realistic feature scenarios, not only the happy path
- handle Moodle 5 visual and theme work with Boost and Bootstrap 5.3 in mind
- validate a change with a release gate before upgrade, staging, or consumer handoff

## Why This Skill Is Different

Most generic coding skills are too broad for Moodle. They tend to:

- miss capability and context boundaries
- suggest architecture that fights Moodle extension points
- recommend modern PHP syntax without checking Moodle branch compatibility
- invent plausible core methods or schema fields
- under-specify external APIs and token/service wiring
- ignore partial failures, retries, and recovery scenarios
- declare release readiness without upgrade or workflow smoke checks
- treat theme work as generic frontend work instead of Boost-based Moodle UI work

This skill is designed to correct those failure modes.

## Ideal Use Cases

- auditing an existing Moodle plugin before merging or releasing
- modernizing legacy code without breaking supported Moodle versions
- implementing a new plugin feature with the right Moodle APIs from the start
- reviewing a CSV import, enrolment, grade, or reporting workflow for edge cases
- creating or hardening external APIs for mobile, AJAX, or third-party integrations
- reviewing Moodle 5 theme or UI changes against Boost and Bootstrap 5.3 expectations

## Structure

- `BRANCHING.md` - Moodle-inspired branch, tag, and GitHub Release model
- `rules/` - Individual rule files, one per rule
  - `_sections.md` - Section metadata, impacts, prefixes, and descriptions
  - `_template.md` - Template for creating new rules
  - `area-description.md` - Individual rule files such as `security-capability-checks.md`
- `src/` - Build, validation, and test extraction scripts
- `metadata.json` - Document metadata, version, and references
- `AGENTS.md` - Full compiled catalog for humans/installers; do not always-load into agents
- `references/rules-index.md` - Compact generated rule index for on-demand agent routing
- `test-cases.json` - Test cases for LLM evaluation
- `SKILL.md` - Lean skill entrypoint used by the skill runtime
- `references/` - Supporting reference guides used by the skill
  - Includes audit workflow, topic routing, release-gate checklist, Moodle-filtered PHP guidance, Moodle 5.x platform/theme notes, coding style notes, and plugin-type must-check lists
- `agents/openai.yaml` - UI metadata for skill catalogs
- `assets/` - Skill icons and visual assets

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Build `AGENTS.md` and `references/rules-index.md` from the rule files:
   ```bash
   pnpm build
   ```

3. Validate rule files:
   ```bash
   pnpm validate
   ```

4. Extract test cases:
   ```bash
   pnpm extract-tests
   ```

## Install the Skill

Install the repository as a skill source:

```bash
npx skills add https://github.com/jrevillaa/moodle-plugin-development-rules
```

If your setup supports selecting a specific skill by name:

```bash
npx skills add https://github.com/jrevillaa/moodle-plugin-development-rules --skill moodle-plugin-development-rules
```

## Usage Examples

Use prompts like:

- `Use $moodle-plugin-development-rules to audit this Moodle local plugin and classify findings as Critical, Major, or Minor.`
- `Use $moodle-plugin-development-rules to refactor this report page to use pagination, filters, and the right DB API.`
- `Use $moodle-plugin-development-rules to review whether this plugin is using Form API, Mustache, AMD, and capability checks correctly.`
- `Use $moodle-plugin-development-rules to modernize this legacy Moodle plugin without breaking supported versions.`
- `Use $moodle-plugin-development-rules to review this external API implementation and move it to classes/external if appropriate.`
- `Use $moodle-plugin-development-rules to apply PHP best practices to this Moodle plugin, but keep Moodle conventions and version support as the priority.`
- `Use $moodle-plugin-development-rules to review this CSV enrolment workflow and design scenario-based tests for success, validation failures, partial upload failures, and recovery behavior.`
- `Use $moodle-plugin-development-rules to review this Moodle 5 theme change for Boost, Bootstrap 5.3, SCSS, and Mustache correctness.`
- `Use $moodle-plugin-development-rules to check backup/restore, events/observers, and cache invalidation for this mod plugin.`
- `Use $moodle-plugin-development-rules as a Release Gate for this plugin change: verify upgrade safety, workflow smoke, service/token wiring, and contextual UX.`

## Outcome You Should Expect

When this skill is used well, the agent should:

- classify findings as `Critical`, `Major`, or `Minor`
- explain problems in Moodle terms, not generic framework jargon
- prefer Moodle APIs over ad hoc PHP or frontend shortcuts
- catch version, security, and upgrade risks early
- recommend tests for both normal and failure scenarios
- produce fixes that look natural inside a Moodle plugin codebase

## Creating a New Rule

1. Copy `rules/_template.md` to `rules/area-description.md`
2. Choose the appropriate area prefix:
   - `security-` for Capabilities and Security
   - `compat-` for Version Compatibility and Upgrades
   - `ui-` for Forms, Rendering, Moodle 5 UI, and Output Structure
   - `amd-` for JavaScript and Frontend Behavior
   - `data-` for Data Access, SQL Choice, and Scalability
   - `external-` for Web Services and External APIs
   - `async-` for Events, Tasks, Cache, and Async Work
   - `lifecycle-` for Privacy, Files, and Backup/Restore
   - `arch-` for Naming, Helpers, and Plugin Structure
   - `quality-` for Accessibility, I18n, and Testing
3. Fill in the frontmatter and content
4. Ensure you have clear `Wrong` and `Preferred` examples with explanations
5. Run `pnpm build` to regenerate `AGENTS.md`
6. Run `pnpm extract-tests` to regenerate `test-cases.json`

## Rule File Structure

Each rule file should follow this structure:

```markdown
---
title: Rule Title Here
impact: MEDIUM
impactDescription: Optional description
tags: tag1, tag2, tag3
---

## Rule Title Here

Brief explanation of the rule and why it matters.

Wrong:

```php
// Bad code example
```

Preferred:

```php
// Good Moodle-native example
```

Why it matters:

- Explain the framework-level reason

Recommended remediation:

- Explain what the agent should do instead

Reference: [Link](https://example.com)
```

## File Naming Convention

- Files starting with `_` are special and excluded from build
- Rule files use `area-description.md`, for example `security-capability-checks.md`
- Section is inferred from the filename prefix
- Rules are grouped by prefix and can be extended incrementally

## Impact Levels

- `CRITICAL` - Highest priority, major correctness or security impact
- `HIGH` - Significant framework, scalability, or maintainability impact
- `MEDIUM-HIGH` - Strong but not top-tier impact
- `MEDIUM` - Moderate quality or consistency improvements
- `LOW-MEDIUM` - Incremental improvements with practical value
- `LOW` - Nice-to-have refinements

## Scripts

- `pnpm build` - Compile rules into `AGENTS.md` and `references/rules-index.md`
- `pnpm validate` - Validate all rule files
- `pnpm extract-tests` - Extract test cases for LLM evaluation
- `pnpm dev` - Build and validate

## Contributing

When adding or modifying rules:

1. Use the correct filename prefix for the section
2. Follow the `_template.md` structure
3. Include clear wrong/preferred examples with explanations
4. Add appropriate tags
5. Run `pnpm build` to regenerate `AGENTS.md`
6. Run `pnpm extract-tests` to regenerate `test-cases.json`

## Notes

`SKILL.md` stays intentionally lean so the skill remains efficient at runtime. Agents should load `SKILL.md`, then `references/rules-index.md` and only the needed `rules/` + `references/` files. `AGENTS.md` is a generated full catalog for humans and installers; always-applying it is an anti-pattern. See `references/context-loading.md`.

If a marketplace or skill catalog shows only a short summary, describe this repository as:

`Moodle-first engineering rules for auditing, building, modernizing, and hardening Moodle plugins, including external APIs, PHP compatibility, testing, and Moodle 5 UI/theme guidance.`

## Publishing Checklist

- Keep `SKILL.md` concise and operational
- Keep `README.md` clear for humans discovering the repo
- Run `pnpm validate`
- Run `pnpm build`
- Run `pnpm extract-tests`
- Confirm `AGENTS.md`, `references/rules-index.md`, and `test-cases.json` are regenerated
- Confirm icons render and `agents/openai.yaml` points to the right assets
- Test install flow with `npx skills add ...`
- Add a release note or post with 2-3 concrete usage examples
- Keep adding high-signal rules over time so the repo looks actively maintained
