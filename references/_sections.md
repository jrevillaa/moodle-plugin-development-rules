# Sections

This file defines the main rule sections, their ordering, impact levels, and prefixes used for findings.

---

## 1. Capabilities and Security (security)

**Impact:** CRITICAL  
**Description:** Missing access checks, wrong contexts, or unsafe request handling create the highest-risk Moodle failures.

## 2. Version Compatibility and Upgrades (compat)

**Impact:** CRITICAL  
**Description:** Moodle version mismatches and incorrect upgrade paths can break plugins in production and during deployment.

## 3. Forms, Rendering, and Output Structure (ui)

**Impact:** HIGH  
**Description:** Using Form API, Mustache, and renderers correctly is core to maintainable and Moodle-native UI implementation.

## 4. JavaScript and Frontend Behavior (amd)

**Impact:** HIGH  
**Description:** Browser logic should be modular, AMD-based, and integrated through Moodle page requirements APIs.

## 5. Data Access, SQL Choice, and Scalability (data)

**Impact:** HIGH  
**Description:** Query shape, DB API selection, filtering, pagination, and exports directly affect plugin correctness and scalability.

## 6. Web Services and External APIs (external)

**Impact:** MEDIUM-HIGH  
**Description:** External functions need explicit contracts, access checks, and correct structural placement.

## 7. Events, Tasks, Cache, and Async Work (async)

**Impact:** MEDIUM  
**Description:** Observers, tasks, and cache should be introduced deliberately, with correct responsibility boundaries and invalidation.

## 8. Privacy, Files, and Backup/Restore (lifecycle)

**Impact:** MEDIUM  
**Description:** User data lifecycle concerns must align with Moodle Privacy API, File API, and plugin portability expectations.

## 9. Naming, Helpers, and Plugin Structure (arch)

**Impact:** MEDIUM  
**Description:** Good structure, names, and helper boundaries improve long-term maintainability and review quality.

## 10. Accessibility, I18n, and Testing (quality)

**Impact:** MEDIUM  
**Description:** Accessibility, translation readiness, and automated tests increase plugin quality and reduce regressions.
