---
title: Keep Page Entrypoints Thin And Delegate Domain Work
impact: HIGH
impactDescription: Prevents fat page scripts that mix routing, access, queries, mutation, and markup
tags: moodle, architecture, controller, page, separation, maintainability
---

## Keep Page Entrypoints Thin And Delegate Domain Work

**Impact: HIGH (prevents fat page scripts that mix routing, access, queries, mutation, and markup)**

A Moodle page script should set up the request and delegate. Keep parameter reading, page/context setup, access checks, and output orchestration in the entrypoint, and move queries, mutations, and business rules into plugin classes.

Wrong:

```php
require(__DIR__ . '/../../config.php');

$action = optional_param('action', '', PARAM_ALPHA);
$context = context_system::instance();
require_login();

if ($action === 'delete') {
    $ids = required_param_array('ids', PARAM_INT);
    foreach ($ids as $id) {
        $record = $DB->get_record('local_example_items', ['id' => $id]);
        if ($record && $record->status != 3) {
            $DB->delete_records('local_example_files', ['itemid' => $id]);
            $DB->set_field('local_example_items', 'status', 3, ['id' => $id]);
            echo '<div class="alert">Deleted ' . $record->name . '</div>';
        }
    }
}
```

Preferred:

```php
require(__DIR__ . '/../../config.php');

$action = optional_param('action', '', PARAM_ALPHA);
$context = context_system::instance();

require_login();
require_capability('local/example:manage', $context);

$manager = new \local_example\item_manager();

if ($action === 'delete') {
    require_sesskey();
    $result = $manager->delete_items(required_param_array('ids', PARAM_INT));
    redirect($returnurl, get_string('itemsdeleted', 'local_example', $result->count));
}

echo $OUTPUT->header();
echo $renderer->render($manager->get_list_view($filters));
echo $OUTPUT->footer();
```

Why it matters:

- Fat entrypoints hide the real access boundary and the real domain rules
- Logic trapped in a page script cannot be reused by tasks, external functions, or CLI
- Mixed concerns make the page untestable with PHPUnit

Recommended remediation:

- Keep `required_param()`, context, capability, sesskey, and redirect/output flow in the entrypoint
- Move queries, writes, and business rules into `classes/`
- Reuse the same domain operation from pages, tasks, and external functions
- Render through a renderer and Mustache instead of echoing markup mid-logic

Reference: [Moodle Developer Documentation](https://moodledev.io)
