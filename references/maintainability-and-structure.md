# Maintainability And Structure

Use this file when the task is about code order, spaghetti growth, duplicated logic, fat entrypoints, heavy loops, or file sprawl inside a Moodle plugin.

The review lens here is deliberately strict. It is adapted from the thermo-nuclear code quality review standard and re-expressed in Moodle terms: the goal is not local tidying, but structural simplification that keeps behavior identical while removing branches, layers, and duplication.

Formal rule companions:

- `arch-thin-entrypoints`
- `arch-guard-clauses-over-nesting`
- `arch-no-scattered-special-cases`
- `arch-single-canonical-implementation`
- `arch-decompose-large-files`
- `arch-helper-boundaries`
- `data-no-queries-in-loops`

## Be Ambitious About Structure, Not Just Tidy

Prefer the restructuring that makes whole branches, flags, or helper layers unnecessary over the one that merely rearranges them.

Ask on every non-trivial change:

- Can this be reframed so these conditionals disappear instead of getting centralized?
- Does an existing Moodle API, hook, renderer, or task already own this concern?
- Would a reader need fewer concepts after this change, or more?
- Is the complexity being deleted, or just moved?

Do not accept "it works" when the surrounding plugin becomes harder to reason about.

## Moodle-Specific Structure Smells

Escalate these during review:

- Page scripts that read parameters, query, mutate, and echo markup in one procedural block
- `locallib.php` or `lib.php` absorbing unrelated responsibilities
- A file crossing roughly a thousand lines because of the current change
- New boolean or mode flags threaded through shared functions, renderers, or callbacks
- Deep `if`/`else` nesting where early returns and `require_*` guards would be clearer
- The same query or rule copy-pasted across page, task, CLI, and external function
- Database calls, context building, or remote calls inside loops
- Nested loops over records where one set-based query would be clearer
- Generic `utils`/`helpers` buckets accumulating unrelated static methods
- Thin wrappers that only forward to a Moodle API without adding meaning
- Feature-specific logic added to a generic plugin function used elsewhere

## Preferred Remedies

- Keep entrypoints to params, context, capability, sesskey, delegation, and output
- Move domain work into autoloaded classes under `classes/`
- Replace flag parameters with explicit named behaviors or a dispatch map
- Handle failure cases first with guard clauses and Moodle exceptions
- Extract the duplicated operation once and call it from every entrypoint
- Preload related records with `get_in_or_equal()` or joins instead of per-row queries
- Aggregate in SQL instead of counting in PHP
- Split oversized files by responsibility, keeping `lib.php` for callbacks
- Delete indirection that does not clarify the Moodle integration point

## Moodle Guardrails On Aggressive Refactoring

Structural ambition still stays subordinate to Moodle conventions:

- Do not remove Moodle-required file names, callback shapes, or globals to satisfy a design preference
- Do not introduce interfaces, factories, or repositories with no real substitution need
- Do not restructure code in ways the target Moodle/PHP matrix cannot support
- Prefer core and existing plugin helpers over new bespoke abstractions
- Keep refactors reviewable: separate behavior-preserving restructuring from behavior changes when practical

## Review Heuristics

Flag the implementation if you see:

- Complexity spread across shared paths instead of owned by one class
- A diff that adds branches to an already busy Moodle function
- Duplicated domain logic with no canonical home
- Per-row queries or nested record loops on data that can grow
- A file that should have been decomposed before this change

## Remediation Language

Use wording like:

- "Keep this page thin and move the domain work into `classes/`."
- "Handle the failure cases first with guard clauses so this nesting disappears."
- "This mode flag is spreading special cases; give the behavior one owner."
- "This query is duplicated in three entrypoints; extract one canonical operation."
- "Preload these records in a single query instead of querying per row."
- "This change pushes the file past a healthy size; decompose it first."
