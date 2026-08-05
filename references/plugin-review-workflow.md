# Plugin Review Workflow

Use this workflow when reviewing an existing Moodle plugin.

## Step 1: Identify the Plugin Surface

Determine:

- Plugin type
- Supported Moodle version range
- Main entrypoints: pages, forms, tasks, observers, external APIs, templates, and JS

## Step 2: Check Critical Boundaries First

Review before anything else:

- Context resolution
- `require_login()`
- Capability checks
- Sesskey validation for state-changing actions
- Version compatibility of chosen APIs
- Upgrade-path correctness for persistent changes
- Upgrade steps that call classes from the same plugin
- Core methods or schema fields used without target-branch verification

If any of these fail, classify the finding early as likely `Critical`.

## Step 3: Inspect Moodle-Native UI Patterns

Check whether:

- Real forms use Form API
- Non-trivial views use Mustache and renderers
- Browser logic is implemented through AMD modules
- User-facing strings use `get_string()`
- Moodle 5.x targets follow Boost and Bootstrap 5.3 conventions
- Ambiguous fields and icon actions have concise contextual guidance

These are usually `Major` when the code works but ignores Moodle-native structure.

## Step 4: Inspect Data and Scalability

Check whether:

- Report screens assume small datasets
- Pagination, sorting, and filtering are in place where needed
- DB API choice matches query shape
- Exports reuse validated filters and access checks
- PHP syntax matches the plugin's Moodle/PHP matrix
- Queue producers, tasks, and reports agree on tables and status meanings
- Calendar ranges implement the stated inclusive/exclusive semantics

## Step 5: Inspect Lifecycle and Integration

Review:

- External API placement and contracts
- Scheduled vs adhoc task boundaries
- Events/observers for cross-cutting reactions
- Cache definitions and invalidation
- Idempotency and acknowledgement state for retried integrations
- Custom service and token wiring for external consumers
- Privacy implications
- File handling
- Backup/restore implications where relevant

## Step 6: Inspect Quality and Maintenance Signals

Check whether:

- Names are explicit
- Helpers are cohesive
- Accessibility basics are respected
- There is automated test coverage for non-trivial behavior
- Legacy replacements prove required observable parity

## Step 7: Report Findings in Priority Order

Output findings grouped as:

1. Critical
2. Major
3. Minor

For each finding, include:

- What rule is violated
- Why it matters in Moodle terms
- What the Moodle-native replacement should be

## Step 8: Always Apply The Proportionate Release Gate

Release Gate is always active. Use [release-gate-checklist.md](./release-gate-checklist.md) at the end of every Audit remediable path, Fix, Migration, Theme/UI, or claimed completion.

Report each relevant check as:

- Verified
- Not applicable
- Not verified, with reason and remaining action

Scale the gate to the change, but do not skip it. Do not claim readiness while a relevant critical upgrade, workflow, outbound URL, or service/token check remains unverified.
