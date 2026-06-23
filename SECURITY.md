# Security Baseline

安全边界和发布政策以 `docs/22-privacy-security-legal.md`、`docs/03-technology-stack.md`、`docs/05-coding-standards.md` 为准。

首发硬约束：

- Electron `nodeIntegration=false`、`contextIsolation=true`、`sandbox=true`。
- Renderer 不获得 Node、文件系统、任意 IPC、任意 shell URL 或任意路径访问。
- Worker、IPC、存档、Mod、内容包和导入文件均视为不可信输入，必须运行时 schema 校验和限额检查。
- 不执行任意用户 JavaScript/TypeScript Mod。
- 不从远程 origin 加载可执行代码；设置严格 CSP。
- 依赖固定版本、提交 lockfile、审查许可证和安装脚本。
- 发现凭据、恶意内容解析、路径穿越、任意代码执行、供应链或存档破坏风险时，任务立即标为 `BLOCKED`，路由 `security_reviewer` 与 `lead_orchestrator`，不得静默修补后继续。
