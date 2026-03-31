# Changelog

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
