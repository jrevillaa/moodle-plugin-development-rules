# Topic Routing

Use this map after choosing Audit, Fix, Migration, or Theme/UI mode. Release Gate is always active and proportionate at the end. Read only the files needed for the current task. Prefer [rules-index.md](./rules-index.md) and [context-loading.md](./context-loading.md) before opening large catalogs.

## Architecture And Plugin Shape

- Plugin architecture, hooks, callbacks, helpers, naming, constants → [architecture-and-naming.md](./architecture-and-naming.md)
- Spaghetti, duplicated logic, fat entrypoints, heavy loops, file sprawl → [maintainability-and-structure.md](./maintainability-and-structure.md)
- Formal structure rules: `arch-thin-entrypoints`, `arch-guard-clauses-over-nesting`, `arch-no-scattered-special-cases`, `arch-single-canonical-implementation`, `arch-decompose-large-files`, `arch-helper-boundaries`, `data-no-queries-in-loops`
- Plugin-type expectations (`local`, `mod`, `block`, `report`, `theme`, `auth`, `enrol`, admin tool) → [plugin-type-guidance.md](./plugin-type-guidance.md)
- Legacy-to-modern refactors → [migration-patterns.md](./migration-patterns.md)
- Wrong vs preferred quick patterns → [anti-patterns-and-fixes.md](./anti-patterns-and-fixes.md)

## PHP Compatibility And Style

- PHP features, typing, exceptions, SOLID/PSR tension → [php-best-practices.md](./php-best-practices.md)
- Moodle coding style and PHPCS → [coding-style-and-phpcs.md](./coding-style-and-phpcs.md)
- Upgrades, DB choice, pagination, exports, version gates → [data-performance-and-upgrades.md](./data-performance-and-upgrades.md)
- Upgrade/staging/production handoff → [release-gate-checklist.md](./release-gate-checklist.md)

## Moodle 5.x

- Platform baseline, PHP matrix notes, structural changes → [moodle5-platform.md](./moodle5-platform.md)
- Boost, Bootstrap 5.3, SCSS, template overrides, theme settings → [moodle5-theme-and-ui.md](./moodle5-theme-and-ui.md)
- Formal rule: `rules/ui-moodle5-theme.md`

## Security, UI, And Frontend

- Capabilities, context, sesskey, secure requests → [capabilities-and-security.md](./capabilities-and-security.md)
- Settings, navigation, URLs, icons, escaping, admin external pages, breadcrumbs → [navigation-settings-and-output.md](./navigation-settings-and-output.md)
- Forms, Mustache, renderers, contextual help → [forms-and-rendering.md](./forms-and-rendering.md)
- AMD and browser behavior → [frontend-and-js.md](./frontend-and-js.md)
- Formal UI rules: `ui-form-api`, `ui-mustache-renderers`, `ui-moodle-url-output`, `ui-moodle5-theme`, `ui-contextual-guidance`, `ui-admin-setup-and-breadcrumbs`

## Data, Services, And Async

- External APIs and service exposure → [webservices-and-external-api.md](./webservices-and-external-api.md)
- Events, observers, scheduled/adhoc tasks, cache → [events-tasks-and-cache.md](./events-tasks-and-cache.md)
- Formal async rules: `async-scheduled-task`, `async-adhoc-deferred-work`, `async-task-progress-and-manual-run`, `async-events-observers`, `async-cache-invalidation`
- Formal data/workflow rules: `data-persistence-flow-consistency`, `data-status-contract`, `data-status-labels-without-seed-dependency`, `data-inclusive-date-filters`
- Formal delivery rules: `external-idempotent-delivery`, `external-service-token-verification`, `external-http-query-separator`

## Lifecycle And Quality

- Privacy, files, backup/restore → [privacy-files-and-backup.md](./privacy-files-and-backup.md)
- Formal lifecycle rules: `lifecycle-privacy-review`, `lifecycle-file-api`, `lifecycle-backup-restore`
- Accessibility and i18n → [accessibility-and-i18n.md](./accessibility-and-i18n.md)
- PHPUnit, Behat, fixtures, scenario coverage → [testing-and-quality.md](./testing-and-quality.md)
- Formal quality rules: `quality-get-string`, `quality-accessible-labels`, `quality-testing-coverage`, `quality-scenario-based-testing`, `quality-reference-parity`

## Audit Aids

- Full audit workflow → [plugin-review-workflow.md](./plugin-review-workflow.md)
- Fast criticity triage → [quick-triage.md](./quick-triage.md)
- PR/review checklist → [review-checklist.md](./review-checklist.md)
- Finding wording examples → [findings-examples.md](./findings-examples.md)
- Release gate and handoff status → [release-gate-checklist.md](./release-gate-checklist.md)
