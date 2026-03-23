# Moodle Plugin Development Rules

A structured repository for creating and maintaining Moodle plugin development rules optimized for agents and LLMs.

## Structure

- `rules/` - Individual rule files, one per rule
  - `_sections.md` - Section metadata, impacts, prefixes, and descriptions
  - `_template.md` - Template for creating new rules
  - `area-description.md` - Individual rule files such as `security-capability-checks.md`
- `src/` - Build, validation, and test extraction scripts
- `metadata.json` - Document metadata, version, and references
- `AGENTS.md` - Compiled output
- `test-cases.json` - Test cases for LLM evaluation
- `SKILL.md` - Lean skill entrypoint used by the skill runtime
- `references/` - Supporting reference guides used by the skill
- `agents/openai.yaml` - UI metadata for skill catalogs
- `assets/` - Skill icons and visual assets

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Build `AGENTS.md` from the rule files:
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

## Creating a New Rule

1. Copy `rules/_template.md` to `rules/area-description.md`
2. Choose the appropriate area prefix:
   - `security-` for Capabilities and Security
   - `compat-` for Version Compatibility and Upgrades
   - `ui-` for Forms, Rendering, and Output Structure
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

- `pnpm build` - Compile rules into `AGENTS.md`
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

`SKILL.md` stays intentionally lean so the skill remains efficient at runtime. The broader editorial and generated artifacts live in `rules/`, `AGENTS.md`, and `test-cases.json`.
