# Context Loading Strategy

Use this file to keep the skill cheap and accurate in agent runtimes.

## What To Load

Default runtime path:

1. `SKILL.md` - always, as the lean entrypoint
2. [rules-index.md](./rules-index.md) - when you need to know which formal rule applies
3. Only the matching `rules/<area>-*.md` files - read the full rule before applying or remediating it
4. Only the matching topic references from [routing.md](./routing.md)

## What Not To Load By Default

Do **not** load `AGENTS.md` into the agent context unless the user explicitly asks for the full compiled catalog.

`AGENTS.md` is a generated human/catalog artifact. It contains every rule body and can exceed a thousand lines. Always-applying it is an anti-pattern: it burns tokens, dilutes attention, and fights progressive disclosure.

## Recommended Runtime Topology

| Artifact | Purpose | Load into agent context? |
| --- | --- | --- |
| `SKILL.md` | Operating modes, non-negotiables, routing | Yes |
| `references/rules-index.md` | Compact rule titles and impacts | On demand |
| `rules/*.md` | Full wrong/preferred rule bodies | Only the needed files |
| `references/*.md` | Topic depth | Only the needed files |
| `AGENTS.md` | Full compiled catalog for humans/installers | No, unless explicitly requested |
| `test-cases.json` | Eval fixtures | Only for evaluation work |

## If A Host Injects AGENTS.md Automatically

Prefer one of these fixes:

1. Stop always-applying `AGENTS.md` as a workspace rule
2. Point the host at `SKILL.md` + on-demand references instead
3. Keep `AGENTS.md` for docs/catalog installers only

Do not split `AGENTS.md` into many always-loaded fragments. That recreates the same cost. The efficient split already exists: individual `rules/` files loaded only when routed.
