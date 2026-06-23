# ADR-002-typescript-only-first：首版单语言 TypeScript

- 状态：Accepted
- 日期：2026-06-23

## 决定

模拟、客户端、Node Runner、内容工具和 Electron 壳首版均使用 TypeScript。禁止在性能证据出现前引入 Rust/WASM。

## 原因

减少跨语言边界、序列化、构建和 Agent 调试成本。当前规模的主要风险是算法与 UI 重建，不是语言吞吐上限。

## 升级触发

只有经 profiler 证明的独立纯计算热点，且 TypeScript 算法/数据结构优化仍不能达标时，才可用 ADR 提议 WASM 内核。

