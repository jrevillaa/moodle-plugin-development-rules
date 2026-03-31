# Moodle 5 Theme And UI Notes

Use this file when the task involves Moodle 5.x theme work, Boost-based UI customization, SCSS changes, template overrides, renderer changes, or Bootstrap 5 migration concerns.

## What Is Worth Preserving From Moodle 5 Theme Guidance

For Moodle 5.x visual work, these points are strong defaults:

- Treat Boost and Bootstrap 5.3 as the baseline for new theme/UI work
- Prefer SCSS, Mustache templates, renderers, and theme settings over ad hoc markup or CSS patches
- Keep cache invalidation in mind after theme, template, or SCSS changes
- Use Moodle's theme file structure and template override paths exactly

## Practical Guidance

### Bootstrap 5 Mindset

Do not suggest Bootstrap 4-era markup or utilities for Moodle 5.x work by default.

Prefer:

- `data-bs-*` attributes
- logical spacing and alignment utilities such as `.ms-*`, `.me-*`, `.text-start`, and `.text-end`
- `.visually-hidden` instead of older accessibility helper names

### Theme Structure

When the task is about a real theme plugin, prefer Moodle's theme structure:

- `config.php` for theme configuration
- `lib.php` for SCSS callbacks and theme helpers
- `settings.php` for admin-configurable theme options
- `templates/` for Mustache overrides
- `scss/` or preset flow for SCSS organization
- language strings in `lang/en/theme_<name>.php`

### SCSS Pipeline Discipline

For Moodle 5 theme work, treat SCSS in phases:

1. pre-SCSS for variable overrides
2. main preset/theme SCSS
3. extra/final SCSS for late overrides

Do not drop all visual logic into one unstructured stylesheet if the change spans variables, presets, and final overrides.

### Settings That Affect CSS

If a theme setting changes SCSS or rendered visual state, remember cache invalidation behavior. A typical safe pattern is to ensure the setting triggers a theme cache reset.

### Template Overrides

Override templates through the theme's template path using the correct component name. Do not copy random fragments into PHP output just to adjust visual structure.

## Review Heuristics

Flag the implementation if you see:

- Bootstrap 4 syntax proposed for Moodle 5.x without a compatibility reason
- Direct HTML or CSS hacks where a theme template or renderer override is the right abstraction
- Theme settings added without cache reset behavior when they affect CSS or rendered output
- Hardcoded strings or icons in templates where Moodle helpers should be used

## Remediation Language

Use wording like:

- "This Moodle 5 UI change should follow Boost and Bootstrap 5.3 conventions."
- "Move this structural UI change into a Mustache template or renderer instead of patching echoed HTML."
- "If this theme setting changes SCSS output, make sure it resets the relevant theme caches."
