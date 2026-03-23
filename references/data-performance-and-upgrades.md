# Data Performance And Upgrades

## Design For Large Result Sets

Assume list screens may exceed 25 records unless the domain guarantees otherwise. Build list UIs and queries to scale from the beginning.

Prefer:

- Pagination
- Sortable columns
- Filter inputs
- Narrow `SELECT` lists
- Stable ordering
- Count queries only when needed

Avoid:

- Loading the full dataset into memory for display pages
- Rendering giant HTML tables without paging
- Sorting in PHP when the database should do it
- Export logic that reuses an inefficient screen query unchanged

## Prefer Moodle Table Patterns

When the feature displays tabular data, use Moodle-native table patterns or structures that support pagination, sorting, and filtering cleanly.

If the table is likely to grow, treat pagination and sorting as baseline functionality, not future enhancement.

## Use Moodle DB APIs

Use Moodle database abstractions consistently. Keep SQL explicit, safe, and aligned with Moodle conventions.

Prefer:

- Parameterized queries
- Focused repository/query helper methods when reused
- Small transformation layers between record fetch and render/export

Avoid:

- Repeated copy-pasted SQL across page scripts
- Query construction hidden inside rendering code
- Fetching broad record objects when only a few fields are needed

## Choose Between Simple DB Methods And SQL Methods Intentionally

Do not default blindly to either `get_records()` or `get_records_sql()`. Choose based on the real query shape.

Prefer simpler methods such as `get_record()`, `get_records()`, `record_exists()`, or related focused APIs when:

- Reading from a single table
- Filtering by straightforward conditions
- No joins, aggregates, custom ordering, or pagination are needed
- The simpler API expresses the intent clearly and efficiently

Prefer SQL-based methods such as `get_record_sql()`, `get_records_sql()`, `count_records_sql()`, or similar when:

- Joining multiple tables
- Applying custom sorting or grouped logic
- Implementing pagination
- Computing aggregates
- Selecting only the needed subset more efficiently than broad record fetches

The rule is not "always use SQL" or "never use SQL". The rule is "use the most expressive and efficient Moodle DB API for the access pattern."

Review the likely data volume before choosing. A query that is acceptable with `get_records()` for a tiny bounded dataset may need SQL-based pagination and sorting for a real list screen.

## Exports Must Use Moodle-Native Libraries

When exporting data, use native Moodle facilities or standard libraries already adopted by the platform or project. Do not introduce ad hoc CSV, spreadsheet, or document generation if Moodle already provides the correct path.

An export implementation should:

- Reuse access checks
- Reuse validated filters
- Handle large datasets predictably
- Stream or batch when appropriate
- Use user-facing strings from the language pack

## Check Moodle Version Compatibility

Verify the target Moodle version before choosing APIs, folder layout, hooks, or language features. Do not assume a current-core pattern is valid on an older supported version.

Before implementing a version-sensitive change:

1. Identify the supported Moodle baseline for the plugin.
2. Confirm whether the intended API exists on that baseline.
3. Choose the newest valid structure the supported baseline allows.

This matters especially for:

- Hooks and callback availability
- External API structure
- Output APIs
- Privacy APIs
- JavaScript loading conventions
- Upgrade behavior

## Upgrades And Installation Changes

When schema or persistent configuration changes are required, use Moodle's upgrade mechanisms rather than one-off runtime fixes.

Review whether the change needs:

- `version.php` update
- `db/install.xml` changes
- `db/upgrade.php` steps
- Capability definitions or updates
- Language string additions

## Review Heuristics

Flag the implementation if you see:

- Screen code assuming all records can be loaded at once
- No paging or sorting on a table likely to grow
- A simplistic DB method used for a query shape that clearly needs SQL-based retrieval
- Export code bypassing validated filters or capability checks
- Version-sensitive structure chosen without checking supported Moodle version
- Schema changes implemented outside upgrade mechanisms

## Remediation Language

Use wording like:

- "Assume this table will grow; add pagination, sorting, and filters now."
- "Use the DB API that matches the query shape; this case likely needs `get_records_sql()` or related SQL-based retrieval."
- "Use Moodle-native export facilities instead of custom file generation."
- "Confirm the plugin's supported Moodle version before adopting this API or file layout."
- "Move schema evolution into Moodle's upgrade path."
