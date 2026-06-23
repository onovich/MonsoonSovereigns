# ADR-003-worker-authoritative-simulation：Dedicated Worker 权威模拟

- 状态：Accepted
- 日期：2026-06-23

## 决定

浏览器/Electron renderer 的权威模拟运行在 Dedicated Web Worker。主线程只持有 UI 状态、read model 与地图表现。

## 约束

主线程不得直接写世界；Worker 只通过版本化消息协议交流。Node Runner 复用同一 sim-core，不依赖 Worker API。

