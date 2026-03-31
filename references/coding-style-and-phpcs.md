# Coding Style And PHPCS

Use this file when the task involves PHP formatting, naming consistency, docblocks, or code-style review in a Moodle plugin.

## Priority Rule

Moodle coding style is the authority, not generic PSR-12.

Generic style guidance can help as a fallback, but when there is any conflict, prefer:

- Moodle coding style
- Moodle naming conventions
- Moodle file layout and callback shapes
- `moodle-cs` or Moodle-targeted PHPCS verification

Do not tell the agent to "make it PSR-12 compliant" if that would pull the code away from Moodle-native style.

## What Is Worth Reusing From PSR-Style Guidance

These ideas are still useful when filtered through Moodle:

- consistent indentation and spacing
- readable line breaking for long statements
- one clear responsibility per class or function
- consistent naming
- docblocks where they add contract clarity
- automated verification with PHPCS

## Moodle-Specific Style Defaults

When reviewing or generating PHP for Moodle, pay attention to:

- function and method naming that matches Moodle conventions for the target surface
- frankenstyle component naming where applicable
- callback names and file placement that Moodle expects
- readable multiline SQL and parameter arrays
- avoiding style-only refactors that create noisy diffs with no functional value

## PHPCS Guidance

When style verification matters, prefer Moodle-targeted checks over generic PSR standards.

Useful direction:

- run Moodle-oriented PHPCS checks when available
- use style tools to verify, not to blindly rewrite architecture
- fix real naming, indentation, and readability issues
- avoid formatting churn in unrelated code

If a repository already has a coding-standard setup, follow that local configuration first.

## Review Heuristics

Flag the implementation if you see:

- generic PSR-12 advice presented as if it overrides Moodle
- naming that ignores Moodle or frankenstyle expectations
- style tools suggested without regard to the project's configured standard
- large formatting-only rewrites mixed into functional changes

## Remediation Language

Use wording like:

- "Prefer Moodle coding style here rather than generic PSR-12 wording."
- "Verify this with the repository's Moodle-targeted PHPCS setup if available."
- "Fix the real naming and readability problems, but avoid broad formatting churn."
