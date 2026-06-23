# 交接包清单（Manifest）

基线日期：2026-06-23  
项目：Monsoon Sovereigns / 《季风诸王》  
用途：把本包直接作为新 Git 仓库根目录，并由 Codex 多线程团队从 M0 执行。

## 包摘要

- 文件数（不含本 Manifest 与 `SHA256SUMS.txt`）：**113**
- 总大小（未压缩）：**287,456 bytes**
- 可读文本行数约：**8,005**
- 初始任务：**8 个**，均已播种到 `project/tasks/active/`，状态为 `DRAFT`
- 独立 Codex 角色：**12 个**
- 可安装 Skill：`monsoon-studio-orchestrator-skill.zip`

## 分类

| 类别 | 文件数 |
|---|---:|
| Codex Skill | 13 |
| Codex 角色配置 | 12 |
| 产品/技术/研究文档 | 26 |
| 任务/消息/schema/模板 | 25 |
| 可安装包 | 1 |
| 工程启动样例 | 9 |
| 架构决策记录 | 9 |
| 根级执行与治理文档 | 8 |
| 系统设计文档 | 10 |

## 必需入口

1. `README.md`
2. `HANDOFF_EXECUTION_BRIEF.md`
3. `PROJECT_STATUS.md`
4. `AGENTS.md`
5. `docs/15-codex-startup-runbook.md`
6. `.agents/skills/monsoon-studio-orchestrator/SKILL.md`
7. `VALIDATION_REPORT.md`

## 完整性

`SHA256SUMS.txt` 对包内所有文件生成 SHA-256，唯独不包含自身。解压后可在支持 `sha256sum` 的环境执行：

```bash
sha256sum -c SHA256SUMS.txt
```

Windows PowerShell 可逐项使用 `Get-FileHash -Algorithm SHA256`，或在 CI/Node 工具中校验。

## 完整文件清单

```text
.agents/skills/monsoon-studio-orchestrator/SKILL.md
.agents/skills/monsoon-studio-orchestrator/agents/openai.yaml
.agents/skills/monsoon-studio-orchestrator/assets/examples/example-handoff.json
.agents/skills/monsoon-studio-orchestrator/assets/templates/handoff.json
.agents/skills/monsoon-studio-orchestrator/assets/templates/task.json
.agents/skills/monsoon-studio-orchestrator/references/message-protocol.md
.agents/skills/monsoon-studio-orchestrator/references/role-selection.md
.agents/skills/monsoon-studio-orchestrator/references/routing-workflow.md
.agents/skills/monsoon-studio-orchestrator/scripts/emit-handoff.mjs
.agents/skills/monsoon-studio-orchestrator/scripts/handoff-lib.mjs
.agents/skills/monsoon-studio-orchestrator/scripts/render-route-message.mjs
.agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs
.agents/skills/monsoon-studio-orchestrator/scripts/validate-handoff.mjs
.codex/agents/balance-analyst.toml
.codex/agents/client-engineer.toml
.codex/agents/gameplay-designer.toml
.codex/agents/historical-researcher.toml
.codex/agents/lead-orchestrator.toml
.codex/agents/qa-reviewer.toml
.codex/agents/release-engineer.toml
.codex/agents/research-scout.toml
.codex/agents/security-reviewer.toml
.codex/agents/simulation-engineer.toml
.codex/agents/systems-architect.toml
.codex/agents/test-engineer.toml
.codex/config.toml
AGENTS.md
CONTRIBUTING.md
HANDOFF_EXECUTION_BRIEF.md
PROJECT_STATUS.md
README.md
SECURITY.md
VALIDATION_REPORT.md
bootstrap/.editorconfig
bootstrap/.gitignore
bootstrap/.node-version
bootstrap/CODEX_FIRST_PROMPT.txt
bootstrap/DEPENDENCY_POLICY.md
bootstrap/REPO_STRUCTURE.md
bootstrap/package.json.example
bootstrap/pnpm-workspace.yaml.example
bootstrap/tsconfig.base.json
docs/00-project-charter.md
docs/01-game-design-document.md
docs/02-program-design-document.md
docs/03-technology-stack.md
docs/04-software-architecture.md
docs/05-coding-standards.md
docs/06-delivery-workflow.md
docs/07-system-design-index.md
docs/08-content-balance-guide.md
docs/09-world-history-culture.md
docs/10-historical-research-policy.md
docs/11-roadmap.md
docs/12-future-content.md
docs/13-risk-register-and-test-strategy.md
docs/14-multi-agent-operating-model.md
docs/15-codex-startup-runbook.md
docs/16-research-bibliography.md
docs/17-glossary.md
docs/18-initial-backlog.md
docs/19-data-schema-guide.md
docs/20-reference-game-analysis.md
docs/21-art-audio-localization.md
docs/22-privacy-security-legal.md
docs/23-milestone-acceptance-matrix.md
docs/24-open-decisions.md
docs/25-decision-history-and-rejected-directions.md
docs/decisions/ADR-000-decision-policy.md
docs/decisions/ADR-001-web-first.md
docs/decisions/ADR-002-typescript-only-first.md
docs/decisions/ADR-003-worker-authoritative-simulation.md
docs/decisions/ADR-004-deterministic-command-model.md
docs/decisions/ADR-005-platform-priority.md
docs/decisions/ADR-006-polity-control-model.md
docs/decisions/ADR-007-no-runtime-database.md
docs/decisions/ADR-008-react-pixi-boundary.md
docs/systems/01-world-time-map.md
docs/systems/02-polity-vassalage-governance.md
docs/systems/03-characters-court-succession.md
docs/systems/04-economy-population-trade.md
docs/systems/05-campaign-logistics-intelligence.md
docs/systems/06-battle-siege.md
docs/systems/07-diplomacy-legitimacy.md
docs/systems/08-ai-proposals-explainability.md
docs/systems/09-ui-ux-accessibility.md
docs/systems/10-save-content-mods.md
monsoon-studio-orchestrator-skill.zip
project/messages/README.md
project/messages/inbox/.gitkeep
project/messages/outbox/.gitkeep
project/schemas/handoff.schema.json
project/schemas/historical-claim.schema.json
project/schemas/task.schema.json
project/tasks/README.md
project/tasks/active/.gitkeep
project/tasks/active/FOUNDATION-001.json
project/tasks/active/FOUNDATION-002.json
project/tasks/active/FOUNDATION-003.json
project/tasks/active/FOUNDATION-004.json
project/tasks/active/FOUNDATION-005.json
project/tasks/active/FOUNDATION-006.json
project/tasks/active/FOUNDATION-007.json
project/tasks/active/FOUNDATION-008.json
project/tasks/archive/.gitkeep
project/tasks/initial-backlog.json
project/tasks/thread-registry.json
project/templates/ADR.md
project/templates/handoff.md
project/templates/historical-claim.yaml
project/templates/pr-checklist.md
project/templates/research-note.md
project/templates/task.md
```
