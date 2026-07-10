# RR0 Production / Fixture / No-op Runtime Audit

Task: `RR0-PRODUCTION-FIXTURE-NOOP-AUDIT-001`
Role: `systems_architect` writer
Branch/worktree: `D:/WebProjects/MonsoonSovereigns-rr0-roadmap-adoption @ codex/rr0-production-fixture-noop-audit-001`
Baseline: `origin/main` = `7878027f2211cc2421e1cee56a8b2dae2deb8f0b`
Audit date: 2026-07-10

## Scope And Method

This audit is read-only for product code. It distinguishes:

- **Fact**: directly observed file/symbol/line evidence.
- **Inference**: conclusion drawn from call graph or absence of production callers.
- **Production-wired**: loaded by a normal product entrypoint, not only tests or gated smoke modes.
- **Fixture-only**: data or runtime state is prebuilt, scripted, synthetic, or projected from fixture scripts.
- **Test-only**: used by Vitest, Playwright, Node runner, canary, or package smoke.
- **Demo-only**: explicit demo/canary host path, not normal product shell.
- **No-op**: handler intentionally discards input or a required surface has no implementation.
- **Client-local success**: UI reports progress/success by local React state without an authoritative runtime accept/reject.
- **Ambiguous**: code exists, but production runtime ownership cannot be proven from static evidence alone.

The R1 Roadmap target is not implemented here. No product code, package code, tests, content, CI, roadmap, or status files were modified by this audit.

## High-Risk Conclusions

1. **The normal Web entrypoint is not an authoritative Simulation Worker host.**
   - Fact: `apps/web/index.html:10` loads `/src/main.tsx`; `apps/web/src/main.tsx:13-16` renders `<WebClientShell />`.
   - Fact: `apps/web/src/shell/create-shell-snapshot.ts:22-30` synchronously calls `runHelloSimulationInWorkerCompatibleAdapter(...)` and then `createM7TopologyClientReadModelSnapshot(...)`.
   - Fact: `apps/web/src/worker/hello-simulation-adapter.mjs:20-45` exports direct function wrappers over sim-core routines; it does not contain `postMessage` or a message loop.
   - Fact: repository search for production Web `new Worker` found only host-hash canary at `apps/web/src/host-hash-canary/host-hash-canary-main.ts:41-43`.
   - Inference: the Web production path uses a synchronous adapter plus fixture/projected read models, not the R1-required boot/query/preview/submit/save/load Worker protocol roundtrip.

2. **M3-M6 UI command success is client-local, not runtime acceptance.**
   - Fact: `apps/web/src/shell/web-client-shell.tsx:125-142` receives M3-M6 commands, executes `void command`, and sets local translated status text.
   - Fact: `packages/ui/src/index.tsx:455-477`, `533-541`, and `563-622` build M3/M4 `GameCommandV1` values and pass them upward.
   - Fact: `packages/ui/src/index.tsx:640-653` and `722-739` advance M5/M6 local confirmed counts and phases after invoking the callback.
   - Inference: UI command DTO generation is real, but normal Web runtime does not prove `submitCommandV1` acceptance, rejection, or state-hash change.

3. **M5/M6 client save/load is a local session checkpoint, not the authoritative Save Envelope.**
   - Fact: `packages/ui/src/index.tsx:666-688` and `742-764` save/load M5/M6 session state by calling client-core helpers and setting React state.
   - Fact: `packages/client-core/src/index.ts:3711-3728` and `4195-4215` produce JSON strings for client session saves; these are not `SaveEnvelopeV1` bytes.
   - Fact: authoritative `requestSaveV1` / `loadSaveV1` exist in `packages/sim-core/src/command-query-v1.ts:1493-1650`.
   - Inference: save/load capability exists below, but normal Web/Electron client paths do not use it.

4. **Electron is currently a secure shell/smoke host, not a desktop game-state adapter.**
   - Fact: `apps/desktop/src/main/main.ts:48-57` registers only runtime-info and fullscreen IPC.
   - Fact: `apps/desktop/src/preload/preload.cts:12-20` exposes only `getRuntimeInfo` and `setFullscreen`.
   - Fact: `packages/platform/src/index.ts:29-37` declares a fuller `PlatformAdapter` including save/import/export, but those channels are not implemented in desktop main/preload.
   - Inference: Electron file save/load adapter remains bottom/API intent, not production wiring.

5. **The sim-core/protocol/save bottom layer is substantive and decoupled, but most R1 client runtime wiring is missing.**
   - Fact: protocol defines `SimulationMessageV1` for boot/preview/submit/query/request-save/load-save at `packages/protocol/src/index.ts:1760-1798`.
   - Fact: sim-core implements `bootSimulationV1`, `previewCommandV1`, `submitCommandV1`, `querySimulationV1`, `requestSaveV1`, and `loadSaveV1` at `packages/sim-core/src/command-query-v1.ts:1380-1650`.
   - Fact: `packages/sim-core/package.json` depends only on `@monsoon/save-format` and `@monsoon/protocol`.
   - Inference: this is an integration gap rather than a domain-core absence.

## Evidence Matrix

| Surface | Production entry / observed path | Evidence | Classification | Bottom capability exists but client production path is not wired? | Fact vs inference |
|---|---|---|---|---|---|
| Web root shell | Browser loads the React shell from `index.html` and renders `WebClientShell`. | `apps/web/index.html:10`; `apps/web/src/main.tsx:13-16` | production-wired | Yes for UI shell; no proof of authoritative sim host here. | Fact: shell is production-wired. Inference: this entry alone does not boot Simulation Worker. |
| Web boot snapshot | Shell initializes from local snapshot creation, hello adapter, and M7 topology fixture. | `apps/web/src/shell/web-client-shell.tsx:50-52`; `apps/web/src/shell/create-shell-snapshot.ts:22-35`; `packages/client-core/src/index.ts:2223-2281` | fixture-only | Yes. `bootSimulationV1` exists but is not called by this path. | Fact: default snapshot is built locally. Inference: production client state is not Worker-owned. |
| Web dedicated Worker | Dedicated Worker exists only in host-hash canary page. | `apps/web/host-hash-canary.html:18`; `apps/web/src/host-hash-canary/host-hash-canary-main.ts:41-55`; `apps/web/src/host-hash-canary/compute-host-hash-canary.ts:25-44` | demo-only | Yes. It exercises canary scripts, not live game commands. | Fact: Worker exists. Inference: canary does not make normal Web shell a Worker host. |
| Simulation Worker protocol | Protocol message shape exists for boot/preview/submit/query/save/load. | `packages/protocol/src/index.ts:1760-1798`; parser branches at `packages/protocol/src/index.ts:3328-3408` | ambiguous | Yes. No production Web caller found. | Fact: schema/parser exists. Inference: missing adapter/transport in production client. |
| sim-core runtime authority | Runtime APIs implement boot, preview, submit, query, request-save, load-save. | `packages/sim-core/src/command-query-v1.ts:1380-1458`; `1493-1650` | test-only | Yes. Capability exists but normal Web/Electron does not call it. | Fact: APIs exist. Inference: R1 should wire these through a Worker port. |
| sim-core decoupling | sim-core package depends on protocol and save-format, not UI/platform packages. | `packages/sim-core/package.json` dependencies; targeted search found no React/Pixi/Electron/DOM/Node fs imports in sim-core source, only false-positive local names like `windowError`. | production-wired | No gap for decoupling; this boundary should be preserved. | Fact: package manifest and search evidence. |
| Client read model delta | Client read-model delta supports only hello-result or full replace. | `packages/client-core/src/index.ts:2055-2063`; `2522-2539` | fixture-only | Yes. No streamed Worker delta protocol is wired into Web shell. | Fact: delta union is narrow. Inference: no live read-model delta merge path in production shell. |
| Map/Pixi surface | Web mounts Pixi map renderer with a read-model snapshot and viewport. | `apps/web/src/shell/web-client-shell.tsx:240-247`; `212-216` applies `replace-read-model`. | production-wired | Partly. Rendering is wired, but authoritative map/read model source is fixture/projected. | Fact: Pixi render is production-wired. Inference: renderer is not authority. |
| M3 appointment command | UI builds `sim.appoint-office` and bulk appointment DTOs, but shell discards them. | Builders: `packages/client-core/src/index.ts:2914-2957`; UI calls: `packages/ui/src/index.tsx:455-477`, `533-541`; shell: `apps/web/src/shell/web-client-shell.tsx:125-128` | client-local success | Yes. `submitCommandV1` supports M3 commands, but Web shell handler does not submit. | Fact: command object is created and discarded. Inference: success text is not authoritative acceptance. |
| M4 campaign commands | UI builds create/cancel/start-march/siege/withdrawal DTOs, but shell discards them. | Builders: `packages/client-core/src/index.ts:3476-3591`; UI calls: `packages/ui/src/index.tsx:563-622`; shell: `apps/web/src/shell/web-client-shell.tsx:130-133` | client-local success | Yes. sim-core M4 runtime exists and Node runner exercises M4 replay, but Web shell does not submit. | Fact: command object is created and discarded. |
| M5 preview/confirm | M5 workspace uses scripted commands and local phase/index updates. | Fixture: `packages/client-core/src/index.ts:3608-3708`; UI preview/confirm: `packages/ui/src/index.tsx:632-653`; shell: `apps/web/src/shell/web-client-shell.tsx:135-138`; E2E asserts local attributes at `tests/e2e/web-shell.spec.ts:1129-1181` | client-local success | Yes. `runM5PlayableLoopV1` exists but Web UI does not call it. | Fact: React state advances. Inference: no live state hash change occurs on confirm. |
| M6 preview/confirm | M6 workspace uses scripted commands and local phase/index updates. | Fixture: `packages/client-core/src/index.ts:3794-3943`; UI preview/confirm: `packages/ui/src/index.tsx:714-739`; shell: `apps/web/src/shell/web-client-shell.tsx:140-143`; E2E asserts local attributes at `tests/e2e/web-shell.spec.ts:1183-1255` | client-local success | Yes. `runM6AlphaStartToVictoryLoopV1` exists but Web UI does not call it. | Fact: React state advances. Inference: no live submit/query/save loop in browser. |
| M7 client commands | M7 UI changes scenario/surface only; no submitted command type or callback was found. | `packages/ui/src/index.tsx:771-776`; `rg -n 'ClientM[34567].*SubmittedCommand|SubmittedCommand' ...` finds M3-M6 submitted types at `packages/client-core/src/index.ts:1071-1204`, no M7 submitted command type. | no-op | Yes for lower M1-M6 commands; no M7 command path is present. | Fact: local selection handlers only. Inference: M7 is guidance/content surface, not command runtime. |
| Web save/load | M5/M6 save/load uses client session JSON and React state. | M5 UI: `packages/ui/src/index.tsx:666-688`; M6 UI: `packages/ui/src/index.tsx:742-764`; helpers: `packages/client-core/src/index.ts:3711-3748`, `4195-4235` | client-local success | Yes. sim-core Save Envelope exists at `packages/sim-core/src/command-query-v1.ts:1493-1650`. | Fact: local session helpers. Inference: not authoritative save/load. |
| Electron default shell | Default desktop entry loads static `renderer/index.html`; Web build only when `MONSOON_SMOKE_WEB=1`; canary when `MONSOON_HOST_HASH_CANARY=1`. | `apps/desktop/src/main/main.ts:19-20`; `86-92`; static renderer `apps/desktop/renderer/renderer.js:15-18` | production-wired for security shell; demo-only/test-only for Web smoke/canary | Yes. Desktop does not own game-state IO. | Fact: env-gated entry selection. |
| Electron IPC / platform adapter | Platform adapter declares save/import/export; desktop IPC exposes only runtime info/fullscreen. | Adapter type: `packages/platform/src/index.ts:29-37`; main IPC: `apps/desktop/src/main/main.ts:48-57`; preload bridge: `apps/desktop/src/preload/preload.cts:12-20` | no-op for save/load IO | Yes. Electron file adapter is not implemented. | Fact: channel list mismatch. |
| Desktop package smoke | Smoke runs packaged app in `MONSOON_SMOKE_WEB=1` and checks local M5 controls/status. | `apps/desktop/scripts/package-smoke.mjs:19-24`; `31-41`; `95-126`; import/export controls are only counted at `55-58`. | test-only | Yes. Smoke validates UI mount/local checkpoint, not authoritative file save/load. | Fact: smoke is env-gated and checks local text/attributes. |
| Node runner / worker_threads | Node runner validates sim-core canaries and M5/M6 loops, including worker_threads for M5/M6. | `apps/sim-runner/src/run-determinism.mjs:1-18`; `113-175`; worker_threads at `177-240`; worker files call sim-core at `apps/sim-runner/src/m5-playable-loop-worker.mjs:1-25`, `apps/sim-runner/src/m6-alpha-loop-worker.mjs:1-25` | test-only | Yes. Strong bottom evidence, not Web product wiring. | Fact: runner is Node-only test/validation path. |
| Command/query canary | Canary compares Node and worker-compatible adapter hashes. | `apps/sim-runner/src/run-determinism.mjs:46-82`; `apps/web/src/host-hash-canary/compute-host-hash-canary.ts:25-44` | test-only | Yes. Canary does not expose an interactive command port. | Fact: canary scripts are deterministic checks. |
| Time control | No Web/UI/client/protocol/sim/desktop `setSpeed`, `SimulationSpeed`, `auto-pause`, `1x`, `2x`, or `4x` symbols found. `sim.advance-day` exists. | Negative command: `rg -n "setSpeed|SimulationSpeed|auto-pause|auto pause|\\b1x\\b|\\b2x\\b|\\b4x\\b" apps/web/src packages/ui/src packages/client-core/src packages/protocol/src packages/sim-core/src apps/desktop/src apps/desktop/renderer` => exit 1. Advance-day: `packages/protocol/src/index.ts:162-164`, `721-722`; sim handler `packages/sim-core/src/command-query-v1.ts:2201-2331`. | no-op | Yes. Day-advance command exists, but R1 pause/1x/2x/4x/autopause client control is absent. | Fact: no symbols found; advance-day exists. Inference: no production time-control surface. |
| Save Envelope / save-format | Save DTO/envelope supports authoritative snapshot and command tail. | `packages/save-format/src/index.ts:1334-1363` DTO fields; sim save/load API at `packages/sim-core/src/command-query-v1.ts:1493-1650` | test-only | Yes. Web/Electron client paths do not call this. | Fact: save format exists. Inference: R1 needs adapter wiring. |
| Storybook / fixture variants | Stories render WebClientShell with fixture query modes and locale/debug variants. | `.storybook/WebClientShell.stories.tsx:8-25`; `65-75`; `81-99`; `139-157`; `240-258` | fixture-only | Not directly; this is expected coverage surface. | Fact: fixture variants are Storybook-only. |
| Playwright Web shell | E2E exercises normal URL and fixture/debug query modes, asserting DOM/Pixi/local state. | Normal load: `tests/e2e/web-shell.spec.ts:116-205`; M5/M6 local flows: `1129-1255`; fixture query modes at `1535`, `1638` | test-only | Yes. Tests do not prove Worker protocol roundtrip. | Fact: tests assert local DOM attributes/text. |

## R1-Relevant Gap List

These are audit findings only, not implementation tasks:

1. Add a real production `SimulationPort`/Worker adapter for Web boot, preview, submit, query, save, load, restart, and error recovery.
2. Replace `WebClientShell` M3-M6 `void command` handlers with submit/preview/query paths that use authoritative results.
3. Replace M5/M6 local session checkpoint helpers with Save Envelope bytes and platform storage adapters.
4. Implement browser storage and Electron file-backed save/import/export through the same save-format boundary.
5. Add explicit time controls only through authoritative command/runtime semantics, not local UI phase changes.
6. Keep sim-core decoupled from React/Pixi/Electron/Node IO; add integration in adapters, not domain packages.

## Supporting Read-Only Commands

Commands run during the audit to support the matrix:

- `git status --short` => exit 0, no output before audit writes.
- `git branch --show-current` => exit 0, `codex/rr0-production-fixture-noop-audit-001`.
- `git rev-parse origin/main` => exit 0, `7878027f2211cc2421e1cee56a8b2dae2deb8f0b`.
- `rg -n --glob '!project/**' 'new Worker|Worker\\(|postMessage|onmessage|addEventListener\\(\"message|simulation\\.boot|simulation\\.submit-command|simulation\\.preview-command|simulation\\.request-save|simulation\\.load-save|SimulationMessageV1' apps packages tests .storybook` => exit 0; production Web `new Worker` only in host-hash canary, Node worker_threads in sim-runner/tests, protocol message type in protocol package.
- `rg -n 'ClientM[34567].*SubmittedCommand|SubmittedCommand|create.*Submitted|to.*Command|commandStatus|onM[34567]CommandSubmit|M7.*Command|m7.*command|M7.*submitted' packages/client-core/src/index.ts packages/ui/src/index.tsx apps/web/src/shell/web-client-shell.tsx` => exit 0; M3-M6 submitted types/callbacks found, no M7 submitted command path found.
- `rg -n "setSpeed|SimulationSpeed|auto-pause|auto pause|\\b1x\\b|\\b2x\\b|\\b4x\\b" apps/web/src packages/ui/src packages/client-core/src packages/protocol/src packages/sim-core/src apps/desktop/src apps/desktop/renderer` => exit 1; no matching time-control symbols.
- `rg -n "react|pixi|electron|node:|\\bfs\\b|document|window|Date\\.now|Math\\.random|new Date|performance\\.now|@monsoon/(ui|map-renderer|platform|client-core)" packages/sim-core/src packages/sim-core/package.json` => exit 0 with only false-positive identifiers such as `windowError` / topology `node`; no forbidden imports observed.
