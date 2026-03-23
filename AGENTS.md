# Moodle Plugin Development Rules

**Version 1.0.0**  
Independent  
March 2026

> **Note:**  
> This document is generated from the individual rule files in `rules/`.  
> It is primarily intended for agents and LLMs reviewing or generating Moodle plugin code.

---

## Abstract

Comprehensive Moodle plugin development guide for AI agents and reviewers. Covers architecture, capabilities, forms, renderers, AMD JavaScript, DB API usage, performance, upgrades, external APIs, privacy, accessibility, and testing. Findings are prioritized for audit workflows and aligned with Moodle-native implementation patterns.

---

## Rule Files

- `amd-module-loading.md` - Implement Browser Logic as AMD Modules
- `arch-helper-boundaries.md` - Keep Helpers Cohesive and Domain-Specific
- `async-scheduled-task.md` - Move Recurrent Heavy Work to Scheduled Tasks
- `compat-upgrade-path.md` - Route Persistent Changes Through Moodle Upgrades
- `data-db-api-choice.md` - Choose the Moodle DB API Based on Query Shape
- `data-paginated-tables.md` - Assume Report Tables Will Grow
- `external-class-based-api.md` - Prefer classes/external for New External APIs
- `lifecycle-file-api.md` - Use Moodle File API for Managed Files
- `lifecycle-privacy-review.md` - Review Privacy API Obligations for User Data
- `quality-accessible-labels.md` - Use Clear Labels and Accessible Actions
- `quality-get-string.md` - Move User-Facing Text to Language Strings
- `quality-testing-coverage.md` - Add Automated Coverage for Non-Trivial Behavior
- `security-capability-checks.md` - Resolve Context and Enforce Capabilities Early
- `ui-form-api.md` - Use Form API for Real Input Workflows
- `ui-moodle-url-output.md` - Use Moodle URLs and Output Helpers
- `ui-mustache-renderers.md` - Render Non-Trivial Views Through Mustache and Renderers

---

## Full Rules

### Implement Browser Logic as AMD Modules

**Impact:** HIGH (Aligns JavaScript with Moodle-native loading and modularity)

## Implement Browser Logic as AMD Modules

**Impact: HIGH (aligns JavaScript with Moodle-native loading and modularity)**

Do not require raw JavaScript files directly from PHP output for new plugin behavior. Put browser logic in `amd/src/` and load it through Moodle page requirements APIs.

Wrong:

```php
$PAGE->requires->js('/local/example/js/main.js');
```

Preferred:

```php
$PAGE->requires->js_call_amd('local_example/main', 'init', [$itemid]);
```

Why it matters:

- Moodle expects modular frontend code for maintainable plugin behavior
- AMD loading keeps browser behavior explicit and reusable
- Raw file loading encourages brittle and non-standard JS integration

Recommended remediation:

- Move the JS entrypoint to `amd/src/<module>.js`
- Expose an `init()` method
- Load it with `js_call_amd()`

Reference: [JavaScript Modules](https://moodledev.io/docs/guides/javascript/modules)

### Keep Helpers Cohesive and Domain-Specific

**Impact:** MEDIUM (Prevents generic helper dumping grounds and mixed responsibilities)

## Keep Helpers Cohesive and Domain-Specific

**Impact: MEDIUM (prevents generic helper dumping grounds and mixed responsibilities)**

Create helper classes only when they encapsulate a real reusable domain responsibility. Avoid generic utility classes that mix formatting, DB access, permissions, and rendering.

Wrong:

```php
class helper {
    public static function get_items() {}
    public static function can_edit() {}
    public static function render_table() {}
}
```

Preferred:

```php
class item_query_helper {
    public static function get_filtered_items(array $filters): array {
        // Query-focused responsibility.
    }
}
```

Why it matters:

- Generic helpers become maintenance hotspots quickly
- Mixed responsibilities hide architecture problems
- Moodle code is easier to review when responsibilities are explicit

Recommended remediation:

- Split helpers by domain responsibility
- Keep rendering, access checks, and DB queries in their proper layers
- Prefer more specific names over generic utility buckets

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Move Recurrent Heavy Work to Scheduled Tasks

**Impact:** MEDIUM (Keeps request-time flows responsive and operationally predictable)

## Move Recurrent Heavy Work to Scheduled Tasks

**Impact: MEDIUM (keeps request-time flows responsive and operationally predictable)**

Recurring maintenance, synchronization, or recalculation work should run in scheduled tasks instead of piggybacking on page requests.

Wrong:

```php
// Runs every time the page loads.
local_example_sync_all_records();
```

Preferred:

```php
namespace local_example\task;

class sync_records extends \core\task\scheduled_task {
    public function get_name() {
        return get_string('tasksyncrecords', 'local_example');
    }

    public function execute() {
        local_example_sync_all_records();
    }
}
```

Why it matters:

- Heavy recurrent work can slow pages unpredictably
- Scheduled tasks create a clearer operational boundary
- Repeated work belongs to the task subsystem, not UI entrypoints

Recommended remediation:

- Move periodic processing to a scheduled task
- Keep page requests focused on user interaction

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Route Persistent Changes Through Moodle Upgrades

**Impact:** CRITICAL (Prevents broken deployments and inconsistent schema state)

## Route Persistent Changes Through Moodle Upgrades

**Impact: CRITICAL (prevents broken deployments and inconsistent schema state)**

Schema changes, new capabilities, and persistent configuration evolution should go through Moodle's upgrade path rather than ad hoc runtime fixes.

Wrong:

```php
if (!$DB->get_manager()->field_exists($table, $field)) {
    $DB->get_manager()->add_field($table, $field);
}
```

Preferred:

```php
function xmldb_local_example_upgrade($oldversion) {
    global $DB;

    $dbman = $DB->get_manager();

    if ($oldversion < 2026032300) {
        $table = new xmldb_table('local_example_items');
        $field = new xmldb_field('status', XMLDB_TYPE_CHAR, '20', null, null, null, 'draft');

        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        upgrade_plugin_savepoint(true, 2026032300, 'local', 'example');
    }

    return true;
}
```

Why it matters:

- Runtime schema mutation is brittle and hard to reason about
- Moodle expects persistent changes to be versioned and repeatable
- Upgrade paths must be deterministic across environments

Recommended remediation:

- Put schema evolution in `db/upgrade.php`
- Update `version.php` when needed
- Review install XML and capabilities alongside structural changes

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Choose the Moodle DB API Based on Query Shape

**Impact:** HIGH (Improves correctness, readability, and scalability of data access)

## Choose the Moodle DB API Based on Query Shape

**Impact: HIGH (improves correctness, readability, and scalability of data access)**

Do not default blindly to either simple record helpers or SQL-based helpers. Choose the Moodle DB API that matches the access pattern.

Wrong:

```php
$records = $DB->get_records('user', null, 'lastname ASC');
```

Preferred:

```php
$records = $DB->get_records('user', ['deleted' => 0], 'lastname ASC', 'id, firstname, lastname');
```

Wrong:

```php
$records = $DB->get_records('local_example_items');
```

Preferred:

```php
$records = $DB->get_records_sql(
    "SELECT i.id, i.name, c.fullname
       FROM {local_example_items} i
       JOIN {course} c ON c.id = i.courseid
   ORDER BY c.fullname ASC, i.name ASC",
    []
);
```

Why it matters:

- Single-table simple reads are clearer with focused helper methods
- Joins, pagination, and aggregation usually require SQL-based APIs
- Good DB API choice improves both readability and performance

Recommended remediation:

- Use `get_record()` and `get_records()` for simple access
- Use `get_record_sql()` and `get_records_sql()` for complex query shapes
- Fetch only the fields the screen or action needs

Reference: [DML API](https://moodledev.io/docs/apis/core/dml)

### Assume Report Tables Will Grow

**Impact:** HIGH (Prevents scalability and usability issues on report-style screens)

## Assume Report Tables Will Grow

**Impact: HIGH (prevents scalability and usability issues on report-style screens)**

If a screen displays tabular or report-style data, assume the dataset may exceed a small bounded size. Pagination, sorting, and filtering should be baseline functionality, not a later patch.

Wrong:

```php
$records = $DB->get_records('local_example_log');
foreach ($records as $record) {
    echo html_writer::div(s($record->message));
}
```

Preferred:

```php
$perpage = 25;
$page = optional_param('page', 0, PARAM_INT);
$offset = $page * $perpage;

$records = $DB->get_records_sql(
    "SELECT id, message, timecreated
       FROM {local_example_log}
   ORDER BY timecreated DESC",
    [],
    $offset,
    $perpage
);
```

Why it matters:

- Report plugins often grow beyond initial assumptions
- Full-record loading harms performance and usability
- Pagination and sorting should be designed into the query shape

Recommended remediation:

- Validate paging, filter, and sort inputs
- Use the right DB API for the query shape
- Render through table-friendly Moodle patterns

Reference: [DML API](https://moodledev.io/docs/apis/core/dml)

### Prefer classes/external for New External APIs

**Impact:** MEDIUM-HIGH (Improves structure, compatibility clarity, and maintainability)

## Prefer classes/external for New External APIs

**Impact: MEDIUM-HIGH (improves structure, compatibility clarity, and maintainability)**

When the supported Moodle version allows it, implement new web services in `classes/external/` instead of defaulting to legacy `externallib.php`.

Wrong:

```php
function local_example_get_items() {
    global $DB;
    return $DB->get_records('local_example_items');
}
```

Preferred:

```php
namespace local_example\external;

class get_items extends \external_api {
    public static function execute() {
        global $DB;
        return $DB->get_records('local_example_items');
    }
}
```

Why it matters:

- New external APIs should follow the modern namespaced structure when supported
- External transport code should be separated from broader plugin logic
- Class-based structure makes validation and return contracts easier to maintain

Recommended remediation:

- Place new external classes under `classes/external/`
- Keep parameter validation, access control, and return structure explicit
- Reuse domain logic instead of embedding it all in the external method

Reference: [External API](https://moodledev.io/docs/apis/subsystems/external)

### Use Moodle File API for Managed Files

**Impact:** MEDIUM (Prevents brittle file handling and permission mistakes)

## Use Moodle File API for Managed Files

**Impact: MEDIUM (prevents brittle file handling and permission mistakes)**

Managed files should use Moodle File API and its lifecycle patterns instead of custom file handling assumptions.

Wrong:

```php
move_uploaded_file($_FILES['attachment']['tmp_name'], '/tmp/example.txt');
```

Preferred:

```php
$draftitemid = file_get_submitted_draft_itemid('attachment');
file_save_draft_area_files(
    $draftitemid,
    $context->id,
    'local_example',
    'attachment',
    $itemid,
    ['subdirs' => 0]
);
```

Why it matters:

- File lifecycle in Moodle is context-aware and permission-sensitive
- Custom file handling bypasses expected draft and storage flows
- File API reduces portability and access-control mistakes

Recommended remediation:

- Use draft item flows and named file areas
- Align file access with context and capability rules

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Review Privacy API Obligations for User Data

**Impact:** MEDIUM (Prevents hidden personal-data liabilities in plugin features)

## Review Privacy API Obligations for User Data

**Impact: MEDIUM (prevents hidden personal-data liabilities in plugin features)**

Whenever a plugin stores or exports data tied to users, review whether the feature creates Privacy API obligations.

Wrong:

```php
$record = (object)[
    'userid' => $USER->id,
    'notes' => $notes,
];
$DB->insert_record('local_example_notes', $record);
```

Preferred:

```php
// Store the data intentionally and review whether the plugin needs
// privacy metadata, export, or deletion support for these records.
$record = (object)[
    'userid' => $USER->id,
    'notes' => $notes,
];
$DB->insert_record('local_example_notes', $record);
```

Why it matters:

- User-linked data may trigger export and deletion responsibilities
- Privacy obligations are easy to overlook during feature development
- The review should happen when the feature is introduced, not later

Recommended remediation:

- Audit whether the feature stores personal data
- Review the relevant Privacy API requirements for the plugin type
- Do not assume user-linked data is operationally trivial

Reference: [Privacy API](https://moodledev.io/docs/apis/subsystems/privacy)

### Use Clear Labels and Accessible Actions

**Impact:** MEDIUM (Improves accessibility and UI clarity for Moodle users)

## Use Clear Labels and Accessible Actions

**Impact: MEDIUM (improves accessibility and UI clarity for Moodle users)**

Form controls, action links, and icon-driven UI should expose clear accessible meaning.

Wrong:

```php
echo '<a href="' . $url . '"><i class="icon fa fa-edit"></i></a>';
```

Preferred:

```php
echo $OUTPUT->action_icon(
    $url,
    new pix_icon('t/edit', get_string('edit'))
);
```

Why it matters:

- Icon-only actions can be ambiguous or inaccessible
- Clear action text and labels improve usability for all users
- Moodle output helpers often provide better semantics than raw markup

Recommended remediation:

- Prefer output helpers with accessible labels
- Make sure action meaning is explicit in strings or accessible text

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Move User-Facing Text to Language Strings

**Impact:** MEDIUM (Improves translation support and consistency)

## Move User-Facing Text to Language Strings

**Impact: MEDIUM (improves translation support and consistency)**

Do not hardcode user-facing text in PHP, templates, or UI setup when it belongs in the language pack.

Wrong:

```php
$PAGE->set_title('Manage items');
echo html_writer::tag('button', 'Save');
```

Preferred:

```php
$PAGE->set_title(get_string('manageitems', 'local_example'));
echo html_writer::tag('button', get_string('savechanges'));
```

Why it matters:

- Hardcoded text weakens translation support
- Language strings improve consistency across Moodle UI
- String identifiers make future maintenance easier

Recommended remediation:

- Move labels, headings, buttons, and notifications to the language pack
- Use `get_string()` consistently for user-facing text

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Add Automated Coverage for Non-Trivial Behavior

**Impact:** MEDIUM (Reduces regressions in capability-sensitive and data-heavy features)

## Add Automated Coverage for Non-Trivial Behavior

**Impact: MEDIUM (reduces regressions in capability-sensitive and data-heavy features)**

Non-trivial plugin behavior should be backed by PHPUnit or Behat coverage depending on the risk surface.

Wrong:

```php
// Complex feature added with no automated tests.
```

Preferred:

```php
// Add PHPUnit coverage for domain logic and Behat coverage when the
// workflow spans UI, permissions, or rendered behavior.
```

Why it matters:

- Capability-sensitive and report-like features are easy to regress
- Automated coverage increases confidence in refactors and upgrades
- The right test type depends on the behavior under change

Recommended remediation:

- Use PHPUnit for domain logic and data behavior
- Use Behat for UI and workflow-sensitive behavior
- Add tests as part of the change, not as optional follow-up

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Resolve Context and Enforce Capabilities Early

**Impact:** CRITICAL (Prevents unauthorized access and insecure server-side actions)

## Resolve Context and Enforce Capabilities Early

**Impact: CRITICAL (prevents unauthorized access and insecure server-side actions)**

Resolve the correct Moodle context before processing a page, action, export, AJAX request, or external function. UI visibility is never a substitute for server-side authorization.

Wrong:

```php
$id = required_param('id', PARAM_INT);
$record = $DB->get_record('local_example_items', ['id' => $id], '*', MUST_EXIST);

if (optional_param('delete', 0, PARAM_BOOL)) {
    $DB->delete_records('local_example_items', ['id' => $id]);
}
```

Preferred:

```php
$id = required_param('id', PARAM_INT);
$record = $DB->get_record('local_example_items', ['id' => $id], '*', MUST_EXIST);
$context = context_system::instance();

require_login();
require_capability('local/example:manage', $context);

if (optional_param('delete', 0, PARAM_BOOL)) {
    require_sesskey();
    $DB->delete_records('local_example_items', ['id' => $id]);
}
```

Why it matters:

- Capabilities are mandatory framework boundaries in Moodle
- State-changing actions must be protected server-side
- The correct context determines who is actually allowed to act

Recommended remediation:

- Resolve the target context first
- Require login where appropriate
- Enforce the capability before processing the action
- Add sesskey validation for state-changing requests

Reference: [Access API](https://moodledev.io/docs/apis/subsystems/access)

### Use Form API for Real Input Workflows

**Impact:** HIGH (Improves validation, maintainability, and Moodle-native behavior)

## Use Form API for Real Input Workflows

**Impact: HIGH (improves validation, maintainability, and Moodle-native behavior)**

When a feature collects user input, use `moodleform` instead of building `<form>` markup manually in PHP.

Wrong:

```php
echo '<form method="post">';
echo '<input type="text" name="name" />';
echo '<button type="submit">Save</button>';
echo '</form>';
```

Preferred:

```php
class item_form extends moodleform {
    public function definition() {
        $mform = $this->_form;
        $mform->addElement('text', 'name', get_string('name', 'local_example'));
        $mform->setType('name', PARAM_TEXT);
        $this->add_action_buttons();
    }
}
```

Why it matters:

- Form API centralizes validation, defaults, and submission handling
- It aligns forms with Moodle expectations and reduces ad hoc processing
- It avoids fragile echoed HTML and duplicated token logic

Recommended remediation:

- Move the form to a `moodleform` subclass
- Define elements in `definition()`
- Handle submitted data through the form object

Reference: [Form API](https://moodledev.io/docs/apis/subsystems/form)

### Use Moodle URLs and Output Helpers

**Impact:** MEDIUM (Improves output safety and keeps navigation code Moodle-native)

## Use Moodle URLs and Output Helpers

**Impact: MEDIUM (improves output safety and keeps navigation code Moodle-native)**

Do not build internal URLs or action markup by hand when Moodle provides URL and output helpers.

Wrong:

```php
$url = '/local/example/view.php?id=' . $id;
echo '<a href="' . $url . '">Open</a>';
```

Preferred:

```php
$url = new moodle_url('/local/example/view.php', ['id' => $id]);
echo html_writer::link($url, get_string('open', 'local_example'));
```

Why it matters:

- Moodle helpers reduce brittle string concatenation
- URL generation becomes safer and more maintainable
- Output helpers align actions with Moodle conventions

Recommended remediation:

- Build internal routes with `moodle_url`
- Use output helpers and renderer methods for actions and UI fragments

Reference: [Moodle Developer Documentation](https://moodledev.io)

### Render Non-Trivial Views Through Mustache and Renderers

**Impact:** HIGH (Improves separation of concerns and Moodle-native UI structure)

## Render Non-Trivial Views Through Mustache and Renderers

**Impact: HIGH (improves separation of concerns and Moodle-native UI structure)**

Do not concatenate substantial view markup directly in PHP. Prepare data in PHP and render non-trivial UI through Mustache and renderer or output classes.

Wrong:

```php
echo '<div class="card">';
echo '<h3>' . format_string($item->name) . '</h3>';
echo '<p>' . s($item->description) . '</p>';
echo '</div>';
```

Preferred:

```php
$data = [
    'name' => format_string($item->name),
    'description' => format_text($item->description, FORMAT_HTML),
];

echo $OUTPUT->render_from_template('local_example/item_card', $data);
```

Why it matters:

- Rendering logic should not be mixed with data access and control flow
- Mustache templates make non-trivial UI more maintainable and reusable
- Renderer flow fits Moodle's output conventions

Recommended remediation:

- Prepare template data in PHP
- Move markup to a Mustache template
- Use renderers or output classes for reusable view flows

Reference: [Templates Guide](https://moodledev.io/docs/guides/templates)

## References

- https://moodledev.io
- https://moodledev.io/docs/apis/core/dml
- https://moodledev.io/docs/apis/subsystems/form
- https://moodledev.io/docs/guides/templates
- https://moodledev.io/docs/guides/javascript/modules
- https://moodledev.io/docs/apis/subsystems/access
- https://moodledev.io/docs/apis/subsystems/external
- https://moodledev.io/docs/apis/subsystems/privacy

