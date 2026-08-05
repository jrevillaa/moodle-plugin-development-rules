# Moodle Plugin Release Gate

This gate is always active after Audit findings are remediable, and after every Fix, Migration, Theme/UI, or claimed completion. It is proportionate, not optional: apply only the relevant sections, but record each item as **Verified**, **Not applicable**, or **Not verified**. Never report an unexecuted check as passed. Never say the work is ready while a relevant critical check remains Not verified.

## 1. Static Integrity

- Run PHP syntax checks on every changed PHP file
- Run XML validation or the project's normal validator on changed XML
- Detect accidental duplicate opening roots such as multiple `<?php` or `<?xml` declarations
- Review suspicious file-size growth or duplicated old code after broad rewrites
- Run the plugin's Moodle coding-standard checks when configured

Example checks:

```bash
php -l path/to/changed.php
rg -n '<\?php|<\?xml' path/to/changed/files
```

Interpret duplicate-root counts carefully: multiple PHP open tags can be legal in mixed templates, but Moodle plugin PHP files normally should not contain appended duplicate documents.

## 2. Upgrade Safety

- `db/upgrade.php` uses XMLDB, parameterized DML/SQL, literal legacy values, and config APIs only
- No upgrade step depends on a class newly introduced by the same plugin
- Every core method used by the upgrade was verified in the target Moodle branch
- `version.php`, `db/install.xml`, capabilities, and upgrade savepoints are aligned
- Run `admin/cli/upgrade.php` or the Notifications upgrade flow from a representative older version in local/staging
- Confirm the upgrade completes end to end without an exception

## 3. Critical Workflow Smoke

Trace the real workflow, not isolated methods:

1. Trigger the action from its UI or external entrypoint
2. Confirm the expected row is written to a table declared in `db/install.xml`
3. Run the scheduled/adhoc task or processor
4. Confirm the child state and parent/batch aggregate
5. Confirm the real Moodle side effect, such as course deletion, restore, enrolment, or delivery
6. Confirm failure state and actionable error output

For a replacement of a legacy flow, compare observable behavior with the reference implementation.

## 4. Data And Time Contracts

- Producers, consumers, reports, and tasks use the same installed tables and fields
- Persisted status meanings are defined once and used by writers and readers
- Parent/batch status is recalculated from children through one shared operation
- Calendar date ranges use start-inclusive and end-exclusive timestamp bounds
- Boundary tests cover user timezone and the full inclusive “To” date
- Large listings use paging and define current-page, selected, and all-results bulk semantics

## 5. External Services And Integrations

- The function is registered accurately in `db/services.php`
- The intended custom service contains the function after deployment
- The token user has the required capability and valid IP/time restrictions
- A minimal authenticated request succeeds with the consumer-equivalent service configuration
- Outbound HTTP query strings use literal `&` separators (`http_build_query($params, '', '&')`), not Moodle's HTML `&amp;`
- Logged or asserted request URLs contain `&page=` / `&size=` style params, never `amp;page`
- Retried deliveries use a stable idempotency key or watermark
- Tests cover overlapping windows, timeout-after-send, and already-acknowledged data
- Logs capture attempt/result without exposing secrets or personal data unnecessarily
- Empty remote result sets are treated as suspicious until the exact request URL and params are verified
## 6. Security And Admin Operations

- Every admin page resolves context and enforces the plugin capability
- Site-administration custom screens use `admin_externalpage` + `admin_externalpage_setup()`
- Shared pages accessible to non-admin roles show a real breadcrumb path; they do not depend on Site administration tabs
- Every state-changing action validates sesskey
- UI visibility is not used as authorization
- Destructive actions confirm intent, identify the affected count, and explain irreversibility
- Progress and error states reflect persisted workflow state rather than cosmetic labels
- Multi-step / chained background work emits `mtrace` (or equivalent) stage markers in task logs
- Manual-run actions stream progress and offer a return control; they do not leave a silent spinner through the full pipeline

## 7. Contextual UX

- Each operational view has a translated one- or two-sentence lead when its purpose is not self-evident
- Ambiguous controls explain the real Moodle field, for example `course.startdate`
- Field-specific details use Form API labels/help buttons where possible
- Important exclusions and boundaries are explicit (`SITEID`, unset start date, inclusive end date)
- Breadcrumbs are visible and reflect the real navigation path for the current page
- Icon actions use Moodle output helpers with accessible action labels
- Repeated icons or status chips have a compact legend only when needed
- Secondary explanation is placed in help or `<details>`, not a large inline information wall
- A user can identify the view purpose and primary action in a few seconds

## 8. Automated And Operational Verification

- Relevant PHPUnit tests pass
- Relevant Behat scenarios pass when the workflow is UI-driven
- Success, validation failure, permission failure, partial processing, and retry scenarios are covered
- Cron/task execution was exercised when the feature depends on it
- README/release notes document upgrade, cron, capabilities, service/token wiring, and any manual operational step

## Release Handoff

Summarize:

- Checks verified
- Checks not applicable
- Checks not run and why
- Residual risks
- Exact staging/operations steps still required

Do not use “ready”, “done”, or “passes” for a release-sensitive path when critical checks remain not verified.
