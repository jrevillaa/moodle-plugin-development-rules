---
title: Set Up Admin Pages And Visible Breadcrumbs Correctly
impact: HIGH
impactDescription: Keeps Site administration navigation working and always orients users with a real breadcrumb path
tags: moodle, ui, admin, navigation, breadcrumbs, navbar, settings
---

## Set Up Admin Pages And Visible Breadcrumbs Correctly

**Impact: HIGH (keeps Site administration navigation working and always orients users with a real breadcrumb path)**

Decide whether a page is Site-administration-only or also reachable by other roles. Admin-only screens must register an `admin_externalpage` and call `admin_externalpage_setup()`. Every page—admin or shared—must show breadcrumbs that reflect the real navigation path. Non-admin roles will not see Site administration tabs; breadcrumbs are their orientation.

Wrong:

```php
// Admin tool page with no externalpage registration/setup and no navbar path.
require(__DIR__ . '/../../config.php');
require_login();
$context = context_system::instance();
require_capability('local/example:manage', $context);

$PAGE->set_context($context);
$PAGE->set_url(new moodle_url('/local/example/manage.php'));
$PAGE->set_title(get_string('manage', 'local_example'));

echo $OUTPUT->header();
// Content...
echo $OUTPUT->footer();
```

Preferred:

```php
// settings.php — Site administration registration
$ADMIN->add(
    'localplugins',
    new admin_externalpage(
        'local_example_manage',
        get_string('manage', 'local_example'),
        new moodle_url('/local/example/manage.php'),
        'local/example:manage'
    )
);

// manage.php — admin-only page
require(__DIR__ . '/../../config.php');
require_once($CFG->libdir . '/adminlib.php');
admin_externalpage_setup('local_example_manage');

echo $OUTPUT->header();
// Content...
echo $OUTPUT->footer();

// report.php — shared page other roles can open
$courseid = required_param('courseid', PARAM_INT);
$course = get_course($courseid);
$context = context_course::instance($course->id);

require_login($course);
require_capability('local/example:view', $context);

$url = new moodle_url('/local/example/report.php', ['courseid' => $course->id]);
$PAGE->set_url($url);
$PAGE->set_context($context);
$PAGE->set_pagelayout('report');
$PAGE->set_title(get_string('report', 'local_example'));
$PAGE->set_heading(format_string($course->fullname));

// Non-admins will not see Site administration tabs. Breadcrumbs must still show the real path.
$PAGE->navbar->add(get_string('report', 'local_example'), $url);

echo $OUTPUT->header();
// Content...
echo $OUTPUT->footer();
```

Why it matters:

- `admin_externalpage_setup()` wires the page into the admin tree so Site administration navigation, active section, and admin breadcrumbs work
- Registration URL and `$PAGE->set_url()` must match the canonical page URL or the admin breadcrumb never activates
- Managers, teachers, and other roles do not see Site administration tabs; without visible breadcrumbs they lose the path back to the parent context
- Breadcrumbs are part of Moodle orientation, not an optional decoration

Recommended remediation:

- For admin-only screens: add `admin_externalpage` in `settings.php`, call `admin_externalpage_setup($pagename)` early, then use normal `$OUTPUT->header()` / `footer()`
- Prefer standard `admin_settingpage` settings when the screen is only config fields in `config_plugins`; use `admin_externalpage` for custom operational screens
- For shared or course-scoped screens: do not pretend they are Site administration pages; set context/layout/URL and build `$PAGE->navbar` (or navigation nodes) with the real parent path
- Keep breadcrumbs visible and accurate for every role that can open the page
- Never rely on admin secondary navigation to orient users who cannot see it

Reference: [Admin settings](https://moodledev.io/docs/apis/subsystems/admin), [Navigation API](https://moodledev.io/docs/apis/core/navigation)
