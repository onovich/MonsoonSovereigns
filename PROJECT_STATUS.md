# 项目当前状态

更新时间：2026-07-11

前向 Roadmap：[`docs/29-product-recovery-roadmap.md`](docs/29-product-recovery-roadmap.md)

历史 Ledger：[`project/history/PROJECT_STATUS-M0-M7-LEDGER.md`](project/history/PROJECT_STATUS-M0-M7-LEDGER.md)

## 当前阶段

- 当前前向阶段：**R1 / Authoritative Client Runtime**；R0 已完成且 `R0_GATE=PASS`。
- 当前任务：`RR1-TASK-GRAPH-001`，状态 `ACCEPTED`；systems REVIEW 与独立 QA ACCEPT 已记录，Lead 正在执行 PR 集成门，尚未启动产品实现。
- 当前分支：`codex/rr1-task-graph-001`。
- 当前 main：`origin/main@7582d0fd1e54fd51683b99214dbff15e8a030a4c`（R0 closure PR #250）。
- Autonomous Goal Mode：enabled；`human_gate.required=false`。
- 唯一 active lead：`019f4d4f-3856-7d63-8b33-e1bf1b9be9ca`；原 Lead `019eff50-c69d-7612-a90b-7024a47e0af5` 已按用户要求完成线程交接并停止推进。
- systems architect 与 QA reviewer 均已完成终端 handoff 并从 active 槽位关闭；未创建新 agent，未启动任何 R1 产品实现任务。

## 最近集成

| 任务 | 状态 | 进入 main 的证据 |
|---|---|---|
| `RR0-ROADMAP-ADOPTION-001` | CLOSED | PR #241，closure PR #242 |
| `RR0-REPOSITORY-STATE-RECONCILIATION-001` | CLOSED | PR #243，closure PR #244，`7878027f2211cc2421e1cee56a8b2dae2deb8f0b` |
| `RR0-PRODUCTION-FIXTURE-NOOP-AUDIT-001` | CLOSED | PR #245，closure PR #246，`3164c9a5a20794aa4d82300baaa6ac5aa10b31c8` |
| `RR0-STATUS-LEDGER-COMPACTION-001` | CLOSED | PR #247，`92f5800143a7987128898526d20ee2df13f48c67` |
| `RR0-EXIT-VALIDATION-001` | CLOSED | PR #249，closure PR #250，`7582d0fd1e54fd51683b99214dbff15e8a030a4c`，systems PASS recommendation，独立 QA ACCEPT |

R0 全部任务已 CLOSED，`R0_GATE=PASS`。受控 R1 task graph 已经 systems/QA 复核并由 Lead 接受；在 PR 合并、父任务关闭进入 `origin/main` 前不得启动 R1 实现。

## 产品运行时事实

- 底层 `sim-core` / protocol / save-format 已存在 boot、preview、submit、query、save、load 等能力，且继续与 React、Pixi、Electron、DOM、Node IO 解耦。
- 正常 Web/Electron 产品入口尚未接入权威 Simulation Worker 往返；M3-M6 的若干 command confirmation、M5/M6 session save/load 和阶段推进仍是 client-local success。
- host-hash canary、Node runner、Storybook、Playwright 与 Electron smoke 是测试或演示证据，不能替代生产客户端可玩闭环。
- 生产时间控制（暂停、1x/2x/4x、自动暂停）尚未接线。
- 权威审计矩阵：[`project/audits/RR0-PRODUCTION-FIXTURE-NOOP-AUDIT-001.md`](project/audits/RR0-PRODUCTION-FIXTURE-NOOP-AUDIT-001.md)。

## 仓库与线程

- 受控 worktree 共 2 个：当前 RR0 worktree，以及保留 M7 renderer 部分成果的原工作区。
- `M7-STRATEGIC-TERRAIN-RENDERER-INTERACTION-001` 为 `PARTIAL` 历史证据，不是 operational active work；原工作区保持 20 条既有 status entry，未清理、未覆盖。
- 原 R0 Exit systems architect 已复用于 `RR1-TASK-GRAPH-001` 并完成 systems REVIEW；原 QA reviewer 已复用并返回 ACCEPT；二者均不再是 active writer/reviewer。
- 任务图、leadership、模型路由和恢复状态分别以 `project/tasks/active`、`project/tasks/thread-registry.json`、`project/model-routing-state.json` 与 `project/goal-mode-state.json` 为准。

## 决定与边界

- `docs/29-product-recovery-roadmap.md` 是 R0-R8 前向产品成熟度权威；旧 M0-M7 结果只作为工程历史证据。
- 冻结产品、架构、确定性、安全和历史表达决定继续有效，详见 `docs/01-game-design-document.md`、`docs/04-software-architecture.md`、`docs/05-coding-standards.md` 与历史 Ledger。
- 手动节点会战继续保持 `DEFER_MANUAL_NODE_BATTLE`，不阻塞 R0-R8。
- R1 前不得新增玩家功能、内容填充、美术生产、内容锁或用流程整理代替产品修复。

## 当前风险

- **R4 Authoritative Client Runtime Gap**：正常 Web/Electron 仍不是权威游戏宿主；这是 R1 的首要产品工程问题。
- **R3 Retained M7 Partial Work**：原 M7 renderer worktree 含未集成局部成果，只能按后续明确任务拆分、迁移或放弃。
- **R3 Static Audit Limit**：当前 runtime audit 是静态证据；R1 必须补真实 Worker、命令、查询、存档、重启和负向集成测试。

## 下一动作

1. Lead 运行最终集成门，提交并推送受控 R1 task graph PR。
2. 等待 CI 通过并合并到 `origin/main`，随后关闭 `RR1-TASK-GRAPH-001`。
3. 只有父图谱关闭进入 main 后，才可启动最高优先级 READY 的 `RR1-WEB-WORKER-RUNTIME-001`。
