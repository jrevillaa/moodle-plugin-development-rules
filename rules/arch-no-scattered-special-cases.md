---
title: Do Not Scatter Special Cases Across Shared Moodle Flows
impact: HIGH
impactDescription: Prevents spaghetti growth from ad hoc branches bolted into unrelated code paths
tags: moodle, spaghetti, conditionals, architecture, maintainability
---

## Do Not Scatter Special Cases Across Shared Moodle Flows

**Impact: HIGH (prevents spaghetti growth from ad hoc branches bolted into unrelated code paths)**

When a new requirement needs different behavior, do not sprinkle plugin-specific or mode-specific `if` checks through shared functions, renderers, tasks, and callbacks. Give the variation one owner: a dedicated class, a typed dispatch map, or a distinct method.

Wrong:

```php
function local_example_render_row($record, $mode = null, $isexport = false, $legacy = false) {
    if ($mode === 'seed' && !$legacy) {
        $label = get_string('seedrow', 'local_example');
    } else if ($isexport && $mode !== 'seed') {
        $label = $record->name;
    } else if ($legacy) {
        $label = $record->oldname ?? $record->name;
    } else {
        $label = format_string($record->name);
    }

    return $label;
}
```

Preferred:

```php
// One owner per behavior, selected explicitly.
$formatters = [
    'seed' => new \local_example\output\seed_row_formatter(),
    'export' => new \local_example\output\export_row_formatter(),
    'view' => new \local_example\output\view_row_formatter(),
];

$label = $formatters[$rowtype]->format($record);
```

Why it matters:

- Boolean and mode flags multiply until every caller must understand every branch
- Scattered special cases make Moodle callbacks, renderers, and tasks drift apart
- Each new case increases the risk of changing behavior for unrelated entrypoints

Recommended remediation:

- Replace flag parameters with explicit, named behaviors
- Dispatch on a documented type instead of chaining conditionals
- Keep shared Moodle functions generic and push variation to the caller's own class
- If a temporary branch is unavoidable, document why and when it is removed

Reference: [Moodle Developer Documentation](https://moodledev.io)
