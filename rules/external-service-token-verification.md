---
title: Verify Service And Token Wiring Before External Release
impact: MEDIUM-HIGH
impactDescription: Prevents deployed functions from remaining unavailable to the real consumer
tags: moodle, external, webservice, token, operations
---

## Verify Service And Token Wiring Before External Release

**Impact: MEDIUM-HIGH (prevents deployed functions from remaining unavailable to the real consumer)**

Registration in `db/services.php` does not prove that an existing token can call the function. Before releasing an external API change, verify the service-function association, token user, capabilities, and applicable IP or time restrictions with a real transport request.

Wrong:

```php
// Assume this registration automatically updates every existing token.
$functions = [
    'local_example_create_items' => [
        'classname' => '\local_example\external\create_items',
        'methodname' => 'execute',
    ],
];
```

Preferred:

```php
// Register the function, then verify the deployed service/token separately.
// Run a minimal authenticated request using the same service and user as the consumer.
$functions = [
    'local_example_create_items' => [
        'classname' => '\local_example\external\create_items',
        'methodname' => 'execute',
    ],
];
```

Why it matters:

- Existing custom services and tokens are operational state, not only plugin code
- A function can exist in Moodle while remaining forbidden to the consumer
- User capability, service membership, IP, and validity restrictions all affect access

Recommended remediation:

- Document how to associate the function with the intended custom service
- Verify the token's user and restrictions through Moodle administration or verified schema
- Run a minimal REST/curl smoke request with the real service configuration
- Do not expose token values in logs, documentation, or test output

Reference: [Web services](https://moodledev.io/docs/apis/subsystems/external)
