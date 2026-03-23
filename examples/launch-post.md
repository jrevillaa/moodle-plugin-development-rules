# Launch Post Draft

I published a new skill for auditing and building Moodle plugins with Moodle-native patterns:

`moodle-plugin-development-rules`

It helps agents and reviewers catch things like:

- missing capability or context checks
- direct JS loading instead of AMD
- hand-built forms instead of Form API
- echoed views instead of Mustache and renderers
- weak DB API choices, unpaged reports, and fragile exports
- legacy external API placement, upgrade issues, privacy gaps, and missing tests

The repo includes:

- a lean `SKILL.md` for runtime use
- a curated `rules/` directory with wrong vs preferred examples
- generated `AGENTS.md`
- `test-cases.json` for evaluation

Repo:

`https://github.com/jrevillaa/moodle-plugin-development-rules`

Install:

```bash
npx skills add https://github.com/jrevillaa/moodle-plugin-development-rules
```

If you work with Moodle plugins and agent workflows, feedback is welcome.
