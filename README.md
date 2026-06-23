# 《季风诸王》项目交接包

> 项目代号：**Monsoon Sovereigns / 季风诸王**  
> 文档基线日期：**2026-06-23**  
> 状态：**概念与技术基线已冻结，可进入工程启动阶段**  
> 目标执行者：Codex 多线程代理团队

本交接包把此前讨论形成的产品、设计、技术和组织结论，转换为可直接执行的项目基线。它不是营销提案，也不是只描述愿景的 GDD；其中同时包含不可变约束、阶段性假设、待验证事项、代码规范、质量门禁、Codex 角色配置和可安装 Skill。

## 先读顺序

1. `HANDOFF_EXECUTION_BRIEF.md`：执行授权、边界与第一动作。
2. `PROJECT_STATUS.md`：已决定什么、尚未决定什么。
3. `AGENTS.md`：所有 Codex 线程必须遵守的根规则。
4. `docs/00-project-charter.md`：产品目标、边界和非目标。
5. `docs/01-game-design-document.md`：完整游戏策划总纲。
6. `docs/02-program-design-document.md`：程序运行模型。
7. `docs/03-technology-stack.md`：技术栈及取舍。
8. `docs/04-software-architecture.md`：模块、依赖和数据流。
9. `docs/05-coding-standards.md` 与 `docs/06-delivery-workflow.md`：严格工程约束。
10. `docs/systems/`：各游戏系统规格。
11. `docs/09-world-history-culture.md`：历史背景和文化表达守则。
12. `docs/11-roadmap.md`：里程碑与退出条件。
13. `docs/14-multi-agent-operating-model.md`：Codex 多角色工作方法。
14. `docs/25-decision-history-and-rejected-directions.md`：方案演变、被否决方向与重开条件。
15. `.agents/skills/monsoon-studio-orchestrator/SKILL.md`：自动化协作 Skill。

## 不可擅自改变的一级决定

- 题材：约 **1531—1600 年的东南亚大陆**，以伊洛瓦底、萨尔温、湄南、湄公河流域及相邻海岸为核心。
- 玩家幻想：扮演通过宫廷、地方领主、臣属王、贡赋、人质、婚姻与战争维持霸权的统治者，而非现代民族国家的全知省长。
- 核心特色：**臣属网络、人口与劳役、季风战役窗口、补给、代理人政治、继承危机、非涂色式胜利**。
- 技术路线：**Web-first**；TypeScript + React + PixiJS；模拟运行在 Dedicated Web Worker；Node.js 运行无界面模拟；Windows 以 Electron 正式发布。
- 平台优先级：Windows Electron 与 Chrome/Edge Web 为一级；Firefox 二级；macOS 浏览器尽力兼容；macOS 桌面版暂缓；Safari 非首发承诺。
- 模拟核心：确定性、与 UI 解耦、玩家与 AI 使用同一命令体系、可无界面批量跑局。
- 第一版不使用 Rust/WASM、服务器、多人联机、完整 3D 战斗、全项目 ECS，也不把历史内容做成现代国族对抗叙事。

任何线程若认为一级决定必须改变，必须先新增 ADR，并由 `lead_orchestrator` 和 `systems_architect` 双重审查；不得通过一次普通功能提交悄然改变项目方向。

## Codex 安装与启动

### 仓库级使用

把本交接包内容放到新仓库根目录。Codex 会从仓库中的 `.agents/skills` 发现 Skill，并从 `.codex/agents` 读取项目自定义角色。首次打开项目后：

1. 信任项目的 `.codex/` 配置。
2. 在 Codex 中确认 Skill `monsoon-studio-orchestrator` 可见。
3. 使用主线程提示：

```text
使用 $monsoon-studio-orchestrator 启动项目。读取 README、PROJECT_STATUS、AGENTS 和 roadmap，创建 FOUNDATION-001 执行计划；只完成阶段 0 的仓库基线，不提前实现玩法。
```

### 单独安装 Skill

本包另附 `monsoon-studio-orchestrator-skill.zip`。也可将目录：

```text
.agents/skills/monsoon-studio-orchestrator
```

复制到：

```text
$HOME/.agents/skills/monsoon-studio-orchestrator
```

仓库级安装优先，因为 Skill 与本项目文档、任务协议和质量门禁有直接依赖。

## 交付物目录

- `docs/`：产品、策划、技术、系统、历史、路线图、风险与研究文档。
- `.codex/agents/`：不同职责与模型配置的 Codex 自定义角色。
- `.agents/skills/`：可安装协作 Skill。
- `project/`：任务、消息、ADR、研究声明和 PR 模板。
- `bootstrap/`：建议的首个仓库结构与配置样例。
- `CONTRIBUTING.md` / `SECURITY.md`：进入工程后的贡献与安全入口。
- `MANIFEST.md` / `SHA256SUMS.txt`：交接包清单、验证方式与完整性校验。

## 文档可信度标记

- **FROZEN**：项目基线，普通任务不得修改。
- **TARGET**：目标规格，可通过测试和原型调整，但需要记录依据。
- **HYPOTHESIS**：尚待验证的设计假设。
- **RESEARCH REQUIRED**：历史或文化细节不能直接进入正式内容。

历史文档刻意区分史料支持的事实、学术解释和游戏抽象。任何没有来源的具体历史人物、地名、族属、服装或制度，不得以“看起来合理”为由进入正式内容。
