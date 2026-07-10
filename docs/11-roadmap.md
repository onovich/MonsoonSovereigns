# 项目 Roadmap

> Roadmap 以退出条件而非日历承诺管理。不得因赶阶段而绕过确定性、测试、历史研究或可解释性。

## 当前权威

`docs/29-product-recovery-roadmap.md` 已在 2026-07-10 由产品所有者明确接受，现为前向产品成熟度 Roadmap。

本文件保留旧 M0-M8 路线作为历史工程 ledger，但自 R0 起，项目成熟度只按 R0-R8 Gate 判断。M0-M6 Gate 结论不被重写；它们继续作为历史工程证据保留在 `docs/GATE-M0.md` 至 `docs/GATE-M6.md` 与 `project/history/PROJECT_STATUS-M0-M7-LEDGER.md` 中。当前执行状态只见 `PROJECT_STATUS.md`。

## R0-R8 前向阶段

| 阶段 | 名称                         | 核心问题                                 | 退出结论               |
| ---- | ---------------------------- | ---------------------------------------- | ---------------------- |
| R0   | Recovery Baseline            | 仓库、状态、分支和产品事实是否可信       | `R0_GATE = PASS`       |
| R1   | Authoritative Client Runtime | Web 客户端是否真正接入权威模拟           | `R1_GATE = PASS`       |
| R2   | First Playable Court Loop    | 玩家是否能理解并完成一个月度治理循环     | `R2_GATE = PASS`       |
| R3   | Strategic World Map          | 地图是否成为理解局势和发起行动的主要界面 | `R3_GATE = PASS`       |
| R4   | Integrated Campaign Loop     | 治理、动员、行军、围城和战后是否真正连通 | `R4_GATE = PASS`       |
| R5   | Product Alpha                | 玩家能否从开局玩到一种终局               | `R5_GATE = PASS`       |
| R6   | Content Alpha                | 内容管线能否支持目标场景和历史质量       | `R6_GATE = PASS`       |
| R7   | Beta Content Lock            | 系统、体验、内容和平台是否允许锁定       | `R7_GATE = HUMAN_PASS` |
| R8   | Release Candidate / 1.0      | 构建是否达到真实发布标准                 | `R8_GATE = HUMAN_PASS` |

当前结论：`R0_GATE=PASS`。证据为 `RR0-EXIT-VALIDATION-001`、PR #249、`origin/main@81b11f1a7a0210591cd266b8fcf6a47edd6da554`、systems PASS recommendation 与独立 QA ACCEPT。R1 task graph 尚未建立。

## 执行边界

- R0 只做恢复基线、状态对齐、生产入口/fixture/no-op 清点和 R0 Gate 验证；不制作新地图、美术、内容或 R1 实现。
- R1 前不得继续新的玩家功能、内容填充、美术生产或内容锁。
- R3 通过前不得把当前地图方向包装为正式战略地图内容。
- R7 前不得正式内容锁；R8 前不得商店提交、正式签名发布或商业承诺。
- 手动节点会战继续保持 `DEFER_MANUAL_NODE_BATTLE`，不阻塞 R0-R8。
- 服务器、多人、遥测、任意代码 Mod、Rust/WASM、复杂海战和 3D 战斗继续不在 1.0 自动范围内。

详细交付、Gate 证据规则、失败规则和近期任务序列见 `docs/29-product-recovery-roadmap.md`。

## 历史 M0-M8 Roadmap（非前向权威）

以下内容保留 2026-07-10 前的工程阶段记录。它不再决定前向产品成熟度，也不得覆盖已接受的 R0-R8 Roadmap。

## M0 — 仓库与执行基线

### 目标

让人类和 Codex 能在同一规则下安全并行工作。

### 交付

- pnpm monorepo；
- Node/TS/Vite/Vitest/ESLint/Prettier 基线；
- package 边界检查；
- Web、Worker、Node Runner、Electron 空壳；
- CI；
- Storybook/Playwright；
- 任务协议、ADR、Skill、自定义 agents；
- Hello-world deterministic hash。

### 退出条件

- 干净 checkout 一条命令安装/检查；
- 浏览器 Worker 与 Node Runner 对同一输入返回相同 hash；
- Windows CI 生成 Web 和未签名 Electron smoke 包；
- 无游戏玩法实现超出 hello-world。

## M1 — 确定性模拟骨架

### 目标

建立不可被 UI 绕过的世界与命令模型。

### 交付

- branded IDs、Definition/State 分离；
- GameDay scheduler；
- Command/Event/Query；
- DeterministicRng；
- snapshot/save v1；
- Worker protocol；
- state hash、replay tail、不变量 runner；
- 30-node graph fixture。

### 退出条件

- 3650 日无头运行无不变量破坏；
- Chrome/Node/Electron hash 一致；
- 损坏存档被安全拒绝；
- 关键 API 有文档和测试。

## M2 — 世界、经济与人口纵切

### 目标

证明季节、劳力、粮食和路线形成联动。

### 交付

- 30 District/10 Settlement fixture；
- 季节区域曲线；
- 农事阶段、人口组、粮食/现金/劳力；
- 市场和基础运输；
- 地图渲染、缩放/选取/模式；
- 地区面板与 4,000 行列表压力 fixture。

### 退出条件

- 动员跨农时会影响下一收获；
- 道路与河运在季节中产生不同路线选择；
- 正常速度 UI 无主线程模拟卡顿；
- 内容编译器能拒绝坏图和坏引用。

## M3 — 政体、职位、人物与臣属

### 目标

证明“把权力交给谁”和“如何统治”比直接占地更有价值。

### 交付

- Polity、宗主链、义务；
- 行政负荷；
- 50–80 人物、关系、职位；
- 任命/分封/方针；
- 贡赋与出兵履约；
- 战后安排原型；
- 继承最小状态机。

### 退出条件

- 三种战后统治方式在 24 月内有不同后果；
- 领主更换保留辖区方针但改变执行表现；
- 宗主链无环、义务可审计；
- 人物行为理由可显示。

## M4 — 战役、补给、攻城纵切

### 目标

完成“准备—出征—攻城—结算—赏罚”闭环。

### 交付

- 战役计划、集结日、同步到达；
- 动员、库存、运输容量、补给线；
- FactionKnowledge；
- 行军、拦截、撤退；
- 自动战斗；
- 攻城选择、投降条件；
- 战报和 postwar settlement。

### 退出条件

- 玩家能在雨季前完成/取消一场有预测的战役；
- AI 能解释等待、撤军和目标变化；
- 战争损失回流经济、忠诚和信用；
- 同一战斗可重放。

## M5 — 可玩垂直切片

### 目标

验证产品支柱，不追求内容规模。

### 内容

- 2 主要政体 + 3 小政体；
- 1–2 个完整历史启发场景；
- 约 2–4 小时可重复体验；
- 教学、存读档、Web 部署、Windows 包；
- AI 可完整运行多个游戏年。

### 决策门

- Web 性能是否满足一级平台；
- 手动节点会战是否进入 1.0；
- Electron 内存/包体是否接受；
- 臣属机制是否真正优于直接吞并；
- 内容研究与生产成本是否可承受。

未通过时调整设计或平台，不进入盲目扩内容。

## M6 — Alpha：系统完整

### 交付

- 完整外交、合法性、继承；
- 多层 AI；
- 政策、事件、百科；
- 三剧本数据管线；
- 完整地图候选；
- 批量自动跑局与 balance dashboard；
- 可访问性核心流程；
- 是否实现手动会战的最终决定。

### 退出条件

- 从开局到一种胜利可完整游玩；
- 无 P0/P1 数据损坏；
- AI 无需玩家救援可运行完整局；
- 主要系统没有占位 UI。

## M7 — Beta：内容与质量

- 历史、文化、语言审查；
- 全剧本、人物、事件填充；
- 平衡与反滚雪球；
- 性能、内存、加载；
- Chrome/Edge/Firefox/Windows 矩阵；
- 存档迁移和云存档候选；
- 教学、提示、百科；
- 音频、美术和本地化完整化。

退出条件：内容锁定，只有缺陷修复和明确调平，不新增大系统。

## M8 — Release Candidate / 1.0

- 安全与供应链审计；
- 许可证/SBOM；
- 安装、更新、卸载、备份；
- Web CDN/cache/恢复；
- 崩溃与诊断；
- 发布版长跑与人工通关；
- 商店资料与文化鸣谢；
- 回滚方案。

## 1.0 后决策门

按真实数据决定：macOS Electron、数据 Mod/Workshop、节点会战扩展、更多地图与时代。任何一项都重新走 ADR 和资源评估。
