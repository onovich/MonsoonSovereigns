# Handoff Message Protocol

## Required JSON shape

```json
{
  "message_id": "MSG-20260623-001",
  "task_id": "FOUNDATION-003",
  "from_role": "simulation_engineer",
  "status": "REVIEW",
  "summary": "Implemented deterministic hello simulation shared by Worker and Node runner.",
  "artifacts": ["packages/sim-core/src/..."],
  "branch_or_worktree": "feat/foundation-003-deterministic-hello",
  "commit": "<sha-or-null>",
  "tests_run": [
    {"command": "pnpm --filter sim-core test", "exit_code": 0, "result": "12 passed"}
  ],
  "decisions": [],
  "risks": [],
  "blockers": [],
  "route_to": "qa_reviewer",
  "requested_action": "Verify cross-runtime hash, architecture boundaries, and tests.",
  "created_at": "2026-06-23T00:00:00Z"
}
```

## Status values

`PARTIAL`, `BLOCKED`, `REVIEW`, `ACCEPT`, `REQUEST_CHANGES`, `INFO`.

A writer normally emits `REVIEW`; reviewer emits `ACCEPT`, `REQUEST_CHANGES`, or `BLOCKED`.

## Truthfulness

- `tests_run` records only commands actually run.
- A nonzero exit code must remain visible.
- No commit uses `null`, not a fake hash.
- Artifact paths must exist or be clearly external URLs/reports.
- Decisions distinguish approved ADRs from local implementation choices.
- Risks are not blockers; blockers prevent the requested next action.

## File naming

```text
project/messages/outbox/<TASK_ID>__<MESSAGE_ID>__<FROM_ROLE>.json
```

Use ASCII-safe task/message/role names. The parent may move processed messages to `project/messages/archive` later.

## Autonomous Goal Mode

`AUTONOMOUS-GOAL-MODE-001` does not add required schema fields. Goal-mode handoffs still use the same JSON shape, with mode-specific evidence recorded in existing fields:

- `summary` names the current checkpoint or continuation result;
- `artifacts` includes `project/goal-mode-state.json` and any touched process documents;
- `tests_run` records task validation, ready/list checks, state shape checks, and handoff validation;
- `decisions` cites `AUTONOMOUS-GOAL-MODE-001` and any approval source;
- `risks` records unresolved continuation risks;
- `blockers` records any active Human Gate or failed required gate;
- `route_to` remains the next responsible role, not a direct peer-to-peer delivery guarantee.
