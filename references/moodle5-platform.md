# Moodle 5.x Platform Baseline

Use this file when the target branch is Moodle 5.0 or later, or when modernizing a plugin toward Moodle 5.x.

Always confirm the plugin's declared supported versions before applying these defaults. This page is a working baseline for agents, not a substitute for the official release notes of the exact target branch.

## Default Assumptions For Moodle 5.x Plugin Work

- PHP minimum for Moodle 5.0+ is PHP 8.2; PHP 8.3 and 8.4 appear on Moodle 5.x branches as support lands
- UI work defaults to Boost + Bootstrap 5.3
- New external APIs should prefer `classes/external/`
- Browser JS should be AMD modules under `amd/src/`
- Non-trivial views should use Mustache and renderers
- Privacy, backup/restore, tasks, and cache remain first-class review surfaces

## Practical PHP Matrix For Agents

| Moodle branch | Typical PHP range | Agent default |
| --- | --- | --- |
| 4.1.x | 7.4–8.1 | Avoid enums, `readonly`, attributes, promotion-heavy style |
| 4.4.x / 4.5.x LTS | 8.1–8.3 | Scalar/property types OK; gate enums/`readonly`/attributes carefully |
| 5.0+ | 8.2–8.4 | Modern typed PHP is safer, still subordinate to Moodle style and local codebase norms |
| 5.1+ | 8.2–8.4 | Also watch platform structure changes such as `/public` and stricter Composer runtime expectations |

Re-check [Moodle PHP policy](https://moodledev.io/general/development/policies/php) and the plugin's `version.php` / docs before insisting on a syntax change.

## Moodle 5.x Changes That Affect Plugin Authors

Treat these as review prompts when targeting or migrating to 5.x:

- Bootstrap 4 markup and utilities are legacy; prefer Bootstrap 5.3 patterns
- Theme SCSS and settings must account for theme cache reset behavior
- External services, hooks, and class autoloading should follow current core layouts
- Test tooling may move with core (for example PHPUnit major jumps on 5.x)
- From 5.1 onward, be aware of `/public` directory layout and Composer dependency enforcement in source installs
- Do not assume Oracle or other dropped platform options still matter for new 5.x work

## Migration Heuristics

When moving a plugin toward Moodle 5.x:

1. Confirm the supported Moodle range in the plugin metadata.
2. Replace Bootstrap 4 UI assumptions.
3. Move legacy `externallib.php` growth to `classes/external/` when supported.
4. Replace raw JS and echoed HTML with AMD + Mustache/renderers.
5. Re-check privacy, backup/restore, and capability definitions.
6. Re-run PHPUnit/Behat against the target 5.x branch.

## Remediation Language

- "Confirm this plugin's Moodle 5.x baseline before adopting PHP 8.2-only syntax."
- "For Moodle 5.x UI, default to Boost and Bootstrap 5.3, not Bootstrap 4."
- "Check whether this 5.1+ structural change applies to the deployment target before refactoring paths."
