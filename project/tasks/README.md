# Tasks

- `initial-backlog.json`：交接时的 M0/M1 建议图，不表示已执行。
- `active/<TASK_ID>.json`：运行中任务。
- `archive/<TASK_ID>.json`：已关闭任务。
- `thread-registry.json`：当前 Codex 会话的角色线程映射，可重建。

使用 Skill 的 `taskctl.mjs` 管理，避免多个线程手改同一任务状态。

首次启动：

```bash
node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs seed-initial
```

该命令把 `initial-backlog.json` 中尚不存在的任务复制到 `active/`，可重复执行。
