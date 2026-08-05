---
title: Build Moodle 5.x UI On Boost And Bootstrap 5.3
impact: HIGH
impactDescription: Keeps theme and frontend work compatible with Moodle 5.x rendering and styling expectations
tags: moodle, moodle5, theme, boost, bootstrap, scss, mustache, ui
---

## Build Moodle 5.x UI On Boost And Bootstrap 5.3

**Impact: HIGH (keeps theme and frontend work compatible with Moodle 5.x rendering and styling expectations)**

For Moodle 5.x theme and UI work, treat Boost and Bootstrap 5.3 as the default baseline. Prefer SCSS, Mustache overrides, renderers, and theme settings over Bootstrap 4 markup, ad hoc CSS patches, or echoed HTML structure changes.

Wrong:

```html
<button class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
    Open
</button>
<div class="text-left ml-3 hidden">Legacy layout helpers</div>
```

Preferred:

```html
<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
    {{#str}} open, local_example {{/str}}
</button>
<div class="text-start ms-3 visually-hidden">{{#str}} helpertext, local_example {{/str}}</div>
```

Why it matters:

- Moodle 5.x UI is Boost- and Bootstrap 5.3-centered
- Bootstrap 4 attributes and utilities create broken or inconsistent interfaces
- Theme structure, SCSS phases, and template overrides are the maintainable extension points
- Theme settings that change SCSS must reset theme caches or visual updates will not appear

Recommended remediation:

- Use `data-bs-*` attributes and Bootstrap 5 spacing/alignment utilities
- Put structural UI changes in Mustache templates or renderers, not PHP string concatenation
- Organize theme SCSS through pre/main/extra phases and Moodle theme file layout
- Reset theme caches when settings affect generated CSS
- Confirm the target branch is Moodle 5.x before assuming Bootstrap 5 defaults

Reference: [Themes](https://moodledev.io/docs/guides/themes)
