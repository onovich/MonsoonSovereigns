# AGENTS.md — 《季风诸王》Codex 根规则

本文件对仓库中的所有 Codex 主线程、子代理、自动化和人工贡献者生效。进入任何子目录后，若存在更具体的 `AGENTS.md`，其规则只能收紧，不能削弱本文件。

## 1. 开始任务前

必须依次：

1. 读取 `PROJECT_STATUS.md`。
2. 读取与任务相关的设计文档和系统规格。
3. 检查 `git status`，不得覆盖未提交的人工更改。
4. 确认任务 ID、验收标准、允许修改的包和禁止修改的区域。
5. 对跨包、架构、存档格式、历史解释或一级设计决定的改动先写 ADR/研究声明。

没有明确任务 ID 时，由主协调线程创建；普通工作线程不得自行扩大任务范围。

## 2. 不可违反的架构边界

- `packages/sim-core` 不得导入 React、PixiJS、Electron、DOM、Node 文件系统或真实时间 API。
- 权威世界状态只能由模拟 Worker 修改；UI、renderer 和 Electron main 不得直接修改领域状态。
- 玩家与 AI 必须提交同一类 `GameCommand`。
- 模拟代码中禁止 `Math.random()`、`Date.now()`、隐式依赖对象遍历顺序和未指定 tie-breaker 的排序。
- React 不得管理每个地图实体的 Pixi DisplayObject；Pixi 场景不是权威状态。
- Redux/客户端 store 不得持有完整 `WorldState`。
- Electron Renderer 禁止 Node integration；所有桌面能力经受控 preload/IPC adapter。
- 首版禁止引入 Rust、WASM、服务器、ORM、运行时 SQL 数据库或任意代码 Mod，除非已有批准 ADR。

## 3. 严格代码规则

- TypeScript `strict` 及附加严格选项全部开启。
- 禁止 `any`；外部未知值使用 `unknown` 并在边界校验。
- 禁止非空断言 `!`，除非局部证明且附注原因。
- 禁止不安全双重断言 `as unknown as T`。
- 不使用 TypeScript `enum`、运行时 `namespace`、装饰器或反射型依赖注入。
- ID 使用 branded primitive；跨边界 payload 使用显式 schema。
- 所有公开命令、事件、查询和存档字段必须可序列化、可版本化。
- 热路径不得在循环内无界创建临时对象、闭包或集合；先测量再优化。
- 不提交占位实现、永久 `TODO`、跳过测试、注释掉的失败代码或伪造数据结果。

完整规范见 `docs/05-coding-standards.md`。

## 4. 测试与完成定义

任何实现任务在声明完成前必须：

- 运行受影响包的类型检查、lint、单元测试。
- 运行相关 property/invariant 测试。
- 对协议、存档和内容 schema 变化运行兼容性测试。
- 对 UI 变化提供 Storybook story 或 Playwright 用例。
- 对性能敏感变化提供前后测量，不接受“应该更快”。
- 在交接消息中列出实际运行的命令与结果；不得只写“测试通过”。

若测试无法运行，状态必须是 `BLOCKED` 或 `PARTIAL`，不能是 `DONE`。

## 5. Git 与并行工作

- 禁止直接向 `main` 写入。
- 写重任务应使用独立 worktree/branch。
- 同一时刻一个包或同一文件区域只允许一个主要写者。
- 禁止 `git reset --hard`、强制推送、删除其他线程分支或清理未知文件。
- 不做与任务无关的全仓格式化和重命名。
- 每个提交保持单一意图，使用 Conventional Commits。

## 6. 历史与文化内容

- 具体历史事实必须进入来源登记；正式内容至少有一项可靠来源，争议内容至少记录两种解释。
- 不得根据现代国界、现代民族主义或单一编年史默认构造 16 世纪身份。
- 不得把强制迁徙、奴役、屠杀、饥荒或宗教冲突表现为无代价奖励。
- 不得把未知历史信息伪装为确定事实；使用 `HISTORICAL`、`INFERRED`、`COMPOSITE`、`FICTIONAL` 标签。
- 任何现实文化的服饰、建筑、音乐、语言与图像符号，在正式资产生产前需文化/历史审查。

## 7. 依赖与安全

- 只使用 `pnpm`，锁文件必须提交。
- 新生产依赖必须说明用途、维护状态、许可证、替代方案和 bundle 影响；重要依赖需 ADR。
- 禁止运行来源不明脚本、粘贴密钥、提交凭证或开放任意 Electron IPC。
- 不从远程 URL 执行代码；Web 版本必须可由静态可信资源发布。
- 发现供应链、安全或隐私风险时，停止功能实现并通知 `security_reviewer`。

## 8. 多代理交接

使用 `project/templates/handoff.md` 的消息格式。完成任务后：

1. 写入任务状态和产物路径。
2. 明确 `ROUTE_TO` 的下一角色。
3. 主协调线程验证消息后，用 `send_input` 发送给指定线程。
4. 未经 reviewer 通过，不得标记 `ACCEPTED`。

跨线程不得依赖“对方应该知道”。消息必须包含任务 ID、分支/提交、改动文件、测试、决定、风险和下一动作。

## 9. 冲突优先级

遇到冲突时按以下优先级执行：

1. 用户当前明确要求。
2. 本文件与已批准 ADR。
3. `PROJECT_STATUS.md` 的冻结决定。
4. 系统设计与技术文档。
5. 任务说明。
6. 实现者偏好。

无法满足高优先级约束时必须停止并上报，不能通过隐藏假设继续。
