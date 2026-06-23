# 初始 Backlog 与依赖图

此 backlog 只覆盖 M0/M1，不允许代理以“顺手”为由提前开发经济、战斗或历史人物。

## Epic FND — Foundation

### FOUNDATION-001：Monorepo 基线

- Owner：release_engineer
- Reviewer：systems_architect
- 产物：pnpm workspace、apps/packages/tools 目录、Node/TS pin、基础 scripts。
- 验收：Windows/CI `pnpm install --frozen-lockfile`、`pnpm check` 成功。
- 禁止：引入任何游戏业务。

### FOUNDATION-002：严格 TypeScript 与依赖边界

- Owner：systems_architect
- Reviewer：qa_reviewer
- 依赖：001
- 产物：tsconfig、lint、format、dependency rule、包公共 API 规则。
- 验收：故意违规 fixture 能让 CI 失败。

### FOUNDATION-003：Web/Worker/Runner 确定性 Hello

- Owner：simulation_engineer
- Reviewer：qa_reviewer
- 依赖：001、002
- 产物：最小 `sim-core`、Worker protocol、Node runner、state hash。
- 验收：Chrome Worker 与 Node 对固定 30 日命令序列 hash 相同。

### FOUNDATION-004：React/Pixi/Read Model 空壳

- Owner：client_engineer
- Reviewer：systems_architect
- 依赖：001–003
- 产物：React shell、Pixi canvas、Worker client、只读 hello read model。
- 验收：React 不持有 WorldState；Pixi 可重建；无领域规则复制。

### FOUNDATION-005：测试与开发可观察性

- Owner：test_engineer
- Reviewer：qa_reviewer
- 依赖：001–004
- 产物：Vitest、fast-check、Storybook、Playwright、debug fixture 路由。
- 验收：至少一个单元、属性、Story、E2E 和跨环境 hash 测试。

### FOUNDATION-006：Electron 安全壳

- Owner：client_engineer 或 release_engineer（只能一名 writer）
- Reviewer：security_reviewer
- 依赖：001、004
- 产物：main/preload、窄 PlatformAdapter、Forge/package 配置。
- 验收：nodeIntegration false、contextIsolation/sandbox true；Renderer 无 Node；Windows smoke。

### FOUNDATION-007：CI 与 artifact

- Owner：release_engineer
- Reviewer：qa_reviewer
- 依赖：002–006
- 产物：PR/nightly workflow、Web artifact、Windows smoke package、测试报告。
- 验收：干净 runner 可复现；失败测试阻断。

### FOUNDATION-008：Codex 协作协议自测

- Owner：lead_orchestrator
- Reviewer：qa_reviewer
- 依赖：001
- 产物：taskctl 运行、创建任务、spawn/read-only review、handoff 路由演练。
- 验收：从 READY 到 ACCEPTED 全流程有消息和文件记录。

## Epic SIM — Simulation Foundation

### SIM-001：ID、Definition 与 WorldState v0

- Owner：simulation_engineer
- Reviewer：systems_architect
- 依赖：FND 完成
- 验收：无循环对象引用、schema 解析、基础不变量。

### SIM-002：GameDay Scheduler

- Owner：simulation_engineer
- Reviewer：qa_reviewer
- 依赖：SIM-001
- 验收：固定系统顺序、月/年边界、10 年确定性。

### SIM-003：Command/Event/Query v1

- Owner：simulation_engineer
- Reviewer：systems_architect
- 依赖：SIM-001/002
- 验收：合法/非法命令、reason code、玩家/AI 同接口。

### SIM-004：Deterministic RNG Domains

- Owner：simulation_engineer
- Reviewer：qa_reviewer
- 依赖：SIM-001
- 验收：无关随机调用不扰动其他 domain；跨环境 hash。

### SIM-005：Save Envelope v1

- Owner：simulation_engineer
- Reviewer：systems_architect + qa_reviewer
- 风险：R3
- 依赖：SIM-001–004
- 验收：round-trip、checksum、损坏拒绝、golden fixture。

### SIM-006：Graph Fixture 与 Content Compiler v0

- Owner：simulation_engineer
- Reviewer：historical_researcher（数据字段）+ qa_reviewer（校验）
- 依赖：SIM-001
- 验收：30 node/60 edge；孤立节点、坏引用失败。

## 推荐并发波次

```text
Wave 1: FOUNDATION-001
Wave 2: FOUNDATION-002 + FOUNDATION-008
Wave 3: FOUNDATION-003 + FOUNDATION-005(部分)
Wave 4: FOUNDATION-004 + FOUNDATION-006
Wave 5: FOUNDATION-007 + 全集成审查
Wave 6: SIM-001 + SIM-006 规格
Wave 7: SIM-002 + SIM-004
Wave 8: SIM-003
Wave 9: SIM-005 + M1 gate
```

每波最多 4 个工作线程，保留 reviewer 容量。
