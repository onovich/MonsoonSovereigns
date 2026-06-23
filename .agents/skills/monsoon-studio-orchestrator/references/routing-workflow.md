# Routing Workflow

## Parent-owned message bus

Codex exposes stable multi-agent controls including `spawn_agent`, `send_input`, `resume_agent`, `wait_agent`, and `close_agent`. The root lead thread is the only durable router. Child-to-child intent is expressed by `route_to`; the parent performs the actual send.

Why:

- peer availability and thread IDs are session-local;
- the parent can enforce task scope and review gates;
- messages are persisted before delivery;
- a failed target thread can be replaced without losing work.

## Routing state machine

```text
READY
  └─ spawn writer → IN_PROGRESS
       └─ writer handoff route_to=qa_reviewer → REVIEW
            ├─ ACCEPT route_to=lead_orchestrator → ACCEPTED
            ├─ REQUEST_CHANGES route_to=<writer> → IN_PROGRESS
            └─ BLOCK route_to=<decision owner> → BLOCKED
```

Design/research may precede writer but uses the same mechanism.

## Thread registry

`project/tasks/thread-registry.json` maps role to current session thread ID and task. Do not treat it as guaranteed after Codex restart. On failure to resume, spawn a fresh custom agent and pass persisted handoff paths.

## Compact route message

A routed message should contain:

- task ID and requested action;
- source role/status/summary;
- branch/worktree/commit;
- artifact paths;
- tests and failures;
- decisions/risks/blockers;
- exact required docs and acceptance criteria;
- where the target must route next.

Do not forward hidden reasoning or full transcripts.

## Fan-out and fan-in

For independent research, spawn up to four scouts and fan results into one domain owner. For code, generally one writer + one test/reviewer. The lead waits for all required messages, consolidates conflicts, then sends one clear instruction downstream.

## Spark routing

Spark routes are allowed only for bounded mechanical work with explicit allowed paths, tests, stop conditions, and a required handoff. Spark outputs route to a GPT-5.5 high/xhigh reviewer and cannot mark tasks `ACCEPTED`.

Use `project/model-routing-state.json` to record configured model, actual thread model when known, migration status, and any `MODEL_FALLBACK`. Do not rewrite accepted tasks solely because the configured model changed.

## Autonomous Goal Mode routing

When `AUTONOMOUS-GOAL-MODE-001` is enabled, the parent-owned message bus runs the same state machine repeatedly. The lead recomputes ready tasks, checks `project/goal-mode-state.json`, validates the latest handoff, and routes exactly one next action at a time.

Autonomous routing stops instead of spawning more work when:

- `human_gate.required` is true;
- a writer or reviewer handoff is missing or invalid;
- WIP limits would be exceeded;
- the next task is outside the current milestone or lacks satisfied dependencies;
- diff scope, required tests, model-routing fallback, security, history, license, or forbidden-path checks fail.

After a restart, thread IDs in the registry are hints only. Resume from persisted handoffs and task state; if a target thread cannot be resumed, spawn a replacement role with the compact route message and record the new thread ID.
