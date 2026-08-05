---
title: Use Literal Ampersands When Building Outbound HTTP Query Strings
impact: CRITICAL
impactDescription: Prevents silent empty API results when Moodle's HTML arg_separator turns query params into amp;page
tags: moodle, http, curl, external, integration, query-string
---

## Use Literal Ampersands When Building Outbound HTTP Query Strings

**Impact: CRITICAL (prevents silent empty API results when Moodle's HTML arg_separator turns query params into amp;page)**

Moodle core sets `arg_separator.output` to `&amp;` so HTML attributes stay valid. That global setting also affects `http_build_query()`. For outbound HTTP clients, curl, OAuth, and third-party APIs, pass an explicit literal `'&'` separator. Never rely on the PHP default inside a Moodle request.

Wrong:

```php
// Moodle has set arg_separator.output to '&amp;'.
$query = http_build_query([
    'termCode' => $term,
    'page' => 0,
    'size' => 100,
]);
// Becomes: termCode=202610&amp;page=0&amp;size=100
$url = $baseurl . '/sections?' . $query;
```

Preferred:

```php
$query = http_build_query(
    [
        'termCode' => $term,
        'page' => 0,
        'size' => 100,
    ],
    '',
    '&'
);
// Becomes: termCode=202610&page=0&size=100
$url = $baseurl . '/sections?' . $query;
```

Why it matters:

- The remote API may return HTTP 200 with an empty payload because it sees params named `amp;page` and `amp;size`
- The failure looks like “Banner/Moodle has no data” when connectivity and auth are fine
- `moodle_url` and HTML output correctly want `&amp;`; outbound wire protocols need raw `&`
- This behavior has existed across many Moodle versions; it is not a Moodle 4.x or 5.x novelty

Recommended remediation:

- Always pass `'&'` as the third argument to `http_build_query()` for outbound HTTP
- Prefer a shared HTTP client helper that owns URL building for every remote call
- Log or assert the exact request URL in integration smoke tests and confirm it contains `&`, not `&amp;`
- Do not “fix” this by decoding HTML entities after the fact; build the wire URL correctly
- Keep HTML page links on Moodle URL/output helpers; do not reuse HTML-encoded strings for curl

Reference: [Moodle Developer Documentation](https://moodledev.io)
