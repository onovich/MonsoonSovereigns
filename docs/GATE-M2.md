# GATE-M2

Gate ID: GATE-M2
Task ID: M2-EXIT-VALIDATION-001
Decision date: 2026-06-25
Systems architect decision: M2_GATE = PASS
Branch/worktree: chore/m2-exit-gate
Main commit reviewed: aa5b2b17ab2984a7fefd15dfcd45f86ada5d65e7
Autonomy policy: MILESTONE-AUTONOMY-AMENDMENT-001 permits ordinary M1-M4 exits without a standalone Human Gate when the acceptance matrix, tests, independent reviewer handoffs, and no-R4/no-frozen-decision Human Gate conditions are satisfied. M5 remains a Human Gate.

## Result

The systems_architect gate evidence supports M2 exit as PASS and routes this record to `qa_reviewer` for independent acceptance. Formal milestone acceptance should not be marked complete until the qa_reviewer handoff returns `ACCEPT` and lead integration records the accepted gate on main.

This gate does not start M3 implementation, does not alter frozen product/platform/core architecture decisions, and does not modify product code, package code, content-source data, roadmap files, accepted ADRs, CI, prior gate files, manifests, checksums, or validation reports.

## Main Evidence

| Evidence | Result |
| --- | --- |
| Current branch | `chore/m2-exit-gate` |
| Current HEAD | `aa5b2b17ab2984a7fefd15dfcd45f86ada5d65e7` |
| `taskctl list` | All M2 dependencies for this gate are `CLOSED`; `M2-EXIT-VALIDATION-001` is `ACCEPTED` after systems review and independent QA acceptance. |
| `taskctl ready` | No dependency-ready task printed; M3 was not started. |
| Independent QA review | `qa_reviewer` handoff `M2-EXIT-VALIDATION-001__MSG-20260625-M2-GATE-QA-REVIEW__qa_reviewer.json` is `ACCEPT`, routed to `lead_orchestrator`. |
| Human Gate | `project/goal-mode-state.json` records `human_gate.required=false`; M5 remains the next formal milestone Human Gate. |
| R4 review risk | `M2-CLIENT-MAP-001` required R4 systems review, but the accepted handoff states no new ADR or architecture decision was made; it implements the existing frozen React/Pixi boundary. |

## Task Status Evidence

| Workstream | Status evidence | Gate use |
| --- | --- | --- |
| `M2-MAP-SOURCE-POLICY-001` | `taskctl list` reports `CLOSED`; QA handoff `M2-MAP-SOURCE-POLICY-001__MSG-20260624-M2-MAP-SOURCE-POLICY-QA-ACCEPT__qa_reviewer.json` is `ACCEPT`. | Synthetic map fixture policy is accepted; M2 fixture data is not formal historical content. |
| `M2-WORLD-FIXTURE-001` | `CLOSED`; systems handoff `M2-WORLD-FIXTURE-001__MSG-20260624-M2-WORLD-FIXTURE-SYSTEMS-REVIEW__systems_architect.json` is `ACCEPT`. | 30 District / 10 Settlement fixture, seasonal curves, route definitions, and deterministic manifest evidence exist. |
| `M2-CONTENT-GUARDS-001` | `CLOSED`; QA handoff `M2-CONTENT-GUARDS-001__MSG-20260624-M2-CONTENT-GUARDS-QA-REVIEW__qa_reviewer.json` is `ACCEPT`. | Bad M2 maps and bad references are rejected with structured errors. |
| `M2-BOOT-BOUNDARY-001` | `CLOSED`; systems R2 handoff `M2-BOOT-BOUNDARY-001__MSG-20260624-M2-BOOT-BOUNDARY-ARCH-REVIEW-2__systems_architect.json` is `ACCEPT`. | Closes M1 follow-up for sim-core/content-runtime boot-boundary contract testing. |
| `M2-ECON-POP-001` | `CLOSED`; systems handoff `M2-ECON-POP-001__MSG-20260625-M2-ECON-POP-SYSTEMS-ARCHITECT-ACCEPT__systems_architect.json` is `ACCEPT`. | Agriculture, labor, population, grain, cash, command path, and scaffold conservation evidence. |
| `M2-ROUTE-TRANSPORT-001` | `CLOSED`; systems handoff `M2-ROUTE-TRANSPORT-001__MSG-20260625-M2-ROUTE-TRANSPORT-SYSTEMS-ARCHITECT-ACCEPT__systems_architect.json` is `ACCEPT`. | Seasonal road/river route choice and route-capacity invariants are accepted. |
| `M2-CLIENT-DISTRICT-LIST-001` | `CLOSED`; QA handoff `M2-CLIENT-DISTRICT-LIST-001__MSG-20260625-M2-CLIENT-DISTRICT-LIST-QA-ACCEPT__qa_reviewer.json` is `ACCEPT`. | District panel, 4,000-row list fixture, virtualization, sort/filter/selection evidence. |
| `M2-CLIENT-MAP-001` | `CLOSED`; systems R4 handoff `M2-CLIENT-MAP-001__MSG-20260625-M2-CLIENT-MAP-SYSTEMS-REVIEW-R4__systems_architect.json` is `ACCEPT`. | MapRenderer/Pixi-owned map, zoom, selection, map modes, route previews, and React boundary evidence. |
| `M2-PRESSURE-VALIDATION-001` | `CLOSED`; QA handoff `M2-PRESSURE-VALIDATION-001__MSG-20260625-M2-PRESSURE-QA-REVIEW__qa_reviewer.json` is `ACCEPT`. | H-001/H-002 initial pressure evidence, normal-speed UI long-task evidence, and 4,000-row evidence are accepted with scale limits. |
| `M2-SAVE-RUNTIME-001` | `CLOSED`; systems handoff `M2-SAVE-RUNTIME-001__MSG-20260625-M2-SAVE-RUNTIME-SYSTEMS-REVIEW__systems_architect.json` is `ACCEPT`. | Explicit M2 runtime save/load support closed the M2 save persistence risk before host canary and exit claims. |
| `M2-HOST-HASH-CANARY-001` | `CLOSED`; QA R3 handoff `M2-HOST-HASH-CANARY-001__MSG-20260625-M2-HOST-HASH-CANARY-QA-REVIEW-R3__qa_reviewer.json` is `ACCEPT`. | Closes M1 follow-up for real Chromium and Electron host hash canaries. |

## Acceptance Matrix

| M2 matrix column | Evidence | Classification |
| --- | --- | --- |
| Product/design: season and economy form choices | `M2-ECON-POP-001` adds deterministic agriculture phases, labor commitment, population, grain, cash, and market scaffold. `M2-ROUTE-TRANSPORT-001` makes seasonal regional curves affect road and river route costs/capacities. | PASS |
| Simulation/data: agriculture, population, road-network conservation | `tests/sim-core-m2-economy-population.test.ts` covers non-negative population, available plus committed labor equals working people, non-negative grain/cash, and mobilization accounting. `tests/sim-core-m2-route-transport.test.ts` covers capacity, duplicate-edge invariants, deterministic preview equality, and no state mutation from previews. | PASS |
| Client/platform: map and list behavior | `M2-CLIENT-DISTRICT-LIST-001` QA accepted the read-model district panel, 4,000-row synthetic fixture, bounded virtualization, filtering, sorting, and selection handoff. `M2-CLIENT-MAP-001` R4 systems review accepted visible MapRenderer/Pixi ownership, zoom, district/settlement selection, seasonal/economy/routes modes, route previews, and controlled mount lifecycle. | PASS |
| QA/research: H-001/H-002 initial validation and map source policy | `M2-PRESSURE-VALIDATION-001` QA accepted H-001/H-002 as initial evidence only. `M2-MAP-SOURCE-POLICY-001` QA accepted the synthetic-fixture source policy and provenance rules. | PASS_WITH_LIMITS |

## Roadmap Exit Criteria

| M2 exit criterion | Evidence | Classification |
| --- | --- | --- |
| Mobilization across farm timing affects the next harvest | Direct test `tests/sim-core-m2-economy-population.test.ts` includes `mobilizing labor during farm timing reduces the next harvest in the M2 fixture`, checks the mobilized harvest is positive and less than the baseline, and validates the resulting world state. | PASS |
| Seasonal roads/rivers produce different route choices | Direct test `tests/sim-core-m2-route-transport.test.ts` includes `seasonal curves change a fixture route choice between road and river`; dry route uses five road edges and wet route uses one river edge with lower total cost. | PASS |
| Normal-speed UI has no main-thread simulation stutter | `M2-PRESSURE-VALIDATION-001` QA accepted a Playwright long-task smoke with `derivationMs=0.1`, `selectionMs=0`, `longTaskCount=0`, and `maxLongTaskMs=0`, alongside Chromium map/list smoke. This is scoped to current normal-speed M2 UI evidence, not a future full-scale release proof. | PASS_WITH_LIMITS |
| Content compiler rejects bad maps and bad references | `M2-CONTENT-GUARDS-001` QA accepted negative coverage for malformed/zero-area polygons, invalid anchors, duplicate stable IDs, disconnected district route graph, invalid route endpoints, cross-content refs, localization key mismatches, and provenance shape errors. | PASS |

## M1 Follow-Ups

| Follow-up | Evidence | Result |
| --- | --- | --- |
| Chromium plus Electron host hash canary | `M2-HOST-HASH-CANARY-001` R3 QA accepted real Chromium Dedicated Worker and packaged Electron renderer/Worker canaries. Both matched Node baseline hashes: hello `61e0ba1c`, command/query `d275faa4`, save/load `28074edd`, save byte length `10920`. Electron security remained narrow: no new IPC, no Node integration, no broad filesystem authority. | CLOSED |
| sim-core/content-runtime boot-boundary contract test | `M2-BOOT-BOUNDARY-001` R2 systems review accepted boot DTO validation and regression tests. sim-core receives a plain runtime content-pack DTO, validates it internally, rejects mixed/invalid payloads before runtime/hash, and does not import content-runtime/content-source or host/presentation APIs. | CLOSED |

## Existing Validation Evidence

This section cites accepted M2 task handoffs. These commands were run by the task owners/reviewers recorded in those handoffs, not by this gate writer.

| Evidence source | Key accepted command evidence |
| --- | --- |
| `M2-ECON-POP-001` | `pnpm --filter @monsoon/sim-core test` passed 8 files / 41 tests; property/invariant coverage includes M2 agriculture, population, labor, grain, cash, and harvest impact. `pnpm test`, `pnpm check`, `pnpm sim:determinism`, and protocol tests passed. |
| `M2-ROUTE-TRANSPORT-001` | `pnpm --filter @monsoon/sim-core test` passed 9 files / 45 tests, including seasonal road/river choice, capacity-exceeded preview, duplicate route edge invariant, and no state hash mutation from preview queries. |
| `M2-CLIENT-DISTRICT-LIST-001` | Client-core/UI tests covered 4,000-row synthetic fixture, filtering/sorting, virtual window, and district panel fields. Playwright Chromium passed the 4,000-row virtualized district list, filtering, sorting, selection handoff, and timing assertions. |
| `M2-CLIENT-MAP-001` | MapRenderer tests passed; Chromium Playwright passed map load, zoom, district/settlement selection, seasonal/economy/routes mode switching, route previews, selected details, and renderer mount state. |
| `M2-PRESSURE-VALIDATION-001` | `pnpm sim:perf-baseline` recorded 3,650 days, throughput 15,581 days/sec, p99 141,600 ns on Windows/Node 24.13.1; UI 4,000-row fixture rendered 16 visible rows; long-task smoke recorded zero long tasks. |
| `M2-CONTENT-GUARDS-001` | Content schema/tools/runtime tests passed; explicit negative mutation command returned expected `code:path` pairs for bad maps and bad references; valid M2 fixture still compiled deterministically with manifestHash `9ab72b0b`. |
| `M2-SAVE-RUNTIME-001` | Save-format and sim-core tests passed; M2 economy/population/agriculture/market/route/transport state round-tripped through save/load and reproduced the saved state hash; malformed/future/cross-manifest M2 data rejected before runtime replacement. |
| `M2-HOST-HASH-CANARY-001` | `pnpm --filter @monsoon/sim-runner sim:host-hash-canary -- --browser electron` and `--browser chromium` matched Node baseline hashes; desktop security/package paths passed with and without generated web dist. |

## Local Validation By This Gate Writer

This replacement systems_architect did not run the heavy pnpm validation suite; lead runs or integrates that separately. The commands below are the commands personally run in this thread before routing to QA.

| Command | Exit code | Key result |
| --- | ---: | --- |
| `git status --short` | 0 | Before this writer's edits, worktree already had modified coordination files: `project/goal-mode-state.json`, `project/model-routing-state.json`, `project/tasks/active/M2-EXIT-VALIDATION-001.json`, and `project/tasks/thread-registry.json`. |
| `node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs validate M2-EXIT-VALIDATION-001` | 0 | `VALID D:\WebProjects\MonsoonSovereigns\project\tasks\active\M2-EXIT-VALIDATION-001.json`. |
| `node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs list` | 0 | All M2 dependency tasks listed above are `CLOSED`; `M2-EXIT-VALIDATION-001` is `IN_PROGRESS`. |
| `node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs ready` | 0 | No output; no next task is ready from this writer thread. |
| `git status --short` | 0 | After this writer's edits, worktree contains the pre-existing modified coordination files plus new `docs/GATE-M2.md` and this systems handoff under `project/messages/outbox`. |
| `node -e JSON validation for M2 gate task, goal-mode-state, model-routing-state, thread registry, cited M2 handoffs, and systems handoff` | 0 | `JSON validation ok files=16 handoffs=12`. |
| `node .agents/skills/monsoon-studio-orchestrator/scripts/validate-handoff.mjs project/messages/outbox/M2-EXIT-VALIDATION-001__MSG-20260625-M2-GATE-SYSTEMS-REVIEW__systems_architect.json` | 0 | `VALID D:\WebProjects\MonsoonSovereigns\project\messages\outbox\M2-EXIT-VALIDATION-001__MSG-20260625-M2-GATE-SYSTEMS-REVIEW__systems_architect.json`. |
| `git diff --check` | 0 | No whitespace errors. |

## Lead Integration Validation

These commands were run by `lead_orchestrator` on branch `chore/m2-exit-gate` after the systems writer handoff and before QA routing.

| Command | Exit code | Key result |
| --- | ---: | --- |
| `git status --short --branch` | 0 | Branch `chore/m2-exit-gate`; modified coordination files plus new `docs/GATE-M2.md` and systems handoff. |
| `node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs validate M2-EXIT-VALIDATION-001` | 0 | Gate task JSON is valid. |
| `node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs list` | 0 | All M2 dependency tasks are `CLOSED`; `M2-EXIT-VALIDATION-001` is `IN_PROGRESS`. |
| `node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs ready` | 0 | No output while the gate task is in progress; M3 was not started. |
| `node -e JSON validation for task/state/routing/thread registry` | 0 | Parsed task, goal-mode state, model-routing state, and registry; registry has 58 unique thread IDs. |
| `node .agents/skills/monsoon-studio-orchestrator/scripts/validate-handoff.mjs project/messages/outbox/M2-EXIT-VALIDATION-001__MSG-20260625-M2-GATE-SYSTEMS-REVIEW__systems_architect.json` | 0 | Systems handoff is schema-valid. |
| `pnpm install --frozen-lockfile` | 0 | All 16 workspace projects already up to date under pnpm 11.0.0. |
| `pnpm check` | 0 | Prettier, ESLint, recursive typecheck, and architecture boundary checks passed; architecture self-test produced 15 expected violations. |
| `pnpm test` | 0 | Architecture and determinism passed; root Vitest 19 files / 91 tests passed; web Vitest 1 file / 3 tests passed; known `MODULE_TYPELESS_PACKAGE_JSON` warning remains non-blocking. |
| `pnpm content:validate` | 0 | Content validation passed for `m1.abstract-graph-30`; nodes=30, edges=60, manifestHash `4a438525`. |
| `pnpm sim:determinism` | 0 | Node and worker-compatible hashes matched: hello `61e0ba1c`, command/query `d275faa4`, save/load `28074edd`; save byte length `10920`. |
| `pnpm sim:perf-baseline` | 0 | 3650-day baseline completed; finalDay=3650, finalRevision=3650, throughput 14165 days/sec, p99 192300 ns, save byte length 9980. |
| `pnpm --filter @monsoon/client-core test` | 0 | 4,000-row synthetic pressure fixture/read-model tests passed: 1 file / 5 tests. |
| `pnpm --filter @monsoon/ui test` | 0 | 4,000-row UI virtualized list SSR tests passed: 1 file / 3 tests. |
| `pnpm build:web` | 0 | Vite production build completed with `index.html` and `host-hash-canary.html`; existing chunk-size warning remains non-blocking. |
| `pnpm desktop:security-check` | 0 | Electron security preferences passed; preload exposes only `monsoonDesktop`; navigation restricted; IPC allowlist is `desktop:getRuntimeInfo`, `desktop:setFullscreen`. |
| `pnpm desktop:package` | 0 | Windows desktop smoke package generated at `.tmp/desktop-package/MonsoonSovereigns-win32-x64`; renderer web assets copied. |
| `pnpm --filter @monsoon/sim-runner sim:host-hash-canary -- --browser chromium` | 0 | Chromium Dedicated Worker hashes matched Node baseline: hello `61e0ba1c`, command/query `d275faa4`, save/load `28074edd`, save byte length `10920`. |
| `pnpm --filter @monsoon/sim-runner sim:host-hash-canary -- --browser electron` | 0 | Electron renderer Dedicated Worker hashes matched Node baseline: hello `61e0ba1c`, command/query `d275faa4`, save/load `28074edd`, save byte length `10920`. |

## Architecture And Scope Notes

- `packages/sim-core` remains decoupled from React, PixiJS, Electron, DOM, Node filesystem IO, and real-time authority APIs in accepted M2 evidence.
- Authoritative state changes remain inside sim-core/Worker authority paths; UI and renderer evidence uses read models, MapRenderer deltas, and presentation caches.
- Player and AI labor mobilization use the same versioned `GameCommand` path, `sim.commit-labor`.
- M2 save/load is now explicit serializable DTO/schema work, not object graph serialization.
- The M2 map fixture is synthetic `FICTIONAL` validation data under `docs/research/m2-map-fixture-source-policy.md`; it is not formal historical map content.
- This gate writer made no product code, package code, content-source, roadmap, accepted ADR, CI, prior gate, manifest, checksum, or validation-report change.

## Risks

| Risk | Status |
| --- | --- |
| H-001 is initial pressure evidence only, not the final long-term 4,000-character / 2,500-district / 500-army / 10,000-route-edge target. | Non-blocking for M2 because the acceptance matrix asks for initial H-001/H-002 evidence. Do not overstate as full-scale release proof. |
| H-002 4,000-row proof is synthetic UI fixture evidence plus Chromium M2 shell smoke, not a final live worker projection stress test. | Non-blocking for M2; future live projection work needs renewed pressure evidence if the read-model shape changes. |
| `M2-CLIENT-MAP-001` still uses a protocol-shaped client fixture until live worker query integration is scheduled. | Non-blocking; accepted handoff states no full WorldState import into React/Redux and no hidden formula duplication. |
| Existing Vite dynamic import warning and Node `MODULE_TYPELESS_PACKAGE_JSON` warning appear in accepted task evidence. | Non-blocking; tests pass and warnings are pre-existing. |
| Pre-existing coordination-file modifications were present before this gate writer edited files. | Non-blocking; they are allowed-path coordination files and were not changed by this writer unless separately noted by lead. |

No P0/P1 data corruption risk, package-boundary blocker, security blocker, frozen-decision change, R4 Human Gate, or reviewer rejection was found.

## Conclusion

M2_GATE = PASS.

The evidence satisfies the M2 roadmap exit criteria and milestone acceptance matrix with the explicit H-001/H-002 initial-evidence limits above. Independent `qa_reviewer` review returned `ACCEPT`. The next required action is lead integration through PR/CI/main and then a closure update; M3 work must not begin until formal M2 closure is recorded on main.
