# PHP Best Practices For Moodle Plugins

Use this file when a Moodle plugin task is heavily about PHP quality, typing, code organization, exceptions, or modern language features.

## Priority Rule

Moodle is the primary authority. General PHP best practices are useful only when they fit:

- The supported PHP versions for the target Moodle branch
- Moodle coding style and established core conventions
- Moodle subsystem APIs such as Access, DML, Forms, Files, Output, and External
- The local plugin's compatibility constraints

If a generic PHP recommendation conflicts with Moodle, prefer Moodle.

## Version Discipline First

Before recommending PHP syntax or refactors, check the target Moodle branch and the PHP versions it supports.

Use this rule especially before suggesting:

- Constructor property promotion
- Union or intersection types
- `match`
- `readonly`
- Enums
- Attributes
- `#[\Override]`
- Any other newer PHP syntax

Do not modernize code to a PHP feature just because it exists. Confirm that the plugin's supported Moodle version and branch can safely use it.

## Feature Triage

Use this table as a quick default when reviewing or generating Moodle plugin PHP.

### Safe To Suggest When Supported

- Scalar parameter and return types
- Property types
- Nullable types
- Small responsibility-focused refactors
- Specific exceptions instead of generic catch-all handling
- `match` where it clearly replaces a noisy `switch`

### Suggest With Caution

- Constructor property promotion
- Union types on public or cross-layer contracts
- `readonly`
- Attributes
- More aggressive exception hierarchies
- Service extraction done mainly for design cleanliness

These can be good, but only if the target Moodle branch supports them and the surrounding codebase already trends in that direction.

### Avoid By Default

- Enums without first confirming supported PHP versions and plugin branch expectations
- `#[\Override]` and other very recent syntax without explicit compatibility confirmation
- Forcing PSR-12 formatting on Moodle-style code
- Introducing interfaces, repositories, or factories with no real substitution need
- Replacing Moodle globals and subsystem entrypoints with framework-agnostic abstractions just for architectural purity

## Good PHP Practices That Usually Help In Moodle

These patterns generally improve Moodle plugin code when they do not conflict with version support or local conventions:

- Add clear parameter, property, and return types where the target version supports them and the contract is stable.
- Keep classes and functions focused on one responsibility.
- Prefer explicit names over vague names like `helper`, `process`, or `data`.
- Catch specific exceptions when exception handling is appropriate.
- Avoid suppressing errors with `@`.
- Keep side effects, access checks, data access, and rendering separated.
- Prefer small, testable units for non-trivial domain logic.

## Moodle-Specific Overrides To Generic PHP Advice

### Prefer Moodle APIs Over Raw PHP Utilities

Generic PHP advice often suggests direct language or library primitives. In Moodle plugins, prefer Moodle abstractions when they exist.

Prefer:

- `required_param()`, `optional_param()`, and `PARAM_*` over raw `$_GET` and `$_POST`
- `$DB` DML methods over hand-rolled SQL interpolation
- `moodle_url`, `html_writer`, renderers, and Mustache over manual HTML concatenation
- `get_string()` over hardcoded text
- File API over direct upload or filesystem handling
- Access API and `require_capability()` over custom authorization logic

### Prefer Moodle Coding Style Over Generic PSR Advice

PSR and similar guidance can help as a secondary heuristic, but they do not override Moodle's coding style or established file layout.

Apply generic style guidance carefully:

- Use Moodle naming and file placement where Moodle expects them.
- Do not force PSR-12 formatting if the project follows Moodle style.
- Do not restructure Moodle callback files just to satisfy a generic PHP preference.
- Prefer Moodle's namespaced class locations only where the target subsystem and version support them.

### Use SOLID Carefully, Not Dogmatically

SOLID is useful when it helps clarify responsibilities. It should not push the code away from Moodle-native extension points.

Prefer:

- Cohesive helpers with a real domain role
- Renderers for rendering concerns
- Form classes for input workflows
- Tasks for recurrent background work
- External classes for web services where supported

Avoid:

- Abstracting simple Moodle callback code into needless service layers
- Adding interfaces or factories with no real substitution need
- Replacing standard Moodle globals or subsystem entrypoints just to satisfy theoretical dependency inversion

## Strong Recommendations

### Types

Use type declarations where they improve clarity and are valid for the supported PHP version.

Be careful with:

- Over-tightening public API contracts in stable plugin branches
- Adding types that conflict with existing Moodle callback signatures
- Suggesting advanced type syntax without checking compatibility first

### Modern Syntax

Features like constructor promotion, `match`, `readonly`, and enums can be good additions, but only when:

- The target Moodle branch supports the required PHP version
- The syntax matches the surrounding codebase maturity
- The change improves clarity more than it increases compatibility risk

### Exceptions

Use specific exceptions when they improve caller behavior or testability. Do not wrap everything in custom exception hierarchies when Moodle already has a clearer subsystem-level error handling path.

### Performance

Prefer query shape fixes, pagination, and Moodle caching patterns before micro-optimizing PHP syntax. In Moodle plugins, bad data access patterns usually matter more than low-level PHP micro-optimizations.

### Security

Apply PHP security advice through Moodle primitives:

- Validate inputs with Moodle parameter APIs
- Escape output with Moodle output helpers and context-aware formatting
- Use sesskey checks for state changes
- Use capability checks early
- Use Moodle File API for uploads and managed files

### External APIs

For Moodle web services and AJAX endpoints, good PHP structure still sits underneath Moodle's external API contract:

- Define `execute_parameters()` explicitly
- Call `validate_parameters()` early in `execute()`
- Resolve and validate the right context
- Enforce capabilities before the domain action
- Keep `execute_returns()` aligned exactly with the returned payload

Do not replace this with generic controller or request/response abstractions when Moodle's external API framework already provides the contract.

## Review Heuristics

When reviewing PHP-heavy Moodle code, ask:

1. Is the recommendation compatible with the target Moodle branch and PHP version?
2. Does it follow a Moodle-native subsystem instead of generic raw PHP?
3. Does it improve clarity without fighting Moodle conventions?
4. Is the abstraction solving a real maintenance problem?
5. Would this change still look natural to an experienced Moodle maintainer?

If the answer to any of these is no, do not recommend the change as a best practice.
