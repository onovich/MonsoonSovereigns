# Contributing / Codex 执行入口

本项目以仓库文件为真相源。任何人或代理开始工作前必须阅读：

1. `AGENTS.md`
2. `PROJECT_STATUS.md`
3. `docs/05-coding-standards.md`
4. `docs/06-delivery-workflow.md`
5. 当前任务 JSON 与相关系统规格

最小规则：

- 一个任务一个主写者，另设独立 reviewer；禁止多人同时修改同一文件域。
- 只修改任务 `allowed_paths`；超出范围先路由，不顺手修。
- 玩家和 AI 只能经 Command 改变权威状态。
- 不在 UI、Pixi 或 Electron 中复制领域规则。
- 不使用 `Math.random()`、真实时钟、未定义排序或渲染帧率决定模拟。
- 任何测试结果必须是实际执行记录。
- 公共协议、存档、RNG、时间顺序、内容 schema 或冻结决定变更必须走 ADR。
- 历史具体内容必须有来源记录；不确定即标记 `RESEARCH REQUIRED`。

任务和交接使用：

```bash
node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs seed-initial
node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs ready
```

完整定义见 `.agents/skills/monsoon-studio-orchestrator/SKILL.md`。
