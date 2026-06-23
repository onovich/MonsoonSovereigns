# ADR-004-deterministic-command-model：确定性 Command 模型

- 状态：Accepted
- 日期：2026-06-23

## 决定

所有世界修改经显式 `GameCommand`，产生语义 Domain Events 和 ReadModelDelta。随机数、阶段顺序和 tie-breaker 可复现。

## 不采用

不采用 UI 直接改对象、全量事件溯源或 Unity 风格组件状态。存档使用版本化快照加短尾部日志。

