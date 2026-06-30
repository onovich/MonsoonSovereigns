# 项目状态与决定快照

## 1. 当前阶段

项目处于 **M5 / Playable Vertical Slice**。

M0 Gate 已通过，见 `docs/GATE-M0.md`：

- `FOUNDATION-001` 至 `FOUNDATION-008` 均已进入 `CLOSED`。
- `origin/main` 已包含 M0 工程基线、Codex 编排演练、模型路由修订、PR/nightly CI 与可追溯 artifact。
- M0 Gate 经 `systems_architect` 与 `qa_reviewer` 独立验收为 `ACCEPT`。
- Product owner approval：`M0-EXIT-AND-M1-AUTONOMOUS-ENTRY-001`。

M1 阶段的执行重点曾是按 Roadmap 建立确定性模拟内核；该阶段不得扩写正式玩法内容、历史数据库、完整经济/人口/战争系统或未批准的生产依赖。

M1 Gate 已通过，见 `docs/GATE-M1.md`：

- `SIM-001` 至 `SIM-006` 均已进入 `CLOSED`。
- `origin/main` 已包含确定性 WorldState、GameDay scheduler、Command/Event/Query v1、确定性 RNG、Content Compiler v0、Save Envelope v1、M1 golden fixtures 与 3650-day baseline。
- M1 Gate 经 `systems_architect` 与 `qa_reviewer` 独立验收为 `ACCEPT`。
- M1 Gate 记录了非阻塞 follow-up：在 M2 exit 前补显式 Chromium + Electron host hash canary，并在 M2 内容/世界集成时补 sim-core/content-runtime boot-boundary contract test。

M2 Gate 已通过，见 `docs/GATE-M2.md`：

- `M2-TASK-GRAPH-001`、`M2-MAP-SOURCE-POLICY-001`、`M2-WORLD-FIXTURE-001`、`M2-CONTENT-GUARDS-001`、`M2-BOOT-BOUNDARY-001`、`M2-ECON-POP-001`、`M2-ROUTE-TRANSPORT-001`、`M2-CLIENT-DISTRICT-LIST-001`、`M2-CLIENT-MAP-001`、`M2-PRESSURE-VALIDATION-001`、`M2-SAVE-RUNTIME-001`、`M2-HOST-HASH-CANARY-001` 与 `M2-EXIT-VALIDATION-001` 均已进入 `CLOSED`。
- `origin/main` 已包含 M2 30 District/10 Settlement fixture、map source policy、content guards、boot-boundary contract、economy/population scaffold、route/transport preview、district list pressure panel、map renderer surface、pressure validation、M2 save runtime、Chromium/Electron host hash canary 与 M2 Gate 文档。
- M2 Gate 经 `systems_architect` 与 `qa_reviewer` 独立验收为 `ACCEPT`。
- M1 Gate 的两个 M2 前置 follow-up 已关闭：显式 Chromium + Electron host hash canary，以及 sim-core/content-runtime boot-boundary contract test。

当前执行重点是按 Roadmap 建立政体、职任、人物与臣属纵切；M3 不得扩写完整战争闭环、完整外交、正式历史人物数据库、生产地图内容、M4+ 战役系统或未批准的生产依赖。M3 实现工作必须先经过 M3 task graph 创建与独立验收。

M3 当前进展：`M3-TRIBUTE-TROOP-OBLIGATIONS-001` 已在 PR #70 进入 `origin/main`（`9e0bf248eeecbcd4faab162d54dd0504c02f57ac`）并进入 `CLOSED`。已完成臣属义务的显式来源、名义/到期/已交付/欠额/违约会计、履行/部分履行/延期/拒绝/减免/追索/违约审计、M2 资源来源扣减、M3 出兵承诺占位、原因码与确定性回归。下一批 READY M3 任务为 `M3-POSTWAR-GOVERNANCE-001` 与 `M3-CLIENT-APPOINTMENT-UI-001`，优先继续 `M3-POSTWAR-GOVERNANCE-001`。

M3 当前进展：`M3-POSTWAR-GOVERNANCE-001` 已在 PR #72 进入 `origin/main`（`81380a2836c7985c9f7c7b8f726321cdcdbb6137`）并进入 `CLOSED`。已完成直接统治、恢复/保留臣属统治者与贡赋型战后安排原型，提供即时预览、24 个月 deterministic 对比、原因码、重复同地安排拒绝与 direct-control 标记不变式。下一批 READY M3 任务为 `M3-CLIENT-APPOINTMENT-UI-001` 与 `M3-SAVE-RUNTIME-001`，优先继续 `M3-CLIENT-APPOINTMENT-UI-001`。

M3 当前进展：`M3-CLIENT-APPOINTMENT-UI-001` 已在 PR #74 进入 `origin/main`（`4af3729b469efcb9b2836c9b03155de73d12b384`）并进入 `CLOSED`。已完成 M3 appointment/read-model workspace、candidate eligibility/rejection reason、bulk preview、policy continuity、administrative impact、succession/obligation/result panels、protocol command DTO submission、Storybook 覆盖与 1440px viewport Playwright 回归。下一 READY M3 任务为 `M3-SAVE-RUNTIME-001`。

M3 当前进展：`M3-SAVE-RUNTIME-001` 已在 PR #76 进入 `origin/main`（`c71f5dfb411e7bdec8282807a3b67b23f70dea46`）并进入 `CLOSED`。已完成 M3 runtime save/load 显式 DTO、parser、copy、missing-M3 load rejection、M1/M2 兼容回归、M3 round-trip 与 malformed/future/cross-manifest rejection 覆盖。下一 READY M3 任务为 `M3-H003-H005-VALIDATION-001`。

## 2. 已冻结决定

| ID | 决定 | 状态 |
|---|---|---|
| D-001 | 使用 1531—1600 东南亚大陆题材 | FROZEN |
| D-002 | 核心是臣属与代理人政治，不是城池涂色 | FROZEN |
| D-003 | 战争从动员、季节与补给开始 | FROZEN |
| D-004 | Web-first，Windows Electron + Web 首发 | FROZEN |
| D-005 | macOS 桌面版暂缓，架构保持可移植 | FROZEN |
| D-006 | 全栈 TypeScript，首版不使用 Rust/WASM | FROZEN |
| D-007 | React 负责 DOM UI，PixiJS 负责地图 | FROZEN |
| D-008 | 权威模拟置于 Dedicated Web Worker | FROZEN |
| D-009 | 模拟确定性、可无界面运行 | FROZEN |
| D-010 | 玩家和 AI 通过同一 Command API 改变世界 | FROZEN |
| D-011 | 快照存档 + 短事件/命令尾，不做完整事件溯源 | FROZEN |
| D-012 | 一个地区只有一个实际控制者，可有宗主链、义务与多重宣称 | FROZEN |
| D-013 | 首版单机，不建常驻后端或多人同步 | FROZEN |
| D-014 | 历史表达不得套用现代固定国界与民族本质主义 | FROZEN |
| D-015 | 强制迁徙、奴役、战争人口损失必须表现人类代价 | FROZEN |

## 3. 需要原型验证的目标

| ID | 假设 | 验证方式 |
|---|---|---|
| H-001 | TypeScript Worker 可满足完整模拟规模 | 压力场景：4,000 人物、2,500 地区、500 军队、10,000 道路边 |
| H-002 | DOM + Pixi 混合 UI 可稳定支持信息密集界面 | 4,000 行人物表、500 军队、缩放标签压力测试 |
| H-003 | 臣属网络比直接吞并更有决策价值 | 垂直切片可玩测试：至少三种可行统治方式 |
| H-004 | 季风窗口能形成规划，而不是单纯惩罚 | 统计玩家取消、延误、成功远征的原因分布 |
| H-005 | 家臣提案既有用又不总是最优 | 接受率、后悔率、可解释性访谈 |
| H-006 | Web 首次加载和存档体验可接受 | 真实部署环境和低端 Windows 设备测试 |
| H-007 | 节点式会战值得独立开发 | 先以同一战斗模型自动结算；垂直切片后决定是否做手操表现 |

## 4. 明确未决定事项

- 正式产品名、商标和 logo。
- 最终发行渠道与商业模式。
- 首发是否包含手动会战。
- 具体美术风格、镜头角度和人物肖像生产方式。
- 精确地图边界和全部可玩势力。
- 历史人物名单、能力值和事件内容。
- 是否在 1.0 支持用户 Mod、Steam Workshop 或场景编辑器。
- macOS 桌面版是否在 1.0 后加入。

这些事项必须通过相应里程碑的研究、原型与测试决定，不得由单个代理在实现中默认拍板。

## 5. 项目成功的最低证明

垂直切片必须证明：

1. 任命不同代理人会改变地方发展、忠诚与战争准备。
2. 动员农户会影响未来收成，职业随从会造成持续财政负担。
3. 道路、河运、仓储和季节会改变可行战役计划。
4. 一场胜利不会自动等于永久领土控制；战后仍需安排臣属、驻军、人质与赏赐。
5. 扩张会增加行政与政治风险，而不是只增加收入和兵力。
6. AI 能解释“不行动”“撤军”“选择目标”的主要原因。
7. 同一存档、种子和命令序列在浏览器与 Node Runner 中得到相同状态哈希。

## 6. 当前模型路由

`MODEL-ROUTING-AMENDMENT-001` 已作为增量决策接受，详见 `docs/26-model-routing-amendment.md`。它只修正 Codex 角色模型、推理强度、Spark 使用边界和线程迁移规则，不改变项目阶段、冻结产品决定、技术栈、Roadmap 或任务事实。

当前有效摘要：

- `lead_orchestrator`、`systems_architect`、`gameplay_designer`、`qa_reviewer`、`security_reviewer` 使用 `gpt-5.5` / `xhigh`，其中 QA 和 security 保持只读。
- `simulation_engineer`、`client_engineer`、`historical_researcher` 使用 `gpt-5.5` / `high`。
- `research_scout` 使用 `gpt-5.4-mini` / `medium` / read-only；`test_engineer` 与 `balance_analyst` 使用 `gpt-5.4-mini` / `high`。
- `release_engineer` 与 `spark_worker` 使用 `gpt-5.3-codex-spark` / `medium`，只执行明确、机械、路径受限的任务，不能做最终验收。
- 若 Spark 不可用，必须记录 `MODEL_FALLBACK`，临时回退到 `gpt-5.4-mini` / `medium`，且不得重做已经验收通过的任务。

## 7. 当前流程模式

`AUTONOMOUS-GOAL-MODE-001` 已作为受门禁约束的流程模式接受，详见 `docs/27-autonomous-goal-mode.md`。它只允许主协调线程在任务、handoff、review、测试和 Human Gates 全部满足时连续推进下一项 dependency-ready 工作；不改变上述冻结产品决定、平台承诺、技术栈、Roadmap、架构边界或历史表达政策。
## 8. M3 Gate And M4 Start Snapshot

`M3-EXIT-VALIDATION-001` is CLOSED after PR #80 entered `origin/main` at `2bf90fdd9f009c30ff104926944e8434c4e0b579`. `docs/GATE-M3.md` records `M3_GATE = PASS`; systems_architect R3 and independent qa_reviewer R3 handoffs were validated; PR CI passed Quality/Web/Browser Smoke and Windows Desktop Smoke Artifact. M3 implementation work is complete.

Current milestone is **M4 / Campaign, Logistics, Siege, and Postwar War Outcome Loop**. The first READY M4 task is `M4-TASK-GRAPH-001`, which must create the minimal M4 task DAG before any M4 implementation begins. M4 remains bounded by the accepted roadmap: no manual node battle, complex naval war, full diplomacy, 3D battle, multiplayer/server, telemetry, arbitrary-code mods, or frozen product/architecture changes without the documented Human Gate.

M4 current progress: `M4-TASK-GRAPH-001` has produced a systems_architect REVIEW handoff for the minimal M4 campaign/logistics/siege/AI/UI/validation DAG on branch `chore/m4-task-graph`. Downstream M4 implementation and validation tasks remain `DRAFT` pending independent `qa_reviewer` review and lead integration; no M4 product code has started.

## 9. M4 Task Graph Snapshot

M4-TASK-GRAPH-001 is CLOSED after PR #82 entered origin/main at `4bee35829c9a37eff405d59cfe4af1a605434928`. The next READY M4 task is `M4-CAMPAIGN-OBJECTIVES-001`; it is limited to the minimal campaign objective and planning-knowledge substrate and must not absorb muster, supply, march, siege, UI, or validation work.

## 10. M4 Campaign Logistics Snapshot

`M4-CAMPAIGN-OBJECTIVES-001`, `M4-MUSTER-PREP-COMMITMENTS-001`, `M4-GRAIN-SUPPLY-001`, and `M4-ROUTE-TRANSPORT-CAPACITY-001` are CLOSED on `origin/main`. `M4-ROUTE-TRANSPORT-CAPACITY-001` entered main through PR #90 at `2431e897676838057d2e29201b0528b5ebbf29c2` after systems_architect ACCEPT, independent qa_reviewer ACCEPT, lead gates, and both PR Gate jobs passed.

The current milestone remains **M4 / Campaign, Logistics, Siege, and Postwar War Outcome Loop**. The next READY M4 task is `M4-MARCH-SUPPLY-STATE-001`, limited to deterministic daily march execution, supply state, and reinforcement timing. It must not absorb siege decisions, automatic battle resolution, postwar governance, campaign AI policy, or client UI behavior.

`M4-MARCH-SUPPLY-STATE-001` is CLOSED after PR #92 entered `origin/main` at `2ab85022eaa89e5ab3b4b1f421fe422beb4b38ff`. The task added deterministic daily march execution, supply state, reinforcement timing, canonical `m4.marches` hash coverage, and focused regressions after systems_architect requested two change rounds and accepted R3. The next READY M4 task is `M4-AUTO-ENGAGEMENT-SIEGE-001`; it is limited to automatic engagement resolution and the M4 siege choice loop and must not implement manual node battle, tactical battle UI, 3D battle, complex naval battle, full diplomacy, peace treaties, or multiplayer/server behavior.

`M4-AUTO-ENGAGEMENT-SIEGE-001` is CLOSED after PR #94 entered `origin/main` at `b09cf6b7982f3644256a9422f824b2f2639bf000`. The task added deterministic automatic field engagement resolution, minimal M4 siege choices, serializable combat events with event-tail load parser support, siege read models, and player/AI parity coverage after systems_architect requested event-tail and parity fixes and accepted R2. The next READY M4 task is `M4-WITHDRAWAL-POSTWAR-HANDOFF-001`; it must hand campaign results to accepted M3 governance boundaries and must not implement full diplomacy, peace treaties, rebellion systems, formal historical content, campaign planning UI, or M5 vertical-slice content.

`M4-WITHDRAWAL-POSTWAR-HANDOFF-001` is CLOSED after PR #96 entered `origin/main` at `2f155248f97dc192d0e0fa960021c5f425c26cf7`. The task added deterministic campaign withdrawal resolution, explicit WarOutcome/PostwarCandidate handoff into accepted M3 governance boundaries, objective-complete march/siege/result gating, auditable source-ledger grain return, failed-extraction coverage, read-model copy-safety regressions, and required reason-code/conservation tests after systems_architect requested two change rounds and accepted R3. The next READY M4 task is `M4-CAMPAIGN-AI-001`; it is limited to minimal campaign AI target/wait/reinforce/withdraw/objective-change reasons through the same command/query surface and must not implement full diplomacy AI, multi-year grand strategy, personality simulation, arbitrary-code scripting, telemetry, server, multiplayer, manual node battle, complex naval warfare, or M5 content.

`M4-CAMPAIGN-AI-001` is CLOSED after PR #98 entered `origin/main` at `d5cd9fa8cd4525dce68a705c4540d27453d38048`. The task added a minimal pure campaign AI planner over accepted command/query read models, a bounded protocol-visible AI trace DTO/parser with shared candidate limit, command-parity paths for objective, march, muster, siege and withdrawal decisions, reason-coded wait/target/reinforce/withdraw/no-action outputs, and focused trace truncation regressions after systems_architect REQUEST_CHANGES and R4 ACCEPT plus independent QA ACCEPT. The next READY M4 task is `M4-CLIENT-CAMPAIGN-PLANNING-UI-001`; remaining M4 work is client campaign-planning UI, deterministic replay/persistence validation, stress validation, and the M4 exit gate.

## 11. M4 Exit Gate Review Snapshot

`M4-EXIT-VALIDATION-001` is in REVIEW on branch `chore/m4-exit-gate`. `docs/GATE-M4.md` records a lead reconciliation recommendation of `M4_GATE = PASS_WITH_LIMITS`, pending independent `qa_reviewer` acceptance and lead integration. The limitation is procedural: three real `systems_architect` writer threads were spawned and closed after stalling without REVIEW handoffs or file changes, so the gate evidence is explicitly routed as a `lead_orchestrator` reconciliation rather than a fabricated systems handoff.

All prior M4 implementation and validation tasks are CLOSED on `origin/main` through stress-validation closure PR #105 at `96abe397327a81e5922aed61c022255dc20f2baa`. The M4 gate evidence includes frozen install, `pnpm check`, full tests, content validation, determinism, performance baseline, Web build, Storybook build, Electron security/package smoke, Chromium E2E, focused M4 scenario tests, task registry validation, and diff checks. This review does not start M5 and does not change product, package, content-source, tool, CI, roadmap, ADR, or prior gate files.

## 12. M4 Gate And M5 Start Snapshot

`M4-EXIT-VALIDATION-001` is CLOSED after PR #106 entered `origin/main` at `f0fdbf1ba745ac8ffc78a2dba190c9abb1e888f1`. `docs/GATE-M4.md` records `M4_GATE = PASS_WITH_LIMITS`; independent `qa_reviewer` accepted the explicit process exception that no systems_architect handoff exists after three real stalled systems writer threads. PR CI passed both Quality/Web/Browser Smoke and Windows Desktop Smoke checks.

Current milestone is **M5 / Playable Vertical Slice**, but this closure does not start M5 production scope by itself. M5 formal passage remains a Human Gate. The next machine action is to create or recover the M5 task graph, preserving M4 exclusions unless a later approved task changes them: no manual node battle decision without Human Gate, no full diplomacy, no complex naval warfare, no server/multiplayer, no telemetry, no arbitrary-code mods, and no frozen product/architecture changes.

M5 current progress: `M5-TASK-GRAPH-001` is CLOSED after PR #108 entered `origin/main` at `8b771272a9cfa790282043fcd092c1ce59fd0117`; the closure checkpoint is being recorded on branch `chore/close-m5-task-graph`. The accepted graph is planning-only. Downstream M5 tasks remain DRAFT until selected by the lead, and `taskctl ready` selects `M5-SLICE-DEFINITION-001` as the next dependency-ready M5 task.

M5 formal passage remains a Human Gate. Manual node battle, telemetry, server/multiplayer, arbitrary-code mods, paid services/accounts/secrets, release/commercial decisions, branding, frozen product/platform/core changes, major cultural-risk decisions, and irreversible migrations remain outside autonomous implementation unless an explicit Human Gate approves them.

## 13. M5 Slice Definition Review Snapshot

`M5-SLICE-DEFINITION-001` is CLOSED after PR #110 entered `origin/main` at `1eaf46fb109f8dca93ba50dd269cbcdea0fef042`.

The task defines a planning-only M5 playable-slice contract in `project/tasks/active/M5-SLICE-DEFINITION-001.json`. The contract narrows M5 to a repeatable 2-4 hour composite/fictional slice using accepted M1-M4 systems: deterministic command/query/save authority, M2 economy/population/route pressure, M3 offices/vassal obligations/postwar governance/succession pressure, and M4 campaign logistics/automatic engagement/siege/withdrawal/AI trace surfaces.

No formal historical content, production dependency, product code, package code, content-source data, roadmap edit, acceptance-matrix edit, ADR, gate doc, release artifact, telemetry, server/multiplayer behavior, arbitrary-code mod support, branding, commercial decision, frozen architecture/platform/core decision, or irreversible migration is added by this task.

M5 formal passage, manual node battle, telemetry, server/multiplayer, arbitrary-code mods, release/commercial choices, branding, major cultural-risk decisions, frozen product/platform/core architecture changes, irreversible migrations, and paid services/accounts/secrets remain Human Gates. The next dependency-ready task is `M5-SIM-PLAYABLE-LOOP-001`.

## 14. M5 Player Research Closure Snapshot

`M5-PLAYER-RESEARCH-001` is CLOSED. PR #122 entered `origin/main` at `8b6ef6542d2d1a8270618ec8bae2161eb94c2e9d`, and closure PR #123 advanced `origin/main` to `22a3473eb10d4008500e499ae135333e7d974311`.

The accepted gameplay_designer evidence records a minimal privacy-safe player-research pilot against the local M5 slice using two internal anonymous observation sessions. The evidence covers visible goal communication, command preview, campaign risk, AI reasons, save/load checkpoint behavior, and postwar consequences. It records no telemetry, accounts, paid services, remote network collection, hidden personal data, formal historical content, product-code changes, content-source changes, or formal M5 passage decision.

No blocker defects were accepted. Bounded follow-ups remain: optional external/non-author participant sessions under explicit consent if stronger player evidence is required, duplicate React key warnings observed in repeated reason-code chip rendering, clarification that current save/load is a client-session checkpoint rather than desktop file import/export UX, historical_researcher routing for any later formal names/symbols/cultural content, and the accepted limitation that the current live multi-year AI run is no-action-heavy. M5 formal passage remains `M5-EXIT-HUMAN-GATE-001`, not this research task.

## 15. M5 Manual Node Battle Human Gate Snapshot

Product owner decision received on 2026-06-27: `M5-MANUAL-NODE-BATTLE-DECISION-001` is resolved as `DEFER_MANUAL_NODE_BATTLE`.

Manual node battle is deferred from M5 and from the 1.0 mainline. The current 1.0 mainline continues with automatic/abstract battle resolution, campaign preparation, march, supply, siege, withdrawal, and postwar governance. Do not create a manual node battle implementation task, and do not create a manual node battle spike or research task that blocks M5, M6, M7, or M8. Manual node battle may be listed only as a post-1.0 expansion candidate or future research candidate, and that future note is not current implementation authorization.

The decision is recorded in `docs/28-manual-node-battle-decision.md`. The decision checkpoint entered `origin/main` through PR #125 at `daf09128b3c15bee26664a9b750a625ed8384767`; the closure/start checkpoint entered `origin/main` through PR #126 at `4919f8bc48fa3b7e13ea69ebd8483b1e70a0f313`. `M5-MANUAL-NODE-BATTLE-DECISION-001` is CLOSED, and `M5-EXIT-HUMAN-GATE-001` is the current M5 gate.

`M5-EXIT-HUMAN-GATE-001` is CLOSED after PR #127 entered `origin/main` at `b09675c115b81ee05b7894071afb6f10000af011`. `docs/GATE-M5.md` records `M5_GATE = PASS_WITH_LIMITS`; `systems_architect` accepted the gate, `qa_reviewer` requested ledger fixes and then accepted R2, and both PR Gate jobs passed.

Current milestone is **M6 / Alpha: System Complete**. The first READY M6 task is `M6-TASK-GRAPH-001`, which must create the minimal M6 task DAG before M6 implementation begins. M6 must preserve the product-owner decision `DEFER_MANUAL_NODE_BATTLE`: do not create a manual node battle implementation task, and do not create a manual node battle spike or research task that blocks M6, M7, or M8.

Ledger reconciliation notes:

- PR #106 is the M4 Gate validation/evidence PR; PR #107 is the M4 exit closure PR. M4 remains `PASS_WITH_LIMITS`.
- `docs/GATE-M1.md` through `docs/GATE-M4.md` are historical gate evidence documents, not final closure ledgers.
- `taskctl.mjs validate` without a task id is a known tooling limitation that returns `Task not found: undefined`; use `taskctl list`, `taskctl ready`, and explicit `taskctl validate <TASK_ID>`.
- `project/audits/STATUS-AUDIT-20260627.md` is included as the read-only audit evidence that drove this reconciliation.

## 16. M6 Task Graph Review Snapshot

`M6-TASK-GRAPH-001` is CLOSED after PR #129 entered `origin/main` at `4aef9108da1e659354a4a726b07b4b6dad56f966`. The systems_architect writer created a planning-only M6 Alpha task DAG under `project/tasks/active/M6-*.json`; independent `qa_reviewer` accepted it through `project/messages/outbox/M6-TASK-GRAPH-001__MSG-20260627-M6-TASK-GRAPH-QA-REVIEW__qa_reviewer.json`. The next READY M6 task is `M6-ALPHA-SYSTEM-CONTRACT-001`.

The DAG covers start-to-victory playability, diplomacy, legitimacy, succession completion, layered AI, policy/event/encyclopedia surfaces, three-scenario data pipeline, map candidate path, batch auto-run and balance dashboard, accessibility core flows, Alpha no P0/P1 validation, adviser intervention evidence, and M6 exit validation. The first executable downstream task is `M6-ALPHA-SYSTEM-CONTRACT-001`; all other downstream M6 tasks remain `DRAFT`.

The graph preserves `DEFER_MANUAL_NODE_BATTLE` exactly. It creates no manual node battle implementation task and no blocking manual node battle spike or research task for M6, M7, or M8. Manual node battle remains only a post-1.0 non-blocking candidate note and is not current implementation authorization.

This planning task does not modify product code, package code, content-source data, tools, CI, roadmap, acceptance matrix, prior gate documents, accepted ADRs, dependency manifests, release artifacts, telemetry, server/multiplayer behavior, arbitrary-code mod support, or frozen product/platform/core architecture decisions.

## 17. M6 Alpha System Contract Snapshot

`M6-ALPHA-SYSTEM-CONTRACT-001` is CLOSED after PR #131 entered `origin/main` at `4310aee1805b069ddef28fe3fd52ab25a8ae3365`. The accepted planning-only contract defines the minimum M6 Alpha system-complete proof: start conditions, one recognized-order victory condition, failure conditions, evidence requirements, no-placeholder major-system expectations, M1-M5 system mapping, and M6 DAG mapping. It preserves `DEFER_MANUAL_NODE_BATTLE` exactly: no M6/M7/M8 manual node battle implementation, spike, research, validation, or exit-gate dependency is authorized.

The next dependency-ready M6 tasks are `M6-DIPLOMACY-LEGITIMACY-001` and `M6-SCENARIO-DATA-PIPELINE-001`. The lead will start `M6-DIPLOMACY-LEGITIMACY-001` first after this closure checkpoint enters main.

## 18. M6 Adviser Intervention Evidence Closure Snapshot

`M6-ADVISER-INTERVENTION-EVIDENCE-001` is CLOSED after PR #153 entered `origin/main` at `072ae2f5cfade1b0bc85ec3bab1c577395e279d4`. The task accepted bounded local/privacy-safe adviser intervention evidence: 0 new human/external sessions, 2 local design review passes, 6 deterministic batch runs from accepted artifact hash `99d64950`, no telemetry, no network collection, no personal data, no accounts, and no paid services.

The evidence records useful, ignored, harmful-risk, and missing adviser interventions across Alpha goals, risk, diplomacy, legitimacy, succession, policy/event choices, campaign consequences, and victory progress while preserving player command control. No blocker defects were accepted. Bounded follow-ups remain separate future work: player-facing adviser labels, direct campaign/postwar consequence advice, optional consented local sessions, and historical/cultural routing. Manual node battle remains `DEFER_MANUAL_NODE_BATTLE`; this task does not decide M6 exit.

The next dependency-ready M6 task is `M6-ALPHA-NO-P0P1-VALIDATION-001`, which must validate Alpha no accepted P0/P1 blockers before M6 exit validation.

## 19. M6 Exit Gate Start Snapshot

`M6-ALPHA-NO-P0P1-VALIDATION-001` is CLOSED after PR #156 entered `origin/main` at `cd5cebebfe6ac7b0dd07a7468abcba9da55fd765`. Current task is `M6-EXIT-VALIDATION-001` on branch `gate/m6-exit-validation`; it is the formal M6 Alpha system-complete validation gate.

This gate may create `docs/GATE-M6.md` and update process/status files only. It must not modify product code, packages, content-source data, roadmap, acceptance matrix, prior gates, release artifacts, telemetry, server/multiplayer, arbitrary-code mods, branding/commercial decisions, or frozen architecture choices. Manual node battle remains `DEFER_MANUAL_NODE_BATTLE`; no Human Gate is active.

## 20. M6 Gate And M7 Start Snapshot

`M6-EXIT-VALIDATION-001` is CLOSED after PR #157 entered `origin/main` at `5e68a74374a37fa2f3698ee846462c0525d7341a`. `docs/GATE-M6.md` records `M6_GATE = PASS_WITH_LIMITS`; the systems_architect writer recommendation was accepted by independent `qa_reviewer` in `project/messages/outbox/M6-EXIT-VALIDATION-001__MSG-20260628-M6-EXIT-QA-REVIEW__qa_reviewer.json`, and both PR CI jobs passed.

The recommendation is based on closed upstream M6 evidence through `M6-ALPHA-NO-P0P1-VALIDATION-001`, plus this gate's local rerun of the required validation commands: frozen install, `pnpm check`, full tests, content validation, determinism, performance baseline, Web build, Storybook build, Electron security and package smoke, Chromium E2E, focused M6 start-to-victory and layered-AI regressions, M6 batch balance artifact validation, adviser evidence review, task registry checks, and diff checks.

The gate remains `PASS_WITH_LIMITS` because M6 Alpha exit criteria are met but bounded: scenario data is Alpha validation scaffolding and not M7 content lock; adviser evidence is local/privacy-safe; batch balance records tuning risks but no P0/P1 candidates; M4/M5 `PASS_WITH_LIMITS` process context remains historical evidence; desktop packaging is smoke evidence rather than a signed release artifact. This accepted gate does not change product code, packages, content-source data, product scope, roadmap, acceptance matrix, prior gates, ADRs, dependencies, telemetry, server/multiplayer, arbitrary-code mods, branding/commercial decisions, release artifacts, or frozen architecture choices.

Current milestone is **M7 / Beta: Content And Quality**. The next machine action is to create or recover the M7 task graph before any M7 implementation begins. M7 must preserve `DEFER_MANUAL_NODE_BATTLE`; manual node battle remains only a post-1.0 non-blocking candidate unless a later Human Gate reverses it. M7 content lock, cultural review, artificial playthrough evidence, platform/localization matrix, balance migration, and save migration work must be decomposed through explicit tasks and reviewers rather than inferred from this gate closure.

M7 current progress: `M7-TASK-GRAPH-001` has started on branch `chore/m7-task-graph`. This is planning-only and may create M7 task JSON, process messages, and status records. It must not implement content, balance changes, UI, platform behavior, save migration, release artifacts, telemetry, server/multiplayer, arbitrary-code mods, or manual node battle. No M7 Human Gate is active yet.

## 21. M7 Task Graph Review Snapshot

`M7-TASK-GRAPH-001` is CLOSED after PR #159 entered `origin/main` at `bde9037d83b20f0fe6ea19e5d67b926d6ca161f7`. The systems_architect writer created a planning-only M7 Beta content and quality task DAG under `project/tasks/active/M7-*.json`, and independent `qa_reviewer` accepted it in `project/messages/outbox/M7-TASK-GRAPH-001__MSG-20260628-M7-TASK-GRAPH-QA-REVIEW__qa_reviewer.json`. No M7 content, product code, package code, content-source data, platform behavior, save migration, release artifact, telemetry, server/multiplayer behavior, arbitrary-code mod support, roadmap edit, acceptance-matrix edit, prior gate edit, or ADR change was implemented.

The DAG covers content lock planning, historical/cultural/language review, full scenario/person/event fill path, large-scale balance and anti-snowball validation, performance/memory/loading validation, Chrome/Edge/Firefox/Windows and resolution/localization matrix, save migration and cloud-save candidate decision boundaries, tutorial/hints/encyclopedia completion, audio/art/localization completion planning, Beta culture review, manual playthrough evidence, formal content lock acceptance, and M7 exit validation.

`M7-CONTENT-LOCK-CONTRACT-001` is the only first downstream task marked `READY` after task graph closure. All other downstream M7 tasks remain `DRAFT`.

The graph preserves `M6_GATE = PASS_WITH_LIMITS` and `DEFER_MANUAL_NODE_BATTLE` exactly. It creates no manual node battle implementation task and no M7/M8 blocking manual node battle spike, research, validation, or exit-gate dependency. Major cultural risk, formal content lock acceptance, manual playthrough acceptance requiring human judgment, commercial/release/branding, telemetry, server/multiplayer, cloud-save implementation, arbitrary-code mods, irreversible migration, and frozen product/platform/core architecture changes remain Human Gates.

## 22. M7 Content Lock Contract Snapshot

`M7-CONTENT-LOCK-CONTRACT-001` is CLOSED after PR #161 entered `origin/main` at `4c350b5b37748e96aa6ead8d7060c00cf3d5f367`. The accepted gameplay_designer contract defines M7 Beta content-lock scope, required review states, post-lock defect-only policy, explicit balance-tuning window, downstream evidence mapping, and Human Gate boundaries without approving the formal content lock.

The task is planning-only. It creates no final content, product code, package code, content-source data, platform behavior, release artifact, telemetry, server/multiplayer behavior, cloud-save implementation, arbitrary-code mod support, roadmap edit, acceptance-matrix edit, prior gate edit, or ADR change. Formal content lock acceptance remains a future Human Gate.

`M6_GATE = PASS_WITH_LIMITS` and `DEFER_MANUAL_NODE_BATTLE` remain preserved exactly. Manual node battle remains only a post-1.0 non-blocking candidate unless a later Human Gate reverses it. The next dependency-ready M7 tasks are `M7-HISTORICAL-CULTURAL-LANGUAGE-REVIEW-001` and `M7-SAVE-MIGRATION-CLOUD-BOUNDARIES-001`; the lead will start `M7-HISTORICAL-CULTURAL-LANGUAGE-REVIEW-001` first.

## 23. M7 UI Quality Track Snapshot

`M7-DISTRICT-INSPECTOR-QUALITY-001` is CLOSED after PR #183 entered `origin/main` at `556ab00fc37fa0b44060f83c9eec3f96af1bc20c`. The task productized the selected district inspector and secondary district browser, added localized route/obligation/due-label/travel-day player text, and added focused UI plus Playwright coverage for the prior zh-CN selected-inspector leaks.

Independent `qa_reviewer` accepted the R2 fix in `project/messages/outbox/M7-DISTRICT-INSPECTOR-QUALITY-001__MSG-20260629-M7-DISTRICT-INSPECTOR-QA-R2-REVIEW__qa_reviewer.json`; PR #183 passed both Quality/Web/Browser Smoke and Windows Desktop Smoke Artifact.

Current milestone remains **M7 / Beta: Content And Quality**. No Human Gate is active. Manual node battle remains `DEFER_MANUAL_NODE_BATTLE`. The next dependency-ready M7 tasks are `M7-MAP-PRESENTATION-QUALITY-001`, `M7-PLAYER-GUIDANCE-LITE-001`, and `M7-SAVE-MIGRATION-CLOUD-BOUNDARIES-001`; the lead should start `M7-MAP-PRESENTATION-QUALITY-001` first unless `taskctl ready` changes.

`M7-MAP-PRESENTATION-QUALITY-001` is CLOSED after PR #185 entered `origin/main` at `5ff2985b7e3490621544bc11fedf24a26fb9c9ce`. The task productized the M7 map presentation path with localized map labels, layer legend, hover details, pan controls, selected/reachable/blocked/overloaded presentation states, and list-map synchronization while preserving the accepted map authority boundary.

`systems_architect` accepted the implementation in `project/messages/outbox/M7-MAP-PRESENTATION-QUALITY-001__MSG-20260629-M7-MAP-PRESENTATION-SYSTEMS-REVIEW__systems_architect.json`, and independent `qa_reviewer` accepted it in `project/messages/outbox/M7-MAP-PRESENTATION-QUALITY-001__MSG-20260629-M7-MAP-PRESENTATION-QA-REVIEW__qa_reviewer.json`. PR #185 passed both Quality/Web/Browser Smoke and Windows Desktop Smoke Artifact.

Current milestone remains **M7 / Beta: Content And Quality**. No Human Gate is active. Manual node battle remains `DEFER_MANUAL_NODE_BATTLE`. The next dependency-ready M7 tasks are `M7-PLAYER-GUIDANCE-LITE-001` and `M7-SAVE-MIGRATION-CLOUD-BOUNDARIES-001`; the lead should start `M7-PLAYER-GUIDANCE-LITE-001` first unless `taskctl ready` changes.

`M7-PLAYER-GUIDANCE-LITE-001` is CLOSED after PR #187 entered `origin/main` at `def9a9885c4f48d9c0c6e0b86c6ec4393c3f9e99`. The task added a lightweight, localized player guidance panel for the M7 core UI path, including first objective, district selection, district inspection, governance preview, result observation, next-step feedback, and dismiss/collapse controls while preserving existing command and read-model authority boundaries.

Independent `qa_reviewer` accepted the implementation in `project/messages/outbox/M7-PLAYER-GUIDANCE-LITE-001__MSG-20260629-M7-PLAYER-GUIDANCE-QA-REVIEW__qa_reviewer.json`; PR #187 passed both Quality/Web/Browser Smoke and Windows Desktop Smoke Artifact.

Current milestone remains **M7 / Beta: Content And Quality**. No Human Gate is active. Manual node battle remains `DEFER_MANUAL_NODE_BATTLE`. The next dependency-ready M7 tasks are `M7-SAVE-MIGRATION-CLOUD-BOUNDARIES-001` and `M7-UI-REGRESSION-MATRIX-001`; the lead should start `M7-SAVE-MIGRATION-CLOUD-BOUNDARIES-001` first unless `taskctl ready` changes.

## 24. M7 Content Lock Human Gate Snapshot

`M7-CONTENT-LOCK-ACCEPTANCE-001` has reached the formal content-lock Human Gate on branch `codex/m7-content-lock-acceptance`. The lead package is recorded in `project/messages/outbox/M7-CONTENT-LOCK-ACCEPTANCE-001__MSG-20260629-M7-CONTENT-LOCK-ACCEPTANCE-HUMAN-GATE-REVIEW__lead_orchestrator.json`; independent `qa_reviewer` accepted the package as evidence-backed and process-only in `project/messages/outbox/M7-CONTENT-LOCK-ACCEPTANCE-001__MSG-20260629-M7-CONTENT-LOCK-ACCEPTANCE-QA-REVIEW__qa_reviewer.json`.

The QA acceptance is not product-owner approval. `M7-CONTENT-LOCK-ACCEPTANCE-001` remains `BLOCKED` on `HUMAN_GATE_FORMAL_CONTENT_LOCK_ACCEPTANCE` until the product owner explicitly chooses `APPROVE_CONTENT_LOCK_WITH_LIMITS`, `DEFER_CONTENT_LOCK`, or `REQUEST_CHANGES`. `content_lock_accepted` remains `false`, and `M7-EXIT-VALIDATION-001` must not start while this gate is unresolved.

The recommended decision option is `APPROVE_CONTENT_LOCK_WITH_LIMITS` as of `origin/main` `62e3c756199f50302ff3b0a5ee087da1fd0bffbe`, carrying the accepted limits: `M6_GATE = PASS_WITH_LIMITS`, `DEFER_MANUAL_NODE_BATTLE`, Edge/Firefox unresolved tooling rows, Windows DPI 150% follow-up, low-end Windows proxy limits, agent-operated manual playthrough evidence only, and no release/commercial/branding/telemetry/server/multiplayer/cloud-save/mod/irreversible-migration approval.


## 25. M7 UX Recovery Request Changes Snapshot

On 2026-06-30 the product owner rejected formal M7 content lock for player-facing UX reasons. The current Web preview was judged not understandable, not game-like enough, and especially blocked by the player-facing map reading as a rectangular engineering grid with unexplained route lines. This is recorded in `project/messages/outbox/M7-CONTENT-LOCK-ACCEPTANCE-001__MSG-20260630-M7-CONTENT-LOCK-REQUEST-CHANGES__product_owner.json`.

The visual/design thread `019f05b0-7e7e-71e3-b18f-e41c938a38db` returned `REQUEST_CHANGES_UI_EXPERIENCE`: M7 must fix first-screen orientation, default situation map mode, route semantics/legend, route de-noising, decision-focused right inspector, collapsed task rail, player-mode debug suppression, and UX smoke coverage before content lock can be reconsidered.

Formal content lock remains not approved: `M7-CONTENT-LOCK-ACCEPTANCE-001` stays blocked with `content_lock_accepted=false`, while the active repair path starts with `M7-MAP-SITUATION-MODE-UX-001`. This recovery does not authorize high-fidelity final art, manual node battle, server/multiplayer, telemetry, accounts, cloud-save implementation, release/commercial/branding decisions, or production cultural assets.

`M7-MAP-SITUATION-MODE-UX-001` is CLOSED after PR #205 entered `origin/main` at `4970eca4676d2eb732231d0268880e7ac1a4817d`, and its closure checkpoint entered `origin/main` through PR #206 at `14ff4aefca3acda7e20e7603527dc6bf3cffc7df`. This closed the first UX recovery step by replacing the player-facing rectangular engineering-grid map with a low-fidelity strategic situation map while preserving map authority boundaries.

`M7-PLAYER-FIRST-SCREEN-ORIENTATION-001` is CLOSED after PR #207 entered `origin/main` at `d3a9be830dcdfa94b852037099bd46702f560a55`. The task removed default player-mode developer overlay/diagnostic copy, added first-screen orientation around identity, season, strategic problem and recommended next action, and preserved explicit `?debug=1` developer diagnostics. `gameplay_designer` accepted R2 in `project/messages/outbox/M7-PLAYER-FIRST-SCREEN-ORIENTATION-001__MSG-20260630-M7-FIRST-SCREEN-GAMEPLAY-R2-REVIEW__gameplay_designer.json`.

Current milestone remains **M7 / Beta: Content And Quality**. Formal content lock is still not accepted, and the UX recovery chain must continue before reconsideration. No new Human Gate is active. Manual node battle remains `DEFER_MANUAL_NODE_BATTLE`. The next dependency-ready M7 task is `M7-DECISION-INSPECTOR-REWRITE-001`, focused on turning the right inspector into a decision assistant rather than a raw data stack.

`M7-DECISION-INSPECTOR-REWRITE-001` is CLOSED after PR #209 entered `origin/main` at `763beaa8d67cac18314172210950dea948e1a69a`. The task rewrote the right inspector into a decision assistant that leads with current problem, recommendation, cost, benefit, risk, next action, and localized reason copy before grouped decision data. R1 gameplay review requested changes; R2 fixed blocked-route guidance so it no longer points at a disabled `Review obligations` action, and removed player-facing read-model jargon in English and Chinese. `gameplay_designer`, `test_engineer`, and independent `qa_reviewer` accepted the result.

Current milestone remains **M7 / Beta: Content And Quality**. Formal content lock remains not accepted. No new Human Gate is active. Manual node battle remains `DEFER_MANUAL_NODE_BATTLE`. The next dependency-ready M7 task is `M7-TASK-RAIL-COLLAPSED-DRAWERS-001`, focused on replacing bottom information walls with actionable task rail cards and collapsed drawers before UX recovery validation can reopen content-lock reconsideration.


`M7-TASK-RAIL-COLLAPSED-DRAWERS-001` is CLOSED after PR #211 entered `origin/main` at `483bfa742d57b88d25c30baf0450af6df26d8921`. The task rail recovery step replaced bottom information walls with first-screen-visible actionable task rail cards and collapsed drawers, with independent QA R3 acceptance in `project/messages/outbox/M7-TASK-RAIL-COLLAPSED-DRAWERS-001__MSG-20260630-M7-TASK-RAIL-QA-R3-REVIEW__qa_reviewer.json`.

Current milestone remains **M7 / Beta: Content And Quality**. Formal content lock remains not accepted. No new Human Gate is active. Manual node battle remains `DEFER_MANUAL_NODE_BATTLE`. The next dependency-ready M7 task is `M7-UX-RECOVERY-VALIDATION-001`, focused on validating the recovered first-screen/map/decision/task-rail UX before content lock can be reconsidered.

`M7-UX-RECOVERY-VALIDATION-001` is CLOSED after PR #213 entered `origin/main` at `ea1540eb16d0f92622e9f21a5e09a4b946b0ecd8`. The accepted validation records independent QA ACCEPT, 1440x900 and 1280x720 screenshot evidence, first-screen identity/situation/objective/recommended-action visibility, actionable task rail visibility, visible map surface and map legend, and suppressed player-mode debug labels.

Formal M7 content lock remains not accepted. `M7-CONTENT-LOCK-ACCEPTANCE-001` is still `BLOCKED` with `content_lock_accepted=false`, now at `UX_RECOVERY_VALIDATED_AWAITING_PRODUCT_OWNER_RECONSIDERATION`. `M7-EXIT-VALIDATION-001` must not start until the product owner explicitly chooses `APPROVE_CONTENT_LOCK_WITH_LIMITS`, `DEFER_CONTENT_LOCK`, or `REQUEST_CHANGES`.


## 26. M7 Systemic Interaction Recovery Snapshot

On 2026-06-30 the product owner rejected M7 content lock again after live preview. The blocker is now recorded as systemic interaction recovery rather than only visual/map recovery: the player cannot find how to handle the District 1 troop obligation, appointment preview/confirm lacks clear before/after and post-submit feedback, and the screen lacks a recognizable turn/phase/action loop comparable to the strategic readability expected from Nobunaga no Yabou references.

The lead created planning task `M7-SYSTEMIC-INTERACTION-RECOVERY-001` on branch `codex/m7-systemic-interaction-recovery-plan` to route this second REQUEST_CHANGES through independent QA review. Formal content lock remains unapproved: `M7-CONTENT-LOCK-ACCEPTANCE-001` stays BLOCKED with `content_lock_accepted=false` and `human_gate_state=REQUEST_CHANGES_SYSTEMIC_INTERACTION_RECOVERY_REQUIRED`. There is no active waiting Human Gate while the repair tasks are in progress.

The planned recovery chain is: `M7-CORE-ACTION-LOOP-UX-001`, `M7-MAP-DECISION-SURFACE-SYNC-001`, and `M7-SYSTEMIC-INTERACTION-VALIDATION-001`. M7 exit validation must not start until this chain passes, QA accepts, and the product owner reconsiders formal content lock. This recovery does not authorize final art production, manual node battle, server/multiplayer, telemetry, accounts, cloud-save implementation, release/commercial/branding decisions, production cultural assets, or arbitrary-code mods.

`M7-SYSTEMIC-INTERACTION-RECOVERY-001` is CLOSED after PR #215 entered `origin/main` at `1c86eb860369b7b488a070f55db8efaf76aa05e1`. The accepted planning package records the second product-owner `REQUEST_CHANGES`, independent QA ACCEPT, and the bounded recovery chain. The next dependency-ready M7 task is `M7-CORE-ACTION-LOOP-UX-001`, focused on the phase-driven action loop, obligation handling entry, and appointment preview/confirm feedback.

`M7-CORE-ACTION-LOOP-UX-001` has started on branch `codex/m7-core-action-loop-ux` from `origin/main` `e8520f61e8d8a81f9d1e17c6a9b0e0edabe4283e`. The active writer is `client_engineer` thread `019f1806-4fbc-75d2-a62c-51e1a2a6d8ea` (`Canvas`). This task must fix the player-facing phase/action loop, District 1 obligation entry discoverability, and appointment preview/confirmation feedback before content-lock reconsideration can reopen. Formal M7 content lock remains not accepted; no active waiting Human Gate is open during this repair.

`M7-CORE-ACTION-LOOP-UX-001` is ACCEPTED on branch `codex/m7-core-action-loop-ux` after gameplay_designer R2 ACCEPT and independent qa_reviewer ACCEPT. The accepted implementation adds a visible phase/problem/next-action loop, direct District 1 obligation handling entry from task rail/district context/inspector, clearer appointment preview and confirmation feedback, duplicate-submit guards, and R2 obligation-support wording/result feedback without changing sim-core, protocol, save, content, final art, server, telemetry, or manual node battle scope. The task is not CLOSED until PR CI passes and the accepted branch enters `origin/main`; formal M7 content lock remains not approved.
