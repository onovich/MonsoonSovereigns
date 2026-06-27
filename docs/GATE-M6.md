# M6 Exit Gate

Task: `M6-EXIT-VALIDATION-001`

Role: `systems_architect` writer

Branch: `gate/m6-exit-validation`

Base main commit: `cd5cebebfe6ac7b0dd07a7468abcba9da55fd765`

Review head before gate edits: `3096b241818f4ed55a53eb7f016ab1dbdd0cdd7a`

Status: `CLOSED`

Integrated PR: #157

Integrated main commit: `5e68a74374a37fa2f3698ee846462c0525d7341a`

## Gate Result

`M6_GATE = PASS_WITH_LIMITS`

This began as a systems_architect REVIEW recommendation. Independent `qa_reviewer` accepted it in `project/messages/outbox/M6-EXIT-VALIDATION-001__MSG-20260628-M6-EXIT-QA-REVIEW__qa_reviewer.json`; PR #157 passed CI and entered `origin/main` at `5e68a74374a37fa2f3698ee846462c0525d7341a`.

M6 Alpha system-complete exit criteria are satisfied:

- At least one deterministic Alpha path reaches victory from start to terminal state.
- Layered AI completes the accepted Alpha victory run without rescue hooks.
- Major Alpha systems have non-placeholder client surfaces.
- The accepted M6 evidence reports no accepted P0/P1 blockers.
- `DEFER_MANUAL_NODE_BATTLE` remains preserved for M6, M7, and M8.

The result is `PASS_WITH_LIMITS`, not plain `PASS`, because the gate evidence is still Alpha-bounded and local: three-scenario data is validation scaffolding rather than M7 content lock, adviser evidence is local/privacy-safe rather than broad external player research, batch balance contains non-blocking tuning risks, M4/M5 process limits remain historical context, and Windows packaging is smoke evidence rather than a signed release artifact.

## Scope Guard

This gate changes only allowed process and gate evidence paths. It does not modify product code, packages, content-source data, dependency manifests, release artifacts, telemetry, server or multiplayer behavior, arbitrary-code mods, commercial or branding decisions, Roadmap, acceptance matrix, prior gates, accepted ADRs, or frozen architecture choices.

No ADR is required because this gate makes no architecture change. It records validation evidence against the accepted TypeScript/Web-first/Worker-authoritative/explicit-command architecture.

Manual node battle remains:

```text
manual_node_battle_decision = DEFER_MANUAL_NODE_BATTLE
manual_node_battle_in_m6 = false
manual_node_battle_blocking_m6_m7_m8 = false
```

No manual node battle implementation task, M6/M7/M8 blocking spike, or M6/M7/M8 blocking research task is created by this gate.

## Roadmap And Matrix Evidence

| M6 requirement | Evidence | Result |
|---|---|---|
| From start to one victory is playable | `M6-START-TO-VICTORY-SIM-LOOP-001` closed after PR #143 at `f43649a8c1fcca0886c229873d95edb7045267fc`; focused rerun passed 5 tests. `pnpm sim:determinism` reports M6 Alpha Node and Worker-compatible hash `260f46c3`, loaded hash `260f46c3`, terminal outcome `victory`. | PASS |
| No P0/P1 data damage | `M6-ALPHA-NO-P0P1-VALIDATION-001` closed after PR #155 and closure PR #156. Local gate rerun found no accepted P0/P1; batch artifact has `p0p1CandidateCount = 0`. | PASS |
| AI completes a game without rescue | `M6-LAYERED-AI-001` closed after PR #147 at `f37f289fc9e29ce7f6b91dd56e19b5e4034bac62`; focused rerun passed 3 tests and asserts `terminalOutcome = victory`, `noRescueHooks = true`, command parity, bounded traces, and deterministic layer order. | PASS |
| Major systems have no placeholder UI | `M6-CLIENT-ALPHA-SURFACES-001` closed after PR #145 at `0f621d9ce41c15916894cccf3ea67acfdc23aad3`; E2E covers M6 scenario, diplomacy, policy, encyclopedia, map candidate, checkpoint, and victory flow. | PASS |
| Diplomacy and legitimacy | `M6-DIPLOMACY-LEGITIMACY-001` closed after PR #133 at `96dd735d463d400a9e30b2112e4377cca7783d1e`; systems R3 accepted actor-authority enforcement, recognized-order gating, save/protocol integration, and AuthoritativeGameCommandV1 boundary. | PASS |
| Succession completion | `M6-SUCCESSION-COMPLETION-001` closed after PR #139 at `190f93ca66d674c00766b807df350b75a6e4f06a`; systems R2 accepted regent semantic validation and one-candidate low-support rejection fixes. | PASS |
| Policy, event, encyclopedia surfaces | `M6-POLICY-EVENT-RUNTIME-001` closed after PR #141 at `b34f3b440929d08dd39b445a9ae92a0e16a93323`; client Alpha surfaces and E2E cover policy/event and encyclopedia UI. | PASS |
| Three-scenario data pipeline | `M6-SCENARIO-DATA-PIPELINE-001` closed after PR #135 at `7f83cd4da1dcd7fdc77be922225bef43c9127c74`; `pnpm content:validate` reports `m6.alpha.scenario.set scenarios=3 claims=6 sources=5 referenceTargets=8 manifestHash=6d1f6d64`. | PASS_WITH_LIMITS |
| Map candidate path | `M6-MAP-CANDIDATE-PIPELINE-001` closed after PR #137 at `396d3897d32882a9b117a8758d21ce0829fd8d60`; `pnpm content:validate` reports M6 map candidate manifest `4485a353`. | PASS |
| Batch auto-run and balance dashboard | `M6-BATCH-AUTORUN-BALANCE-DASHBOARD-001` closed after PR #151 at `4fbec6f0dc8408df785a7492f2b463ab2efdbb03`; local rerun artifact hash is `99d64950`, 3 scenarios, 2 seeds, 6 runs, no P0/P1 candidates. | PASS_WITH_LIMITS |
| Accessibility core flows | `M6-ACCESSIBILITY-CORE-FLOWS-001` closed after PR #149 at `4fa574fddda51943ec7f47ce80c8434375d32756`; E2E passed M6 keyboard/focus/live-status/non-color state and viewport overflow checks. | PASS |
| Adviser intervention evidence | `M6-ADVISER-INTERVENTION-EVIDENCE-001` closed after PR #153 at `072ae2f5cfade1b0bc85ec3bab1c577395e279d4`; QA accepted local/privacy-safe evidence with no blockers. | PASS_WITH_LIMITS |

## Required Command Evidence

| Command | Exit | Gate result |
|---|---:|---|
| `git status --short` | 0 | Clean before edits. |
| `node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs validate M6-EXIT-VALIDATION-001` | 0 | Task JSON valid. |
| `node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs list` | 0 | M6 dependencies listed as `CLOSED`; gate task listed as `IN_PROGRESS` before this REVIEW update. |
| `node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs ready` | 0 | No ready task output while M6 exit is active. |
| `pnpm install --frozen-lockfile` | 0 | Already up to date. |
| `pnpm check` | 0 | Format, lint, workspace typecheck, and architecture boundaries passed. |
| `pnpm test` | 0 | Architecture, determinism, root Vitest 41 files / 307 tests, and web Vitest 1 file / 4 tests passed. |
| `pnpm content:validate` | 0 | M1/M2/M3/M6 content validation passed; M6 scenario manifest `6d1f6d64`, map candidate manifest `4485a353`. |
| `pnpm sim:determinism` | 0 | Node/Worker parity passed through M6 Alpha; M6 Alpha hash `260f46c3`, terminal outcome `victory`. |
| `pnpm sim:perf-baseline` | 0 | 3650-day baseline passed; throughput 12106 days/s, p50 62900ns, p95 160900ns, p99 238300ns, save 9980 bytes. |
| `pnpm build:web` | 0 | Vite build passed with existing chunk-size warning. |
| `pnpm storybook:build` | 0 | Storybook build passed with existing chunk-size warning; output directory cleaned by script. |
| `pnpm desktop:security-check` | 0 | Electron security preferences, preload bridge, renderer file navigation, and IPC allowlist passed. |
| `pnpm desktop:package` | 0 | Desktop package smoke passed; output `.tmp/desktop-package/MonsoonSovereigns-win32-x64`. |
| `pnpm test:e2e` | 0 | Playwright Chromium 11/11 passed, including M6 Alpha and accessibility/viewport tests. |
| `pnpm vitest run --config vitest.config.ts tests/sim-core-m6-start-to-victory-loop.test.ts` | 0 | 1 file / 5 tests passed. |
| `pnpm vitest run --config vitest.config.ts tests/sim-ai-m6-layered-ai.test.ts` | 0 | 1 file / 3 tests passed, including no-rescue Alpha AI validation. |
| `pnpm --filter @monsoon/sim-runner sim:m6-batch-balance` | 0 | Artifact hash `99d64950`, 3 scenarios, 2 seeds, 6 runs, `p0p1CandidateCount = 0`, `noRescueCompletionCount = 2`. |
| `node -e` adviser evidence review | 0 | Adviser task CLOSED, QA ACCEPT, lead ACCEPT, no blockers, local/privacy-safe, manual deferral preserved. |

The required `node -e` gate-shape validation, systems handoff validation, and final `git diff --check` are run after this document and the systems handoff are created; their results are recorded in the handoff.

## Architecture Review

The M6 evidence preserves the accepted architecture:

- `sim-core` remains decoupled from React, Pixi, Electron, DOM, Node IO, and real-time APIs.
- World mutation remains under authoritative simulation command paths.
- Player and AI use shared command payloads where gameplay commands overlap; system support commands are explicitly separated and reviewed.
- Save/load stays explicit DTO/schema based; no object graph serialization is introduced.
- Content data passes explicit source/runtime schema validation.
- React client surfaces consume read models and protocol command DTOs; they do not store full `WorldState` or own Pixi entity objects as authority.
- Electron renderer remains behind preload/IPC adapter; security smoke passes.

## Limits And Follow-Ups

These are not blockers for M6 exit, but they must not be hidden:

- M6 scenario data is Alpha validation scaffolding, not M7 content lock.
- Batch balance evidence intentionally exposes tuning risks for later balancing: early terminal collapse, missing recognition, unresolved policy evidence, and stress grain pressure. It records no P0/P1 candidates.
- Adviser evidence is local and privacy-safe: no telemetry, no remote collection, no accounts, and no new external participant study.
- Prior M4 and M5 gates remain `PASS_WITH_LIMITS`; M6 does not erase those historical process limits.
- Web and Storybook builds still emit chunk-size warnings; this remains build-health/performance debt, not an accepted P0/P1 blocker.
- Node emits `MODULE_TYPELESS_PACKAGE_JSON` warnings for deterministic worker fixture tests; tests pass and no product blocker is accepted.
- The desktop package command is local smoke packaging, not a signed release candidate.
- This gate does not start M7 content lock, M8 release work, branding/commercial decisions, telemetry, server/multiplayer, arbitrary-code mods, or manual node battle reconsideration.

## Next Route

M6 is complete with `PASS_WITH_LIMITS`. This gate itself does not start M7 content lock; the next process step must create or recover the M7 task graph before any M7 content-lock implementation begins.
