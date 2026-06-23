# Codex 多角色组织与工作模型

> 依据 2026-06-23 的 Codex 官方能力设计。模型可因账户可用性更新，但职责与审查分离不得取消。

## 1. 总体拓扑

```text
Human Product Owner
        │
lead_orchestrator（唯一调度/集成）
        ├─ systems_architect
        ├─ gameplay_designer
        ├─ historical_researcher
        ├─ simulation_engineer
        ├─ client_engineer
        ├─ test_engineer / balance_analyst
        └─ qa_reviewer / security_reviewer / release_engineer
```

Codex 原生子代理只有在主线程明确要求时才会生成。项目 Skill 的职责是让主线程按任务图主动 spawn、等待、路由、复审和关闭，而不是假设存在后台自治服务。

## 2. 模型策略

官方当前建议复杂任务从 `gpt-5.5` 开始。`MODEL-ROUTING-AMENDMENT-001` 将高杠杆裁决提升为 xhigh，并引入受约束的 GPT-5.3-Codex-Spark 快速执行通道。项目固定：

| 角色 | 模型 | effort | 原因 |
|---|---|---|---|
| lead_orchestrator | gpt-5.5 | xhigh | 跨领域规划、冲突处理、最终判断 |
| systems_architect | gpt-5.5 | xhigh | 架构、确定性、ADR、公共接口 |
| gameplay_designer | gpt-5.5 | xhigh | 系统联动、可玩性、反漏洞 |
| historical_researcher | gpt-5.5 | high | 史学争议、来源综合、文化风险 |
| simulation_engineer | gpt-5.5 | high | 权威状态、算法、存档、AI |
| client_engineer | gpt-5.5 | high | React/Pixi/Worker 集成与 UX |
| qa_reviewer | gpt-5.5 | xhigh | 独立正确性/回归审查，只读 |
| security_reviewer | gpt-5.5 | xhigh | Electron/供应链/输入边界，只读 |
| research_scout | gpt-5.4-mini | medium | 快速检索、文件扫描、证据清单 |
| test_engineer | gpt-5.4-mini | high | fixture、属性测试、E2E 执行 |
| balance_analyst | gpt-5.4-mini | high | 批量数据、指标、回放筛选 |
| release_engineer | gpt-5.3-codex-spark | medium | CI、构建、清单和发布复现的机械执行 |
| spark_worker | gpt-5.3-codex-spark | medium | 受约束的小范围样板、测试、配置和修复 |

R3/R4 决策不得仅由 mini 角色批准。若指定模型不可用，协调者必须记录替代，不静默降低审查等级。

Spark 不可用时，`release_engineer` 或 `spark_worker` 临时回退到 `gpt-5.4-mini` / `medium`，并在 `project/model-routing-state.json` 记录 `MODEL_FALLBACK`。已验收任务不因之后 Spark 可用而自动重做。

## 3. 并发规则

Codex 默认并发上限约 6，项目保持 `max_threads = 6`、`max_depth = 1`：

- 一个主协调线程；
- 最多 4 个工作/研究线程；
- 至少保留 1 个 reviewer 容量；
- 子代理不得递归大规模再委派；
- 并行只用于彼此独立的包/文档/研究问题；
- 标准槽位为 lead、systems/design、qa、Spark 快速执行、当前主实现者、按需专家或独立 reviewer。

不要同时让 6 个代理写同一个功能。多代理价值来自分离上下文与审查，不是最大化写入数量。

## 4. 角色职责

### lead_orchestrator

- 读取 roadmap、状态和任务图；
- 创建任务、分配线程、保存 thread ID；
- 是跨线程消息的唯一可靠 router；
- 控制范围、依赖、合并和最终状态；
- 不承担大块实现，避免既当 writer 又当批准者。

### systems_architect

- 公共 API、package 边界、Worker 协议、存档、确定性；
- ADR；
- 审核 R2+ 架构变化；
- 不为了“架构优雅”扩展首版范围。

### gameplay_designer

- 系统规格、公式意图、玩家反馈、反滚雪球、可解释性；
- 给实现者明确不变量和验收场景；
- 不直接把未经测试的参数标为最终。

### historical_researcher

- 研究问题、来源登记、史学争议和文化审查；
- 快速 scout 的结果必须由其复核；
- 不凭印象填具体内容。

### simulation_engineer

- `sim-core`、`sim-ai`、protocol、save、runner；
- 同一命令、确定性、性能；
- 不修改 React/Pixi 表现，除接口任务外。

### client_engineer

- Web app、read model、React/Pixi、Worker client、平台 adapter；
- 不复制领域规则到 UI；
- 复杂 UI 配 story/E2E。

### test_engineer

- 在规格基础上建立会失败的测试、fixture 和门禁；
- 不能只照实现写快照；
- 发现规格歧义路由回 designer/architect。

### balance_analyst

- 批量运行、统计、回放筛选、参数实验记录；
- 不根据单局直接改正式数据；
- 将建议发送给 gameplay designer 决定。

### qa_reviewer

- 只读独立审查；
- 优先真实错误、安全、回归和缺失测试；
- 输出 ACCEPT/REQUEST_CHANGES/BLOCK。

### security_reviewer

- Electron、IPC、CSP、文件、依赖、Mod/存档输入；
- 对 R3/R4 安全改动有否决权。

### release_engineer

- CI、可复现构建、artifact、SBOM、平台 smoke；
- 不在发布流程中顺手改游戏逻辑。

### spark_worker

- 只执行已经批准、路径明确、测试明确的小范围机械任务；
- 不做架构、设计、安全或最终验收；
- 任务必须包含 TASK、CONTEXT、ALLOWED_PATHS、FORBIDDEN_PATHS、ACCEPTANCE_CRITERIA、REQUIRED_TESTS、STOP_CONDITIONS、REQUIRED_HANDOFF 和 ROUTE_TO；
- 遇到公共 API、允许路径不足、需求歧义、新生产依赖、测试不可执行、安全/确定性/数据损坏风险时，输出 PARTIAL 或 BLOCKED handoff 并停止；
- 所有 Spark 输出必须经 GPT-5.5 high/xhigh reviewer 审查。

## 5. 典型任务流水线

### 新模拟系统

```text
gameplay_designer：规格/不变量/场景
→ systems_architect：接口与 ADR 审查
→ test_engineer：失败测试/fixture
→ simulation_engineer：实现
→ qa_reviewer：独立验证
→ lead_orchestrator：集成
```

### 历史内容

```text
research_scout：来源候选
→ historical_researcher：claim records/综合
→ gameplay_designer：游戏抽象
→ content writer（由相应角色执行）
→ historical_researcher + qa_reviewer：双审
```

### UI 功能

```text
gameplay_designer：信息与流程
→ client_engineer：story/实现
→ test_engineer：Playwright/accessibility
→ qa_reviewer：验收
```

### 性能问题

```text
test_engineer：可复现 benchmark
→ research_scout：代码路径/官方 API
→ 对应 engineer：单一假设优化
→ qa_reviewer：正确性/确定性
→ balance_analyst：规模回归（若模拟）
```

## 6. 消息驱动协议

每个线程完成一个任务阶段后生成结构化 handoff：

```text
TASK_ID
FROM_ROLE
STATUS
SUMMARY
ARTIFACTS
COMMIT/WORKTREE
TESTS_RUN
DECISIONS
RISKS
BLOCKERS
ROUTE_TO
REQUESTED_ACTION
```

协调线程：

1. 验证 handoff 字段和任务状态；
2. 找到 `ROUTE_TO` 对应的活动 thread ID；
3. 通过 Codex 原生 `send_input` 向该线程发送精简上下文和文件路径；
4. 没有活动线程时 spawn 指定自定义 agent；
5. reviewer 结果路由回 writer 或进入集成；
6. 文件消息存入 `project/messages/outbox` 作为持久审计；
7. 完成后 `close_agent`，不长期保留陈旧上下文。

模型迁移规则：

- 尚未开始且没有有效 handoff 的线程可关闭并按新模型重建；
- 正在执行的线程完成当前最小原子修改并 handoff，后续阶段使用新矩阵；
- REVIEW 中任务使用新规范 reviewer，不要求 writer 重做；
- ACCEPTED 任务不因模型变化重开，M0 gate 可由 `qa_reviewer` xhigh 复核；
- 不伪造实际模型、effort 或 thread ID。

子线程不得假设可以直接可靠地 peer-to-peer 通信；父协调线程是消息总线与任务真相源。

## 7. 线程提示最低内容

```text
任务 ID 与状态
允许/禁止路径
必须读取的文档
输入产物/commit
验收标准
必须运行的测试
输出 handoff 的 ROUTE_TO
不得改变的决定
```

不发送整仓复制文本；发送路径和任务相关摘要，避免上下文污染。

## 8. 失败处理

- Writer 失败/超时：保存 PARTIAL handoff，协调者决定续用原线程、重新 spawn 或缩小任务。
- Reviewer 拒绝：原 writer 修复；不创建第二 writer 抢改同一文件。
- 规格冲突：暂停实现，路由 designer/architect。
- 历史争议：保留多个解释和 `RESEARCH REQUIRED`，不让工程线程选边。
- 测试环境问题：状态 BLOCKED，记录实际命令/错误。

## 9. 人类控制点

虽然用户把执行交给 Codex，以下节点仍建议请求产品所有者明确批准：

- 变更冻结产品/平台方向；
- M5 垂直切片是否通过；
- 手动会战是否进入 1.0；
- 重大文化/历史争议处理；
- 发行、商业模式、品牌和预算；
- 启用任意代码 Mod、联网或遥测。
