# ADR-008-react-pixi-boundary：React 与 PixiJS 边界

- 状态：Accepted
- 日期：2026-06-23

## 决定

React DOM 负责窗口、表格、表单、提示和可访问性；PixiJS 命令式负责地图、道路、区域、军队和高频标签。React 不为每个地图实体创建组件。

