# Sections

This file defines the main rule sections, their ordering, impact levels, and prefixes used for findings.

---

## 1. Capabilities and Security (security)

**Impact:** CRITICAL  
**Description:** Missing access checks, wrong contexts, or unsafe request handling create the highest-risk Moodle failures.

## 2. Version Compatibility and Upgrades (compat)

**Impact:** CRITICAL  
**Description:** Moodle version mismatches, invented core APIs, and incorrect or non-self-contained upgrade paths can break plugins in production and during deployment.

## 3. Forms, Rendering, Moodle 5 UI, and Output Structure (ui)

**Impact:** HIGH  
**Description:** Using Form API, Mustache, renderers, concise contextual operational help, and Moodle 5.x Boost/Bootstrap 5.3 patterns correctly is core to maintainable and Moodle-native UI implementation.

## 4. JavaScript and Frontend Behavior (amd)

**Impact:** HIGH  
**Description:** Browser logic should be modular, AMD-based, and integrated through Moodle page requirements APIs.

## 5. Data Access, SQL Choice, and Scalability (data)

**Impact:** HIGH  
**Description:** Query shape, DB API selection, filtering, pagination, status contracts, and end-to-end persistence workflows directly affect plugin correctness and scalability.

## 6. Web Services and External APIs (external)

**Impact:** MEDIUM-HIGH  
**Description:** External functions need explicit contracts, access checks, correct structural placement, service/token wiring, and idempotent delivery behavior.

## 7. Events, Tasks, Cache, and Async Work (async)

**Impact:** MEDIUM  
**Description:** Observers, scheduled/adhoc tasks, and cache should be introduced deliberately, with clear responsibility boundaries and invalidation.

## 8. Privacy, Files, and Backup/Restore (lifecycle)

**Impact:** MEDIUM  
**Description:** User data lifecycle concerns must align with Moodle Privacy API, File API, backup/restore portability, and related plugin obligations.

## 9. Structure, Maintainability, Helpers, and Naming (arch)

**Impact:** HIGH  
**Description:** Thin entrypoints, guard clauses, one canonical implementation per operation, contained special cases, cohesive helpers, and decomposed files keep plugins reviewable and maintainable.

## 10. Accessibility, I18n, and Testing (quality)

**Impact:** MEDIUM  
**Description:** Accessibility, translation readiness, legacy parity, release verification, and automated tests increase plugin quality and reduce regressions.
