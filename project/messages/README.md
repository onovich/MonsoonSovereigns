# Project Message Bus

- `outbox/`：线程产出的已验证 handoff；协调线程从这里读取并通过 Codex `send_input` 路由。
- `inbox/`：可选的人类/外部输入快照；不是线程真相源。
- 后续可新增 `archive/` 存放已处理消息。

消息必须符合 `project/schemas/handoff.schema.json`。线程 ID 只在当前 Codex 会话可靠；持久状态由 task/handoff 文件承担。
