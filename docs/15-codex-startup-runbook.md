# Codex 项目启动 Runbook

## 1. 将交接包作为仓库根

解压后初始化 Git；不要把 Skill 放在仓库外才开始。先保留所有文档和模板的首个基线提交。

```bash
git init
git add .
git commit -m "docs(project): establish monsoon sovereigns handoff baseline"
```

## 2. 安装/发现 Skill

仓库级路径已是：

```text
.agents/skills/monsoon-studio-orchestrator
```

Codex 会从仓库 `.agents/skills` 发现。若复制到个人目录，使用：

```text
$HOME/.agents/skills/monsoon-studio-orchestrator
```

重新打开 Codex 后用 `/skills` 或 `$monsoon-studio-orchestrator` 显式调用。

## 3. 信任项目配置

Codex 只有在信任项目后才加载 `.codex/config.toml`、项目 agents 和相关规则。检查 `.codex/agents/*.toml` 是否可见。

## 4. 首条主线程提示

```text
使用 $monsoon-studio-orchestrator 接管《季风诸王》项目。
先读取 README.md、PROJECT_STATUS.md、AGENTS.md、docs/11-roadmap.md、docs/14-multi-agent-operating-model.md。
创建 FOUNDATION-001 任务图，只执行 M0 仓库与工具链基线。
显式 spawn systems_architect 审查目录与依赖，release_engineer 建立跨平台脚本，qa_reviewer 定义验收。
不要实现经济、人物、战斗或历史内容。
所有子线程完成后按 handoff 的 ROUTE_TO 用 send_input 路由；最终给出已运行命令、未决风险和下一任务，不把未审查工作标记 ACCEPTED。
```

## 5. 初始化交接任务图

首次启动运行：

```bash
node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs seed-initial
node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs list
node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs ready
```

`seed-initial` 可重复执行，只会跳过已存在的任务 ID。初始任务保持 `DRAFT`；协调者阅读并验证范围后，才可将当前任务改为 `READY`。

## 6. M0 建议首轮任务

```text
FOUNDATION-001  monorepo 与版本基线
FOUNDATION-002  package 边界和 tsconfig strict
FOUNDATION-003  Web/Worker/Node runner hello hash
FOUNDATION-004  Vitest/Playwright/Storybook 基线
FOUNDATION-005  Electron 安全空壳
FOUNDATION-006  CI、artifact 与门禁
FOUNDATION-007  taskctl/message/ADR 流程验证
```

依赖详见 `docs/18-initial-backlog.md` 和 `project/tasks/initial-backlog.json`。

## 7. 每次新主线程恢复上下文

```text
读取 PROJECT_STATUS、AGENTS、当前 milestone、`project/tasks/active/` 下的任务 JSON 和最近 handoff。
运行 git status 与项目 health check。
不要凭会话记忆覆盖仓库事实。
```

## 8. Skill 自检

```bash
node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs seed-initial
node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs list
node .agents/skills/monsoon-studio-orchestrator/scripts/validate-handoff.mjs \
  .agents/skills/monsoon-studio-orchestrator/assets/examples/example-handoff.json
```

## 9. 启动成功标准

- Codex 能列出自定义 agents；
- Skill 可显式调用；
- 任务脚本可在 Windows/Node 运行；
- 主线程能 spawn 至少一个只读 reviewer；
- handoff 可落盘并路由；
- M0 未提前引入业务功能；
- 所有决定仍与 `PROJECT_STATUS.md` 一致。
