---
title: Narrate Task Progress And Never Run Heavy Work As A Silent Spinner
impact: HIGH
impactDescription: Prevents opaque timeouts and makes multi-step background work diagnosable in cron and manual-run UIs
tags: moodle, task, mtrace, progress, async, admin, cron, webservices
---

## Narrate Task Progress And Never Run Heavy Work As A Silent Spinner

**Impact: HIGH (prevents opaque timeouts and makes multi-step background work diagnosable in cron and manual-run UIs)**

Do not offer an Execute / Run button that starts multi-step or chained work—especially outbound web-service chains that assemble the next call from the previous response—and then leave the browser spinning with no progress. Put that work in a scheduled or adhoc task, narrate each meaningful step with `mtrace()`, and for manual runs use a Moodle-native progress/log view that streams output and ends with a return action, the same way core `tool_task` does when an admin forces a scheduled task.

Wrong:

```php
// Plugin page: button runs the whole chain in the same request.
if (optional_param('run', 0, PARAM_BOOL)) {
    require_sesskey();
    $terms = $client->get_terms();
    foreach ($terms as $term) {
        $sections = $client->get_sections($term->code); // Builds next URL from prior response.
        foreach ($sections as $section) {
            $client->sync_section($section);
        }
    }
    redirect($returnurl, get_string('done', 'local_example'));
}
```

Preferred:

```php
// classes/task/sync_banner.php — narrate every meaningful step for cron and manual run.
public function execute() {
    mtrace('Banner sync started');

    $terms = $this->client->get_terms();
    mtrace('Fetched ' . count($terms) . ' active terms');

    foreach ($terms as $term) {
        mtrace('Syncing term ' . $term->code);
        $sections = $this->client->get_sections($term->code);
        mtrace('  term ' . $term->code . ': ' . count($sections) . ' sections');

        foreach ($sections as $section) {
            $this->client->sync_section($section);
            mtrace('  synced section ' . $section->crn);
        }
    }

    mtrace('Banner sync finished');
}

// Manual-run page: open the page first, stream task output, then offer return.
echo $OUTPUT->header();
echo html_writer::start_tag('pre', ['class' => 'task-output']);
\core\task\manager::run_from_cli($task); // Task mtrace lines appear live, as in tool_task.
echo html_writer::end_tag('pre');
echo $OUTPUT->single_button($returnurl, get_string('back'));
echo $OUTPUT->footer();
```

Why it matters:

- Chained remote calls and multi-step syncs routinely exceed request timeouts when run behind a silent spinner
- Without step narration, cron and operators cannot tell whether failure was auth, term fetch, section paging, or a later write
- Moodle's own “Run now” UI for scheduled tasks streams `mtrace` output and then offers a way back; plugin manual runs should match that expectation
- A finished “Back/Return” control reorients the operator to the button page or task log instead of leaving them on a dead loading state

Recommended remediation:

- Move multi-step, chained, or remote-heavy work into scheduled or adhoc tasks instead of the button request
- Call `mtrace()` (or `mtrace_exception()` on caught failures) at each meaningful stage: start, each remote hop, counts, skips, and finish
- Persist enough status/watermark state so a failure mid-chain is recoverable and the log shows where it stopped
- For “run manually”, render the page first, stream progress through Moodle task/`mtrace` output (or an equivalent `progress_trace` view), then show a return action to the originating view or log
- Never leave the browser on an empty spinner while the full pipeline completes with no intermediate output
- Prefer queueing and letting cron run when the operator does not need an interactive stream; still keep `mtrace` so scheduled-task logs narrate progress

Reference: [Task API](https://moodledev.io/docs/apis/subsystems/task)
