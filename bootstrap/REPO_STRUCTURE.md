# 建议目标仓库结构

```text
apps/
  web/                 React + Vite + Worker entry
  desktop/             Electron main/preload/package
  sim-runner/          Node headless CLI
packages/
  sim-core/            权威世界、命令、系统、RNG
  sim-ai/              战略/战役/地方/战术 AI
  protocol/            Worker 消息和 schema
  save-format/         envelope、migration、checksum
  content-schema/      Definition 与 source schema
  client-core/         command bus、read models、platform port
  map-renderer/        PixiJS
  ui/                  React UI
  platform/            Browser/Electron adapters
tools/
  content-compiler/
  balance-lab/
  save-inspector/
  architecture/
tests/
  fixtures/
  golden-saves/
  ai-scenarios/
content-source/
  maps/
  polities/
  officers/
  events/
  localization/
```

M0 只创建必要空壳，不一次性生成所有占位文件。每个 package 明确公共 API 和依赖方向。

## TypeScript lib 分层

基础 `tsconfig` 只包含 `ES2024`，避免 `sim-core` 意外获得 DOM/Node 类型。各包自行增加：

- Web UI：`DOM`, `DOM.Iterable`
- Worker：`WebWorker`
- Node/Electron main：对应锁定版本的 Node 类型
- sim-core：不增加宿主类型
