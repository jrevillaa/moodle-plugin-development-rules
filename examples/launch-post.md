# Launch Post Draft

I published Moodle Plugin Development Rules `3.0.0`.

It helps any AI coding agent audit, build, and release-gate Moodle plugins with Moodle-native patterns, including:

- missing capability or context checks
- invented/unverified core APIs and schema fields
- fragile upgrades that call plugin classes during migration
- queue table and status-contract drift across UI → DB → task
- outbound HTTP URLs corrupted by Moodle's HTML `&amp;` separator
- fat entrypoints, spaghetti branches, duplicated logic, and queries in loops
- direct JS loading instead of AMD
- hand-built forms instead of Form API
- missing contextual help for operational filters and icon actions
- weak service/token wiring and non-idempotent external delivery
- Moodle 5.x Boost / Bootstrap 5.3 UI mistakes
- release readiness claimed without upgrade or workflow smoke checks

The repo includes:

- a lean agent-agnostic `SKILL.md`
- formal `rules/` with wrong vs preferred examples
- compact `references/rules-index.md` for cheap routing
- Moodle 5.x platform and theme references
- always-on proportionate Release Gate
- Moodle-inspired `vX.Y-stable` branches, SemVer tags, and GitHub Releases
- generated `AGENTS.md` as a full catalog, not default agent context

Repo:

`https://github.com/jrevillaa/moodle-plugin-development-rules`

Install:

```bash
npx skills add https://github.com/jrevillaa/moodle-plugin-development-rules
```

Prefer the `v3.0.0` release / `v3.0-stable` line for production installs. `main` is for ongoing development.

If you work with Moodle plugins and agent workflows, feedback is welcome.
