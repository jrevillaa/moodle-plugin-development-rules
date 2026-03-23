# Accessibility And I18n

## Accessibility

Treat accessibility as part of correctness for Moodle UI.

Prefer:

- Clear labels for form controls
- Correct table semantics when rendering data tables
- Meaningful action text and icon usage
- Keyboard-friendly flows
- Output structures that remain understandable to assistive technologies

Avoid:

- Clickable elements with unclear text
- Icon-only actions without accessible meaning
- Tables used for layout
- Form controls with weak or missing labels

## Internationalization

Use language strings consistently and keep them translatable.

Prefer:

- `get_string()` for all user-facing text
- Placeholder-based strings when values vary
- Consistent string identifiers
- Proper string usage for JS-initialized UI when Moodle expects strings to be supplied

Avoid:

- Hardcoded concatenated text that becomes hard to translate
- Embedding language directly in templates or JS when it belongs in the language pack
- Unclear abbreviations in strings that translators cannot interpret well

## Review Heuristics

Flag the implementation if you see:

- User-facing text outside the language pack
- Form controls or actions with weak labeling
- Tables or views that likely produce poor accessibility semantics
- JS-driven UI without a clear string strategy

## Remediation Language

Use wording like:

- "Move this user-facing text to the language pack."
- "Add an accessible label or clearer action text here."
- "Use a translatable placeholder-based string instead of hardcoded concatenation."
