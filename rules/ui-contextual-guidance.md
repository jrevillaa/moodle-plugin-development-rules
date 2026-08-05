---
title: Explain Operational Views Filters And Icon Actions In Context
impact: MEDIUM
impactDescription: Prevents users from guessing what a view, field, or compact action actually does
tags: moodle, ui, forms, help, accessibility, admin
---

## Explain Operational Views Filters And Icon Actions In Context

**Impact: MEDIUM (prevents users from guessing what a view, field, or compact action actually does)**

Operational views should include only the context needed to act correctly: a short lead explaining the view, field-level help for ambiguous filters, and accessible labels or a compact legend for icon actions. Avoid both unexplained controls and large informational walls.

Wrong:

```php
$mform->addElement('date_selector', 'fromdate', get_string('from'));
$mform->addElement('date_selector', 'todate', get_string('to'));
echo '<a href="' . $runurl . '"><i class="fa fa-play"></i></a>';
```

Preferred:

```php
$mform->addElement('date_selector', 'fromdate', get_string('coursestartfrom', 'local_example'));
$mform->addHelpButton('fromdate', 'coursestartfrom', 'local_example');

$mform->addElement('date_selector', 'todate', get_string('coursestartto', 'local_example'));
$mform->addHelpButton('todate', 'coursestartto', 'local_example');

echo $OUTPUT->action_icon(
    $runurl,
    new pix_icon('t/play', get_string('runrowtask', 'local_example', $record->name))
);
```

Why it matters:

- “From” and “To” do not reveal whether a filter uses creation time, `course.startdate`, or another field
- Icon-only controls can be ambiguous even when visually familiar
- Long inline explanations hide the actionable content they are meant to clarify

Recommended remediation:

- Add a translated lead of at most one or two short sentences on operational views
- Use Form API labels and `addHelpButton()` for field-specific meaning, boundaries, and exclusions
- Use Moodle output helpers with meaningful accessible labels for icons
- Add a compact legend only when several repeated symbols or states need decoding
- Put secondary detail in a collapsible `<details>` section or help popup, not in the primary flow
- State important exclusions explicitly, such as `SITEID`, `startdate = 0`, or inclusive date bounds

Reference: [Form API](https://moodledev.io/docs/apis/subsystems/form)
