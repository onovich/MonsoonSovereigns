# 研发工作流与质量门禁

> 状态：**FROZEN PROCESS POLICY**

## 1. 工作单位

所有工作必须绑定任务 ID。任务是可独立验收、可回滚的最小交付单位，不是宽泛主题。

任务文件至少包含：

```text
id
summary
owner_role
reviewer_role
status
scope.allowed_paths
scope.forbidden_paths
dependencies
acceptance_criteria
required_tests
risk_level
branch_or_worktree
handoff_route
```

允许状态：

```text
DRAFT → READY → IN_PROGRESS → REVIEW → ACCEPTED → CLOSED
                    ↘ BLOCKED
                    ↘ PARTIAL
```

只有主协调线程可将任务置为 `READY`、`ACCEPTED`、`CLOSED`。

## 2. 任务切分原则

一个任务应满足：

- 一个主要写者；
- 一个清晰产物；
- 最多跨 1–2 个 package，跨更多通常需要拆解；
- 验收可以用命令、测试、截图或文档差异证明；
- 能独立回滚；
- 不把研究、设计、实现、审查全部塞给同一代理。

不得以“实现整个经济系统”“完善 UI”“优化 AI”作为单任务。

## 3. 标准流程

### 3.1 Intake

`lead_orchestrator`：

1. 读取项目状态和 roadmap。
2. 判断是否触及冻结决定、ADR、存档/schema、历史解释。
3. 创建任务和依赖。
4. 指定 writer、reviewer、允许路径、测试门禁。
5. 对不确定问题先派 `research_scout` 或领域设计者，不让实现者猜。

### 3.2 Design/Research

- 新系统先写规格与不变量，再实现。
- 技术 API 必须核对官方文档和锁定版本。
- 历史内容必须登记来源、置信度、争议和游戏抽象。
- 架构变化由 `systems_architect` 写/审 ADR。

### 3.3 Implementation

Writer：

1. 创建独立 branch/worktree。
2. 在允许路径内修改。
3. 先建立失败测试或可观察 fixture。
4. 做最小实现。
5. 运行局部门禁。
6. 写 handoff，不自行宣布已接受。

### 3.4 Review

Reviewer 必须独立检查：

- 验收标准；
- 真实执行路径；
- 不变量、边界、错误处理；
- 架构依赖；
- 测试是否会在实现错误时失败；
- 是否留下隐藏范围膨胀；
- 需要时复现 UI/性能/安全结果。

审查输出只允许：

```text
ACCEPT
REQUEST_CHANGES
BLOCK
```

`REQUEST_CHANGES` 必须按严重度列出可复现问题并路由回原 writer；不得由 reviewer 顺手大改形成双写冲突。

### 3.5 Integration

主协调线程在合并前：

- 检查分支基线与冲突；
- 运行组合门禁；
- 更新任务、ADR、变更日志与状态；
- 合并后关闭代理线程和 worktree；
- 不在同一次集成混入无关修复。

## 4. 风险分级

| 等级 | 例子 | 必须审查 |
|---|---|---|
| R0 | 文案、无行为文档纠错 | 文档 reviewer |
| R1 | 局部 UI、纯函数、工具脚本 | 同领域 reviewer |
| R2 | Command、AI 评分、内容 schema | 架构/设计 reviewer + 测试 |
| R3 | WorldState、时间顺序、RNG、存档、IPC、安全 | systems architect + QA + 必要安全审查 |
| R4 | 冻结技术/产品方向、历史敏感叙事、发布安全 | ADR + 双重批准 + 原型证据 |

## 5. 分支与 worktree

命名：

```text
feat/<task-id>-short-name
fix/<task-id>-short-name
docs/<task-id>-short-name
spike/<task-id>-short-name
```

- 每个写线程独立 worktree。
- 只读 reviewer 可以读取 writer worktree，不直接修改。
- 同一文件/包同时仅一名主要写者。
- 发生依赖冲突时由协调线程重新排程，不让两个代理“各自解决”。

## 6. 本地门禁

建议命令：

```bash
pnpm check
pnpm test
pnpm test:invariants
pnpm test:e2e --project=chromium
pnpm content:validate
pnpm sim:determinism
pnpm sim:benchmark
pnpm desktop:security-check
```

每个任务只需运行相关子集，但 handoff 必须记录命令、退出码和关键输出。集成/发布运行全套。

## 7. CI 阶段

### Pull Request 必跑

1. lockfile/install integrity；
2. format check；
3. lint；
4. typecheck；
5. dependency boundary；
6. unit/property tests；
7. content/schema validation；
8. deterministic canary；
9. impacted Playwright/visual tests；
10. Electron security assertions（涉及 desktop 时）。

### Nightly

- 多种子长跑模拟；
- 性能趋势；
- 内存泄漏与 Worker 重启；
- 存档 round-trip；
- Chrome/Edge/Firefox smoke；
- 历史内容来源完整性；
- 依赖漏洞与许可证检查。

### Milestone

- Windows 安装包；
- 静态 Web 部署；
- 低端机/高 DPI/超宽屏矩阵；
- 旧存档迁移；
- 人工可玩验收。

## 8. 变更控制

下列变化必须 ADR：

- 新生产依赖或主要版本；
- package 边界、Worker 协议、Command/Event 格式；
- 存档 schema；
- 时间调度或 RNG；
- 平台承诺；
- 安全模型；
- 从 TypeScript 迁移 WASM/Rust；
- 引入服务器、多人、任意代码 Mod。

玩家可见设计规则变化必须更新系统文档。历史解释变化必须更新来源登记。

## 9. 性能工作流

性能任务必须包含：

1. 可复现场景；
2. 基线机器/浏览器；
3. 采样或 profile 证据；
4. 单一假设；
5. 改动前后至少多次测量；
6. 正确性/确定性回归；
7. 若无显著收益则回滚复杂度。

禁止仅凭代码观感优化，禁止为了微优化破坏类型、可读性或跨平台一致性。

## 10. 历史内容工作流

```text
研究问题
→ source note
→ claim record
→ 置信度/争议标记
→ 设计抽象
→ 文化审查
→ 内容实现
→ 文案与数值审查
```

研究者与内容 writer 不应是最终审查同一人。涉及现实族群、宗教、强制迁徙、奴役或屠杀时，至少一名高能力 reviewer 检查表达和机制激励。

## 11. 阻塞与升级

立即标记 `BLOCKED` 的情况：

- 缺少决定且不同选择会改变公共 API；
- 官方文档与现有实现矛盾；
- 测试显示冻结假设不成立；
- 需要超出任务允许路径；
- 存在安全、许可、历史伦理风险；
- 发现他人未提交更改冲突。

阻塞消息必须包含：已知事实、尝试、最小决定问题、建议选项和影响。不要只写“需要更多信息”。

## 12. 发布纪律

- 版本来自 tag，不由本地手改。
- 可发布构建必须可追溯到 commit、内容 manifest 和依赖锁。
- 发布前不得自动升级依赖。
- Web 与 Electron 的模拟 hash 金丝雀必须一致。
- 生成物签名、哈希、SBOM、许可证清单归档。
- 发现回归时优先回滚，不在发布分支堆叠即兴补丁。
