# ADR-005-platform-priority：平台优先级与 macOS 暂缓

- 状态：Accepted
- 日期：2026-06-23

## 决定

一级支持 Windows Electron 与 Chrome/Edge Web；Firefox 二级；macOS 浏览器尽力兼容；macOS 桌面版暂缓。

## 原因

减少签名、公证、双架构和平台 QA 成本，同时保留未来 Electron/Tauri adapter 路径。禁止业务代码直接依赖 Windows API。

