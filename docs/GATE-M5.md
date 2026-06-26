# GATE-M5

Gate ID: GATE-M5
Task ID: M5-EXIT-HUMAN-GATE-001
Decision date: 2026-06-27
Lead reconciliation recommendation: M5_GATE = PASS_WITH_LIMITS
Branch/worktree: gate/m5-exit-human-gate
Main baseline: 4919f8bc48fa3b7e13ea69ebd8483b1e70a0f313
Human approval source: Codex attachment `bd35b618-425a-4c23-a433-58c7a687d4d0/pasted-text.txt`

## Result

The product and technical evidence supports M5 exit as `PASS_WITH_LIMITS`.

The limits are bounded and already recorded by accepted M5 tasks:

- the player-research evidence is a minimal internal anonymous pilot, not recruited external playtest evidence;
- desktop save/load evidence proves client-session checkpoint behavior, not a full file import/export bridge;
- the live multi-year AI run accepted a no-action-heavy trace as an explicit validation limit;
- repeated reason-code chips produced duplicate React key warnings in player-research evidence;
- Web and Storybook builds retain existing large chunk warnings while exiting successfully;
- M4 entered M5 as `PASS_WITH_LIMITS` because of a process-review limitation, not a product-code blocker.

No P0/P1 data-corruption, determinism, security, package-boundary, product-scope, or Human Gate blocker is found. This gate does not add product/runtime code, release artifacts, telemetry, server/multiplayer, arbitrary-code mods, commercial/branding decisions, or manual node battle work.

Manual node battle is resolved separately as `DEFER_MANUAL_NODE_BATTLE` in `docs/28-manual-node-battle-decision.md`; it remains outside M5 and outside the 1.0 mainline.

## Human Gate Record

The product owner explicitly resolved the remaining M5 manual node battle Human Gate and authorized M5 Exit Gate to begin in attachment `bd35b618-425a-4c23-a433-58c7a687d4d0/pasted-text.txt`.

The accepted manual node battle decision is:

```text
manual_node_battle_decision = DEFER_MANUAL_NODE_BATTLE
manual_node_battle_in_m5 = false
manual_node_battle_in_1_0_mainline = false
implementation_task_authorized = false
blocking_spike_authorized = false
```

This M5 gate recommendation remains conditional on independent reviewer acceptance, PR CI, merge, main synchronization, and task closure before `current_milestone` advances to M6.

## M5 Dependency Evidence

| Workstream | Integrated evidence | Gate use |
| --- | --- | --- |
| `M5-TASK-GRAPH-001` | `CLOSED`; PR #108 at `8b771272a9cfa790282043fcd092c1ce59fd0117` | Minimal bounded M5 vertical-slice task graph. |
| `M5-SLICE-DEFINITION-001` | `CLOSED`; PR #110 at `1eaf46fb109f8dca93ba50dd269cbcdea0fef042` | 2-4 hour repeatable M5 playable-slice contract and explicit exclusions. |
| `M5-SIM-PLAYABLE-LOOP-001` | `CLOSED`; PR #112 at `fee2ccfeefd7ad73bbfc37442c4224000ad75496` | Deterministic M5 playable loop, M4 runtime save/load support, Node worker JSON boundary, and focused tests. |
| `M5-CLIENT-PLAYABLE-UI-001` | `CLOSED`; PR #114 at `5502087977416f2720e084337b65c16c472a4d14` | Read-model driven M5 UI flow, command preview/confirm/result, save/load session path, Storybook/Web/Playwright evidence, and viewport overflow checks. |
| `M5-MULTIYEAR-AI-RUN-001` | `CLOSED`; PR #116 at `809209369a9ca21f32f6e0887758c5f0e670dd41` | Deterministic multi-year AI run validation with accepted no-action-heavy limitation. |
| `M5-PERFORMANCE-GATE-001` | `CLOSED`; PR #118 at `bd47faee8e6780a96f92402f47361012be40f3e1` | Performance and stability evidence; future desktop import/export timing caveat recorded. |
| `M5-WEB-WINDOWS-DISTRIBUTABLE-001` | `CLOSED`; PR #120 at `b173c980e02e3d2365fdb4d022c7c4392918cca9` | Local Web and unsigned Windows distributable smoke evidence; current desktop exposes no file import/export IPC. |
| `M5-PLAYER-RESEARCH-001` | `CLOSED`; PR #122 at `8b6ef6542d2d1a8270618ec8bae2161eb94c2e9d`; closure PR #123 at `22a3473eb10d4008500e499ae135333e7d974311` | Minimal privacy-safe internal anonymous M5 player-research pilot and recorded limitations. |
| `M5-MANUAL-NODE-BATTLE-DECISION-001` | `CLOSED`; decision PR #125 at `daf09128b3c15bee26664a9b750a625ed8384767`; closure/start PR #126 at `4919f8bc48fa3b7e13ea69ebd8483b1e70a0f313` | Manual node battle deferred from M5 and the 1.0 mainline; M5 Exit started as separate gate. |

## Acceptance Matrix

| M5 matrix column | Evidence | Classification |
| --- | --- | --- |
| Product/design: 2-4 hour repeatable vertical slice | Slice definition, playable simulation loop, client flow, local player-research pilot, and manual battle decision are closed and integrated. | PASS_WITH_LIMITS |
| Simulation/data: multi-year AI run without rescue | Multi-year AI task closed with deterministic runner and accepted QA; live evidence is no-action-heavy and explicitly bounded. | PASS_WITH_LIMITS |
| Client/platform: Web and Windows distributable | Web build, Playwright M5 flow, Storybook build, Electron security check, desktop package smoke, and PR CI all pass; desktop file import/export is not part of the current bridge. | PASS_WITH_LIMITS |
| QA/research: player research, performance gate, manual battle decision | Player research, performance gate, and manual node battle decision are closed; limitations are P3/P2 and carried forward. | PASS_WITH_LIMITS |

## Roadmap Decision Gates

| M5 decision gate | Evidence | Classification |
| --- | --- | --- |
| Web performance acceptable for first-tier platform | Performance gate, Web build, Playwright, and CI passed. Existing chunk warnings are non-blocking. | PASS_WITH_LIMITS |
| Manual node battle enters 1.0? | Product owner selected `DEFER_MANUAL_NODE_BATTLE`; no implementation or blocking spike/research is authorized for the 1.0 task graph. | PASS |
| Electron memory/package acceptable | Windows desktop smoke artifact and local package smoke pass; desktop file import/export remains future bridge scope. | PASS_WITH_LIMITS |
| Vassal mechanics better than direct annexation | M3 systems and M5 player-research evidence support the core loop, but player research sample size is minimal. | PASS_WITH_LIMITS |
| Content research and production cost acceptable | M5 remains composite/fictional and avoids formal large historical database expansion; later formal names/symbols still require historical routing. | PASS_WITH_LIMITS |

## Local Validation

| Command | Exit code | Key result |
| --- | ---: | --- |
| `pnpm install --frozen-lockfile` | 0 | Lockfile up to date; supply-chain policy check passed for 396 entries. |
| `pnpm check` | 0 | Prettier, ESLint, recursive typecheck, and architecture boundary checks passed; boundary self-test produced 15 expected violations. |
| `pnpm test` | 0 | Architecture check and sim determinism passed; root Vitest 35 files / 249 tests passed; Web Vitest 1 file / 4 tests passed. M5 hash `bf042e42`; loaded hash `bf042e42`. |
| `pnpm content:validate` | 0 | M1 manifest `4a438525`, M2 manifest `9ab72b0b`, and M3 manifest `76b75849` validated. |
| `pnpm build:web` | 0 | Vite production build passed with existing large chunk warnings. |
| `pnpm storybook:build` | 0 | Storybook build passed with existing large chunk warnings; output cleaned. |
| `pnpm desktop:security-check` | 0 | Electron security preferences passed; preload exposes only `monsoonDesktop`; allowed IPC channels remain `desktop:getRuntimeInfo` and `desktop:setFullscreen`. |
| `pnpm desktop:package` | 0 | Desktop package smoke output created under `.tmp/desktop-package/MonsoonSovereigns-win32-x64`. |
| `pnpm test:e2e` | 0 | Playwright Chromium 8/8 passed, including M5 playable flow and required desktop viewport overflow checks. |
| `pnpm sim:perf-baseline` | 0 | 3650 days; throughput 14716 days/sec; p50 57600 ns; p95 105100 ns; p99 176700 ns; save 1771500 ns; load 2576600 ns. |
| `node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs list` | 0 | M5 evidence tasks are CLOSED; M5 Exit is IN_PROGRESS before this gate review. |
| `node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs ready` | 0 | No dependency-ready task while M5 Exit is active. |
| `git diff --check` | 0 | No whitespace errors before writing this gate document. |

## Risks And Limits

| Risk | Status |
| --- | --- |
| Minimal player research sample | Accepted limit. Two internal anonymous sessions are enough for M5 prototype evidence but not final external validation. |
| Duplicate React key warnings for repeated reason-code chips | Accepted P3 follow-up from player research; no blocker defect. |
| Desktop import/export bridge | Accepted P3 caveat. Current desktop exposes runtime/fullscreen only; M5 proves client-session checkpoint behavior. |
| Multi-year AI run no-action-heavy trace | Accepted P2/P3 validation limit; deterministic runner and tests are present, but richer AI behavior remains later balancing/system scope. |
| Existing large chunk warnings | Accepted non-blocking Web/Storybook warning; commands exit 0 and no new dependency or bundling architecture is introduced by this gate. |
| M4 inherited process limit | Accepted prior `PASS_WITH_LIMITS`; no M5 product-code blocker found. |
| Manual node battle | Resolved as deferred from M5 and the 1.0 mainline. Future candidate status is not implementation authorization. |

No P0/P1 data-corruption risk, deterministic authority blocker, package-boundary blocker, Electron security blocker, frozen product/platform/core change, unapproved dependency, secret, telemetry/server/multiplayer/mod scope, or unresolved Human Gate blocker was found by the lead reconciliation.

## Conclusion

M5_GATE = PASS_WITH_LIMITS.

The M5 evidence satisfies the roadmap and acceptance-matrix criteria with explicit limits around research sample size, desktop file import/export, no-action-heavy AI evidence, existing chunk warnings, and inherited M4 process limits. The next required action is independent systems_architect and qa_reviewer acceptance, PR integration, CI, main synchronization, and task closure. Only after that should `current_milestone` advance to M6 and an M6 task graph be created or restored.
