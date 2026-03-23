---
title: Use Form API for Real Input Workflows
impact: HIGH
impactDescription: Improves validation, maintainability, and Moodle-native behavior
tags: moodle, form, moodleform, ui
---

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
