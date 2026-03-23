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

If any of these fail, classify the finding early as likely `Critical`.

## Step 3: Inspect Moodle-Native UI Patterns

Check whether:

- Real forms use Form API
- Non-trivial views use Mustache and renderers
- Browser logic is implemented through AMD modules
- User-facing strings use `get_string()`

These are usually `Major` when the code works but ignores Moodle-native structure.

## Step 4: Inspect Data and Scalability

Check whether:

- Report screens assume small datasets
- Pagination, sorting, and filtering are in place where needed
- DB API choice matches query shape
- Exports reuse validated filters and access checks

## Step 5: Inspect Lifecycle and Integration

Review:

- External API placement and contracts
- Tasks, observers, and cache boundaries
- Privacy implications
- File handling
- Backup/restore implications where relevant

## Step 6: Inspect Quality and Maintenance Signals

Check whether:

- Names are explicit
- Helpers are cohesive
- Accessibility basics are respected
- There is automated test coverage for non-trivial behavior

## Step 7: Report Findings in Priority Order

Output findings grouped as:

1. Critical
2. Major
3. Minor

For each finding, include:

- What rule is violated
- Why it matters in Moodle terms
- What the Moodle-native replacement should be
