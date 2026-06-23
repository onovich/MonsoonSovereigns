# 风险登记与总体测试策略

## 1. 顶级风险

| ID | 风险 | 早期信号 | 缓解 | 所有者 |
|---|---|---|---|---|
| R-001 | 系统很多但核心不成立 | 玩家仍总选直接吞并 | M3/M5 三种统治方式测试 | gameplay_designer |
| R-002 | TypeScript 模拟性能不足 | 月初 Worker 长任务、Runner 慢 | 算法/数据结构/切片后再 WASM ADR | simulation_engineer |
| R-003 | React/Pixi UI 卡顿 | 大列表、标签重渲染 | read model、虚拟化、LOD、基准 | client_engineer |
| R-004 | AI 不行动且无法解释 | trace 为空或理由泛化 | reason code、scenario tests | simulation_engineer |
| R-005 | 后期滚雪球 | 单势力快速不可逆集中 | 行政、继承、臣属、威胁联盟 | balance_analyst |
| R-006 | 玩家被自治剥夺 | 代理人做关键决定无授权 | 权限、预览、撤销/问责 | gameplay_designer |
| R-007 | 后期微操爆炸 | 操作数随领地线性增长 | 批量命令、方针、例外管理 | client_engineer |
| R-008 | 历史民族化/刻板化 | 文化等同 buff 或现代边界 | claim records、顾问、审查 | historical_researcher |
| R-009 | 暴力机制被奖励化 | 强迁成为无代价最优 | 人类代价、信用、恢复、审查 | gameplay_designer |
| R-010 | 内容成本失控 | 人物/地图先于工具 | M0–M3 数据管线优先 | lead_orchestrator |
| R-011 | Web 存档丢失 | IndexedDB eviction | 导出、持久存储、备份提示 | client_engineer |
| R-012 | Electron 安全/供应链 | 宽 IPC、远程内容 | preload 白名单、审计、SBOM | security_reviewer |
| R-013 | 多代理互相覆盖 | 同文件双写、范围膨胀 | 单 writer、worktree、路由 skill | lead_orchestrator |
| R-014 | 决定漂移 | 实现悄改冻结方向 | ADR、PROJECT_STATUS、审查门禁 | systems_architect |
| R-015 | 存档兼容成为负债 | 隐式序列化对象图 | 显式 schema/migrations/golden | simulation_engineer |

## 2. 测试金字塔

### 静态

- TypeScript strict；
- lint/format；
- package dependency；
- schema/内容引用；
- Electron 配置；
- 许可证/漏洞。

### 单元与属性

- 数值公式；
- Command validation；
- 状态机；
- 资源守恒；
- 宗主链无环；
- 图路线；
- RNG domain；
- save migrations。

### 场景

小型具名 fixture 验证设计行为：粮尽撤军、雨季河运、臣属拒绝、继承分裂、战后安排。

### 集成

Worker protocol、Node runner、内容加载、IndexedDB/文件适配器、Pixi read delta。

### E2E/视觉

浏览器核心流程、响应式、键盘、批量命令、存读档、GPU context 重建。

### 长跑与统计

数百/数千种子模拟、性能趋势、平衡分布、崩溃和不变量。

### 人工可玩/文化

系统可理解性、决策质量、历史表达、顾问审查不能完全自动化。

## 3. 确定性测试

每个 release 保留：

- 小型 30-day canary；
- 10-year standard scenario；
- 战役重放；
- save round-trip；
- Chrome/Node/Electron state hash。

如果有意改变结果，必须在 ADR/变更记录说明原因并更新 golden；不得盲目接受新 hash。

## 4. 性能测试矩阵

基准规模：

```text
4,000 人物
2,500 地区
10,000 路线边
500 活动军队
100 政体
4,000 行虚拟列表
大量地图标签
```

记录：日/秒、P50/P95/P99 step、月度任务最长 slice、主线程 long task、Worker 内存、渲染 FPS、首次加载、存档时间/体积。

目标：战略地图 1080p ≥30 FPS 基线、正常推进无可感知卡顿；具体预算由 M2/M5 设备矩阵冻结。

## 5. 安全测试

- preload API 形状；
- IPC 参数 fuzz/路径 traversal；
- 外部链接 allowlist；
- CSP/远程脚本；
- 内容 zip/Mod 解压安全；
- 存档畸形输入；
- 依赖审计；
- 浏览器 origin/storage 行为。

## 6. 历史与文化 QA

- 来源覆盖率；
- 低置信内容标签；
- 现代国界/民族本质主义扫描；
- 术语和转写一致性；
- 暴力事件受害者后果；
- 美术年代/地域；
- 关键文本由文化读者审阅。

## 7. 缺陷严重度

- P0：数据损坏、远程代码、安全泄漏、无法启动。
- P1：确定性破坏、资源/所有权不变量、主要流程阻断、严重文化伤害。
- P2：可见规则错误、AI 显著错误、性能长卡、UI 无法操作。
- P3：局部表现、文案、非阻断不一致。

P0/P1 必须先回归测试再修复；发布候选不得保留已知 P0/P1。
