# ADR-001-web-first：Web-first 与 Electron Windows

- 状态：Accepted
- 日期：2026-06-23

## 上下文

项目主要复杂度来自规则、数据、AI、信息密集 UI 和自动测试，而不是大型 3D、物理或动画。AI Agent 在源码、浏览器、Storybook、Playwright 和结构化日志驱动的工作流中，比在 Unity 场景/Prefab/Inspector 驱动的工作流中更高效。

## 决定

使用 Web-first：浏览器应用是主体；Windows 由 Electron 封装同一 renderer。Web 与桌面共享 UI、地图和模拟实现。

## 后果

获得快速 HMR、自动浏览器测试、同语言工具链和 Web 发布。接受 Electron 包体与基础内存成本，以及自行搭建游戏地图/模拟工具的责任。

