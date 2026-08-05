# Branching And Releases

This repository follows a Moodle-inspired branching model.

## Branches

| Branch | Role |
| --- | --- |
| `main` | Active development. May contain unfinished work that is not yet a released install target. |
| `v2.0-stable` | Stable line for the 2.0.x release series |
| `v3.0-stable` | Stable line for the 3.0.x release series |
| `v3.1-stable` | Stable line for the 3.1.x release series |

When a new major or minor line is released:

1. Stabilize the intended commit on `main`
2. Create or update `vX.Y-stable` from that commit
3. Tag `vX.Y.Z` on the stable branch
4. Publish a GitHub Release from that tag
5. Continue unfinished work on `main`

Patch releases for an older line (for example `v3.0.1`) are committed on that line's stable branch and tagged there. Only merge forward to `main` when needed.

## Tags

- Tags use SemVer with a `v` prefix: `v2.0.0`, `v3.0.0`, `v3.0.1`
- A tag marks an installable release
- GitHub Releases use the same tag and include release notes from `CHANGELOG.md`

## Install Targets

Prefer installing from a release tag or the current stable branch:

```bash
npx skills add https://github.com/jrevillaa/moodle-plugin-development-rules --skill moodle-plugin-development-rules
```

For a pinned release, use the GitHub Release / tag once published.

Do not treat `main` as the production install target unless you intentionally want unreleased development work.

## Agent Runtime Note

Agents should load `SKILL.md` and on-demand `rules/` / `references/` files.
`AGENTS.md` is the generated full catalog for humans and installers, not the default always-loaded agent context.
