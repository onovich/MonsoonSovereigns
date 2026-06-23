# 开放决定与决策时点

这些问题刻意不在交接时拍板。执行者不得通过实现细节偷偷决定。

| ID | 问题 | 最迟决定 | 所需证据 | 决策者 |
|---|---|---|---|---|
| O-001 | 正式产品名/商标 | M7 前 | 商标、市场、文化反馈 | 人类产品所有者 |
| O-002 | Redux Toolkit 或更小 store | M0 | read-model spike、DevTools、bundle | architect + client |
| O-003 | Zod 或 TypeBox | M0/M1 | Worker/Node schema 性能和类型体验 | architect |
| O-004 | 1.0 是否手动节点会战 | M5 | 自动战斗闭环、原型、玩家测试 | 产品所有者 + designer |
| O-005 | 完整地图和可玩政体数量 | M5/M6 | 内容工具、研究成本、性能 | lead + historian + designer |
| O-006 | 美术风格与肖像方案 | M5 | 概念验证、预算、文化审查 | 产品所有者 |
| O-007 | 首发语言 | M5/M6 | 市场与本地化成本 | 产品所有者 |
| O-008 | 1.0 数据 Mod | M6 | schema 稳定、安全、支持成本 | architect + security + product |
| O-009 | Steam/其他渠道、定价 | M7 | 商业计划 | 产品所有者 |
| O-010 | macOS Electron | 1.0 后或 M6 特批 | 需求、QA、签名、公证 | 产品所有者 |
| O-011 | 可选遥测/崩溃报告 | M6 | 隐私、安全、实际调试需求 | product + security |
| O-012 | 历史锁定模式程度 | M5 | 沙盒与教学测试 | designer + historian |

每项决定需 ADR/产品记录，包含“为什么现在决定”和反向迁移成本。
