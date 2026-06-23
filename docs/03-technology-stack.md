# 03. 技术栈选择及原因

**状态：FROZEN；版本号以启动锁文件为准**

## 1. 最终选择

| 领域 | 选择 |
|---|---|
| 语言 | TypeScript 6.x，严格模式 |
| Runtime | Node.js 24 LTS |
| 包管理 | pnpm 11，workspace + lockfile |
| Web 构建 | Vite 8 |
| UI | React 19.2 |
| 地图 | PixiJS 8.19，WebGL2 基线 |
| 桌面 | Electron 42 稳定支持线，Electron Forge/自有打包脚本 |
| 模拟隔离 | Dedicated Web Worker |
| 客户端状态 | Redux Toolkit，仅 UI/read model；或等价小型明确 store，首次实现前冻结 |
| 表格/虚拟化 | TanStack Table + TanStack Virtual |
| schema | Zod 或 TypeBox 二选一，经小型 spike 后 ADR；不得双栈 |
| 单元测试 | Vitest |
| 属性测试 | fast-check |
| 组件隔离 | Storybook |
| E2E | Playwright |
| 内容 | CSV + JSON + GeoJSON，经编译器生成 runtime pack |
| Web 存储 | IndexedDB adapter + 文件导出 |
| 桌面存储 | Electron main 文件 adapter |

### 2026-06-23 参考基线

- Node.js 24 为 LTS；Node 官方在该日期列出 v24.17.0 为最新 LTS。
- TypeScript 6.0 已正式发布。
- React 最新稳定主线为 19.2。
- Vite 8 已在 2026-03-12 正式发布，使用 Rolldown。
- PixiJS 8.19 已发布；正式渲染仍以 WebGL2 为保守基线，WebGPU 可实验。
- Electron 42.4.1 为当日稳定支持版本之一；Electron 只支持近期 major，必须持续升级。

不要把这些 patch 永久写死在文档中。启动仓库应提交 lockfile、`.node-version` 和 package manager version，之后按升级政策维护。

## 2. 为什么不再选择 Unity

Unity 能满足平台和渲染要求，但在本项目“主要由 AI Agent 持续执行”的组织约束下存在明显成本：

- 场景、Prefab、Inspector 引用和序列化状态不完全由文本表达。
- 很多错误必须打开编辑器、切场景和操作 GUI 才能复现。
- Agent 较难可靠验证断开的资源引用和布局状态。
- 无界面规则、UI、编辑器工具和构建 API 分散。
- 浏览器自动交互、截图、Trace 和可访问性检查不如 Web 原生工具自然。

本项目重规则、数据、AI 和信息 UI，轻物理和 3D，因此牺牲成熟 3D 编辑器，换取源码化状态、HMR、Playwright、Storybook 和单语言工具链更划算。

## 3. 为什么不是 Godot

- Godot 开源和桌面能力优秀。
- 但 C# Web 导出长期存在限制/差异；改用 GDScript 会让工具与模拟语言分裂。
- 对 AI Agent，场景/资源编辑仍不如 DOM + 源码 + 浏览器测试透明。

若产品未来放弃 Web 且需要更强本地 2D 编辑器，可重新评估，但不作为当前备选分支同步维护。

## 4. 为什么 Electron 而不是 Tauri

Electron 的代价：安装包更大、基础内存更高、升级频繁。选择它的原因：

- Windows 桌面和开发 Chrome 使用相近 Chromium 行为。
- main、preload、renderer 均可用 TypeScript。
- Agent 无需同时维护 Rust、capability、IPC 类型同步和系统 WebView 差异。
- DevTools、Playwright 和渲染问题更容易复现。

桌面壳必须薄化在 `PlatformAdapter` 后；实际数据证明 Electron 无法接受时，才能通过 ADR 评估 Tauri，而不是提前承担双技术栈。

## 5. 为什么首版不使用 Rust/WASM

预期世界规模并不会天然压垮 JavaScript。真正风险是：

- AI 候选组合爆炸。
- 重复寻路与补给网络计算。
- UI 和地图标签全量重建。
- 主线程与模拟竞争。

这些要先通过候选裁剪、缓存、脏标记、Worker、虚拟化和正确数据结构解决。Rust/WASM 会增加绑定、构建、调试、序列化和双语言心智成本，直接损害最重要的 AI 开发效率。

允许后期迁移的候选仅限独立纯计算内核，例如批量寻路或大规模参数搜索，且必须由 profiler 数据触发。

## 6. 为什么 React + PixiJS 分工

React/DOM 强项：

- 多列表格、表单、筛选、布局、文本和可访问性。
- Storybook、测试、浏览器自动化。
- 响应式 UI 与高 DPI 文本。

PixiJS 强项：

- 地图 Mesh、道路、区域填色、军队、动画和大量精灵。
- WebGL 批处理和自定义 shader。

不把全部 UI 画进 Canvas，避免文字模糊、复杂表格与无障碍困难；也不让 React reconciliation 控制几千地图对象。

## 7. Web 与平台策略

### 正式支持

- Windows 10/11 Electron。
- Chrome/Edge 当前稳定版 Web。

### 二级

- Firefox 稳定版。

### 尽力兼容

- macOS Chrome/Edge Web。

### 暂缓

- macOS Electron 应用。
- Safari。
- 移动浏览器和触屏专用 UI。

业务层不得出现 Windows 路径或 Electron 全局对象。所有平台能力经接口注入，以保留 macOS/Tauri 可能性。

## 8. 安全边界

Electron：

```text
nodeIntegration = false
contextIsolation = true
sandbox = true
```

- renderer 不能 `require('fs')`。
- preload 只暴露具体白名单方法。
- 每个 IPC payload 做 runtime schema 校验。
- 禁止任意 channel、任意路径写入和任意 URL shell open。
- Web 内容只从打包/可信 origin 加载，设置严格 CSP。
- 不执行用户 Mod JavaScript。

Electron 官方要求保持版本更新，因为应用自带 Chromium 和 Node。项目每月评估 patch、每个受支持 major 到期前升级，安全修复不得等待功能里程碑。

## 9. 版本与依赖政策

- 生产依赖锁精确版本，lockfile 必须冻结。
- patch/minor 由 Renovate/Dependabot 生成独立 PR，必须通过完整 CI。
- major 更新需要 ADR 或升级记录，禁止与功能 PR 混合。
- 禁止依赖未维护、无许可证、安装脚本不透明或大幅增加 bundle 的包。
- 新包必须说明“为什么不能用平台 API/现有依赖完成”。
- React Server Components、SSR、Next.js 不进入本项目；这是静态客户端游戏。

## 10. AI 开发效率设施

- Vite HMR 缩短反馈循环。
- 每个复杂 UI 有 Storybook fixtures。
- Playwright 可直接调用开发调试 API，保存 screenshot/trace。
- Node Runner 与浏览器共用 sim-core。
- 所有内容和配置为文本，可 diff、校验和生成。
- 代理通过 repo 内 Skill、任务 JSON 和交接消息协作。

## 11. 被否决的方案

| 方案 | 否决原因 |
|---|---|
| Unreal | Web 不自然，3D/包体/工具复杂度过剩 |
| 自研 C++ 引擎 | 编辑器、字体、输入、构建和平台工作量不可控 |
| Phaser 全栈游戏框架 | 对信息型 DOM UI 和自定义模拟边界约束不如 React + Pixi 清晰 |
| Electron + React Canvas 全 UI | 文本、表格、可访问性和高 DPI 风险 |
| Next.js/SSR | 无服务器渲染需求，增加运行和安全表面 |
| 运行时 SQLite/ORM | 状态规模和查询不需要，Web 兼容成本无收益 |
| SharedArrayBuffer 首发 | 跨源隔离与并发复杂度不必要 |

## 12. 官方参考

- Node.js Releases: https://nodejs.org/en/about/previous-releases
- TypeScript 6.0 release notes: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html
- React 19.2: https://react.dev/blog/2025/10/01/react-19-2
- Vite 8: https://vite.dev/blog/announcing-vite8
- PixiJS June 2026 update: https://pixijs.com/blog/june-2026
- Electron releases: https://releases.electronjs.org/
- Electron security: https://www.electronjs.org/docs/latest/tutorial/security
- Electron support schedule: https://releases.electronjs.org/schedule
