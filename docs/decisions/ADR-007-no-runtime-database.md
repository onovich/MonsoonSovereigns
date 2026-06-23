# ADR-007-no-runtime-database：游戏运行时不使用 SQL/ORM

- 状态：Accepted
- 日期：2026-06-23

## 决定

运行时内容编译为只读 pack，世界状态使用 ID + 数组/稠密表。存档为版本化文档/二进制包。SQLite 只可用于离线编辑或分析工具。

