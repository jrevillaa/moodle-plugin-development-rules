---
title: Implement Browser Logic as AMD Modules
impact: HIGH
impactDescription: Aligns JavaScript with Moodle-native loading and modularity
tags: moodle, amd, javascript, frontend
---

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
