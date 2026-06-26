# Manual Node Battle Decision

Decision ID: `M5-MANUAL-NODE-BATTLE-DECISION-001`

Status: Accepted

Decision: Defer manual node battle from 1.0

Decision code: `DEFER_MANUAL_NODE_BATTLE`

Date: 2026-06-27

Product owner approval: Codex attachment `bd35b618-425a-4c23-a433-58c7a687d4d0/pasted-text.txt`, received 2026-06-27.

## Rationale

The 1.0 product focus remains the grand-strategy and governance loop:

- vassal networks;
- tribute and military-service obligations;
- administrative burden;
- characters, offices, and enfeoffment;
- succession crises;
- monsoon timing, routes, logistics, and campaign preparation;
- postwar governance;
- explainable AI.

Manual node battle would substantially expand UI, AI, balance, tutorial, animation, and test scope. It also risks shifting the product center away from vassalage, logistics, campaign planning, and postwar governance. For 1.0, the project continues with automatic and abstract battle resolution connected to campaign preparation, march, supply, siege, withdrawal, and postwar settlement.

## Impact On M5

Manual node battle is not part of M5.

M5 evidence may continue to rely on:

- automatic and abstract engagement resolution;
- siege choices and outcomes;
- campaign planning and logistics;
- postwar governance handoff;
- AI reasons and traces.

M5 exit should treat the manual node battle decision as resolved by this document. M5 exit must not create a manual battle implementation task or a blocking manual battle spike.

## Impact On M6, M7, And M8

Manual node battle is not part of the 1.0 mainline for M6, M7, or M8.

M6, M7, and M8 may continue to improve the accepted automatic/abstract combat, campaign, logistics, siege, and postwar systems. They must not add a manual node battle implementation task or a blocking manual node battle research/spike task to the 1.0 task graph.

Manual node battle may be recorded as a post-1.0 expansion candidate or future research candidate. That future status is not authorization to implement it in the 1.0 line.

## Explicit Prohibitions

This decision explicitly prohibits:

- adding manual node battle to M5;
- adding manual node battle to the 1.0 mainline;
- creating a manual node battle implementation task for the current 1.0 task graph;
- creating a manual node battle spike or research task that blocks M5, M6, M7, or M8;
- changing campaign, battle, siege, logistics, or postwar code to prepare hidden manual battle scope;
- interpreting future reconsideration as present implementation authorization;
- deleting existing campaign, supply, siege, automatic battle, or postwar governance systems because of this deferral.

## Future Reconsideration Triggers

Manual node battle can be reconsidered only outside the current 1.0 task graph, for example after 1.0 or as a separately approved expansion candidate.

Any reconsideration must require a new explicit product decision and must define:

- whether it is research-only or implementation;
- non-blocking relationship to the 1.0 mainline;
- UI, AI, tutorial, animation, balance, and testing cost;
- deterministic battle authority and save compatibility;
- how it preserves the product focus on vassalage, logistics, campaign planning, and postwar governance.

## Relationship To M5 Exit Gate

`M5-EXIT-HUMAN-GATE-001` may begin after this decision is integrated and `M5-MANUAL-NODE-BATTLE-DECISION-001` is closed.

M5 exit evidence must cite this decision as:

```text
manual_node_battle_decision = DEFER_MANUAL_NODE_BATTLE
manual_node_battle_in_m5 = false
manual_node_battle_in_1_0_mainline = false
```

M5 exit remains a separate Human Gate. This decision resolves only the manual node battle gate.

## Ledger Notes

The 2026-06-27 status audit recorded four process facts that this decision checkpoint must preserve:

- `project/goal-mode-state.json` had `last_main_commit` behind the then-current `origin/main`.
- M4 PR #106 is the M4 gate validation/evidence PR, while PR #107 is the M4 exit closure PR.
- `docs/GATE-M1.md` through `docs/GATE-M4.md` are historical gate evidence documents, not final closure ledgers.
- `taskctl.mjs validate` without a task id currently returns `Task not found: undefined`; use explicit task validation plus `taskctl list` and `taskctl ready`.
