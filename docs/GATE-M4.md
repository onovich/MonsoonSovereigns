# GATE-M4

Gate ID: GATE-M4
Task ID: M4-EXIT-VALIDATION-001
Decision date: 2026-06-26
Lead reconciliation recommendation: M4_GATE = PASS_WITH_LIMITS
Branch/worktree: chore/m4-exit-gate
Main baseline: 96abe397327a81e5922aed61c022255dc20f2baa
Autonomy policy: MILESTONE-AUTONOMY-AMENDMENT-001 allows ordinary M1-M4 exits without a standalone Human Gate only when acceptance evidence, required tests, independent review, and no frozen-decision Human Gate conditions are satisfied. M5 remains outside this gate.

## Result

The product and technical evidence supports M4 exit as `PASS_WITH_LIMITS`. Independent `qa_reviewer` accepted this result in `project/messages/outbox/M4-EXIT-VALIDATION-001__MSG-20260626-M4-GATE-QA-REVIEW__qa_reviewer.json`; final task closure still requires PR integration, CI, and main synchronization.

The limit is procedural rather than a product-code failure: three real `systems_architect` writer threads were spawned for this gate and each was closed after stalling without a REVIEW handoff or file changes. This document is therefore a `lead_orchestrator` evidence reconciliation, not a fabricated systems handoff. The independent QA reviewer accepted that process exception as explicit, bounded, and not disguised as systems acceptance.

This gate does not start M5 work. It does not modify product code, package code, content-source data, tools, CI, accepted ADRs, roadmap files, acceptance-matrix files, prior gate docs, autonomous-goal docs, manifests, checksums, or validation reports.

## Process Evidence

| Evidence | Result |
| --- | --- |
| Current branch | `chore/m4-exit-gate` |
| Main baseline | `96abe397327a81e5922aed61c022255dc20f2baa` |
| Start checkpoint | `fbbba55f chore(process): start M4 exit validation` |
| First systems writer | `019f0389-b54a-7191-b5f2-0813f6bca0ad`; closed from `running`, no handoff or file changes |
| Second systems writer | `019f0396-8e7d-73b0-9384-52f7deed12fd`; closed from `running`, no handoff or file changes |
| Third systems writer | `019f03a0-2734-7250-a9fd-080899d5fde1`; closed from `running`, no handoff or file changes |
| QA reviewer | `019f0389-c958-75c2-aba8-64c6425531e0`, standby for independent read-only review |
| Human Gate | `project/goal-mode-state.json` remains `human_gate.required=false`; this gate does not decide manual battle, networking, telemetry, server, mod, or frozen product direction |

## M4 Dependency Evidence

| Workstream | Integrated evidence | Gate use |
| --- | --- | --- |
| `M4-CAMPAIGN-OBJECTIVES-001` | `CLOSED`; PR #84 at `ff2675e8b8222e9006df3e5a9848526d2edeaa85` | Campaign objectives, planning knowledge, target/status/reason scaffolds, and rainy-season forecast/cancellation evidence |
| `M4-MUSTER-PREP-COMMITMENTS-001` | `CLOSED`; PR #86 at `af5427ec99753dd2159c01327c47afe4a3e0bef5` | M3 troop obligations flow into M4 muster preparation and mobilized commitments |
| `M4-GRAIN-SUPPLY-001` | `CLOSED`; PR #88 at `ea0ebff0b0b861563acf0fedc409fa0d0d14a72f` | Grain reservation, consumption, release, shortage, and source-ledger accounting |
| `M4-ROUTE-TRANSPORT-CAPACITY-001` | `CLOSED`; PR #90 at `2431e897676838057d2e29201b0528b5ebbf29c2` | Route forecast, bottleneck capacity, monsoon risk, and read-only route planning |
| `M4-MARCH-SUPPLY-STATE-001` | `CLOSED`; PR #92 at `2ab85022eaa89e5ab3b4b1f421fe422beb4b38ff` | Daily march execution, predicted versus actual arrivals, supply state, and reinforcement timing |
| `M4-AUTO-ENGAGEMENT-SIEGE-001` | `CLOSED`; PR #94 at `b09cf6b7982f3644256a9422f824b2f2639bf000` | Automatic engagement, siege choice loop, event-tail save/load parsing, and player/AI command parity |
| `M4-WITHDRAWAL-POSTWAR-HANDOFF-001` | `CLOSED`; PR #96 at `2f155248f97dc192d0e0fa960021c5f425c26cf7` | Withdrawal, losses, war outcome, postwar candidate, and M3 governance preview handoff |
| `M4-CAMPAIGN-AI-001` | `CLOSED`; PR #98 at `d5cd9fa8cd4525dce68a705c4540d27453d38048` | Minimal AI wait, withdraw, reinforce, target-change, cancel, continue, and explanation traces |
| `M4-CLIENT-CAMPAIGN-PLANNING-UI-001` | `CLOSED`; PR #100 at `5efbf12ef69ce7a4bfb1ef647a584052528a7740` | React campaign planner, command DTO submission, forecast, AI reasons, war report, and stress fixture UI |
| `M4-DETERMINISM-REPLAY-001` | `CLOSED`; PR #102 at `83ecd0c07fbe29f0d449180c00710bb10568a105` | M4 replay determinism, combat replay hashes, and explicit M4 save boundary evidence |
| `M4-STRESS-VALIDATION-001` | `CLOSED`; PR #104 at `0eb040e9a3a32ec39e36f83e5d46df5f0cde3feb`; closure PR #105 at `96abe397327a81e5922aed61c022255dc20f2baa` | Monsoon, starvation, withdrawal, AI trace, scale stress, and two-plan/two-report campaign UI pressure evidence |

## Acceptance Matrix

| M4 matrix column | Evidence | Classification |
| --- | --- | --- |
| Product/design: campaign loop成立 | Campaign objective, muster, supply, route, march, engagement/siege, withdrawal, postwar, and client UI tasks are all closed with accepted handoffs and CI-backed integration. | PASS |
| Simulation/data: logistics and deterministic resolution | M4 deterministic replay hash evidence, focused M4 sim tests, save/load event-tail parsing, and full `pnpm sim:determinism` support authoritative repeatability. | PASS |
| Client/platform: planner and war report | Playwright covers campaign planning command submission, risk display, AI reasons, war report, and 4000-row stress fixture. Storybook and Web build pass. | PASS |
| QA/research: H-004/H-005-style evidence | Stress validation and AI traces provide prototype evidence for monsoon timing, cancellation, withdrawal, and explainable AI, but not final M5 player-study proof. | PASS_WITH_LIMITS |
| Process: required systems writer | Three systems writer threads were spawned and closed after stalls without handoff. This reconciliation is routed to independent QA rather than pretending a systems handoff exists. | PASS_WITH_LIMITS |

## Roadmap Exit Criteria

| M4 exit criterion | Evidence | Classification |
| --- | --- | --- |
| Player can complete or cancel a predicted campaign before rainy season and see forecast versus actual reasons. | `tests/sim-core-m4-campaign-objectives.test.ts` records rainy-season forecast reasons and cancellation day; `tests/sim-core-m4-withdrawal-postwar-handoff.test.ts` cancels before departure when rainy-season route risk closes the window; Playwright renders forecast risk reasons. | PASS |
| AI can explain waiting, withdrawal, and target changes. | `tests/sim-core-m4-campaign-ai.test.ts` covers wait with supply and season reasons, target change from visible knowledge, supply-collapse withdrawal, expired-plan cancellation, bounded deterministic trace ordering, and command parity. | PASS |
| War losses flow back into economy, loyalty, obligation/credit/reliability, and M3 postwar handoff paths. | M4 grain/muster tasks cover explicit source ledgers and commitments; auto engagement/siege records credit/reputation hooks and losses; withdrawal/postwar creates WarOutcome/PostwarCandidate DTOs consumable by M3 governance preview. | PASS |
| At least one battle/siege outcome can be replayed deterministically with the same seed and command sequence. | `pnpm sim:determinism` reports M4 node/worker hash `232f62ab`, engagement hash `334e0df0`, siege hash `ac35e97e`, withdrawal hash `232f62ab`, and one postwar candidate. | PASS |
| M4 remains bounded: no manual node battle, full diplomacy, complex naval warfare, telemetry, server, multiplayer, arbitrary-code mod, or M5 content. | Gate diff is limited to allowed docs/process/message paths; implementation tasks explicitly preserved the exclusions; Electron security check and package smoke do not add new capabilities. | PASS |

## Local Validation

| Command | Exit code | Key result |
| --- | ---: | --- |
| `pnpm install --frozen-lockfile` | 0 | All 16 workspace projects already up to date under pnpm 11.0.0. |
| `pnpm check` | 0 | Prettier, ESLint, recursive typecheck, and architecture boundary checks passed; boundary self-test produced 15 expected violations. |
| `pnpm test` | 0 | Architecture check and sim determinism passed; root Vitest 33 files / 240 tests passed; web Vitest 1 file / 4 tests passed. |
| `pnpm content:validate` | 0 | M1 manifest `4a438525`, M2 manifest `9ab72b0b`, and M3 manifest `76b75849` validated. |
| `pnpm sim:determinism` | 0 | Hello `61e0ba1c`, command/query `d275faa4`, save/load `28074edd`, M4 node/worker `232f62ab`, engagement `334e0df0`, siege `ac35e97e`, withdrawal `232f62ab`. |
| `pnpm sim:perf-baseline` | 0 | Node v24.13.1 on win32 x64; 3650 days; throughput 6706 days/sec; p50 112600 ns; p95 292500 ns; p99 717000 ns; saveByteLength 9980. |
| `pnpm build:web` | 0 | Vite production build passed; existing large chunk warning only. |
| `pnpm storybook:build` | 0 | Storybook build passed; existing large chunk warning only; output cleaned. |
| `pnpm desktop:security-check` | 0 | Electron security preferences passed; preload exposes only `monsoonDesktop`; renderer navigation and IPC remain restricted. |
| `pnpm desktop:package` | 0 | Desktop package smoke output created under `.tmp/desktop-package/MonsoonSovereigns-win32-x64`. |
| `pnpm test:e2e` | 0 | Playwright 6/6 passed, including M4 campaign planner and 4000-row stress fixture. |
| Focused M4 scenario Vitest command | 0 | 6 M4 sim test files / 55 tests passed. |
| `taskctl list` | 0 | All prior M4 tasks are `CLOSED`; M4 exit task was in progress before this reconciliation. |
| `taskctl ready` | 0 | No output while M4 exit task is active. |
| `git diff --check` | 0 | No whitespace errors. |

## Risks And Limits

| Risk | Status |
| --- | --- |
| Systems writer handoff is unavailable. | Non-product process limit. Three real systems writer threads were spawned and closed after stalls. QA must decide whether this reconciliation is acceptable or must request another systems review path. |
| H-004/H-005 evidence remains prototype validation, not final M5 proof. | Non-blocking for M4 because M4 asks for campaign/supply/AI/stress evidence, not final player-study acceptance. |
| Vite and Storybook report existing large chunk warnings. | Non-blocking; both commands exit 0 and no new production dependency or bundling architecture is introduced by this gate. |
| M5 formal passage is not granted by this gate. | Preserved. This gate does not create M5 tasks or start vertical-slice production. |

No P0/P1 data corruption risk, deterministic authority blocker, package-boundary blocker, security blocker, frozen-decision change, R4 Human Gate, forbidden-path modification, or reviewer rejection was found by the lead reconciliation.

## Conclusion

M4_GATE = PASS_WITH_LIMITS.

The implementation evidence satisfies the M4 roadmap and acceptance-matrix criteria with explicit limits around prototype H-004/H-005 evidence and the missing systems writer handoff. The next required action is PR integration, CI, main synchronization, and then task closure with the `PASS_WITH_LIMITS` process exception preserved. M5 work must not start from this document alone.
