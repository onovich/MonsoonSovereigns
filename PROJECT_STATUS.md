# 项目状态与决定快照

## 1. 当前阶段

项目处于 **M3 / Polity, Office, Character, and Vassal Vertical Slice**。

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
