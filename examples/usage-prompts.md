# Usage Prompts

Use prompts like these to demonstrate or test the skill.

## Audit Prompts

- `Use $moodle-plugin-development-rules to audit this Moodle plugin and classify every finding as Critical, Major, or Minor.`
- `Use $moodle-plugin-development-rules to review this report plugin for scalability, DB API correctness, exports, and access control.`
- `Use $moodle-plugin-development-rules to validate whether this admin tool follows Moodle-native patterns for forms, rendering, capabilities, and tasks.`

## Refactor Prompts

- `Use $moodle-plugin-development-rules to refactor this page so it uses Form API, Mustache, renderers, and get_string().`
- `Use $moodle-plugin-development-rules to replace direct JS loading with AMD modules and proper Moodle page requirements calls.`
- `Use $moodle-plugin-development-rules to modernize this legacy plugin while preserving support for the current Moodle baseline.`

## Review Prompts

- `Use $moodle-plugin-development-rules to review whether this external API should stay in externallib.php or move to classes/external.`
- `Use $moodle-plugin-development-rules to check whether this plugin introduces Privacy API, File API, or backup/restore obligations.`
- `Use $moodle-plugin-development-rules to review this plugin for missing tests, weak helper boundaries, and hardcoded strings.`
