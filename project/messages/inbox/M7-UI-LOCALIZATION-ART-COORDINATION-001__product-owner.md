# Monsoon Sovereigns — M7 UI / Localization / Art-Thread Coordination Prompts

> 用途：把当前 M7 Beta 阶段的 UI 可玩性、多语言、视觉方向和美术线程协作纳入主线流程。  
> 项目状态假设：当前权威状态已经进入 **M7 / Beta: Content And Quality**；M5、M6 已通过。  
> 重要原则：**以当前仓库事实源为准**，不要根据旧审计文件、旧会话摘要或外部记忆回退项目阶段。

---

## 使用顺序

1. 把 **Prompt A** 发给当前 `lead_orchestrator`。
2. 若 Codex 能 `send_input` 到已有美术线程，让 lead 自动路由，不需要你手动发 Prompt B。
3. 若 Codex 无法向旧美术线程发消息，手动把 **Prompt B** 发给美术线程。
4. 等美术线程返回结构化视觉/UX handoff 后，让 lead 继续执行 M7 UI / Localization track。
5. 不要再发送旧的 M5U prompt；当前应纳入 M7 Beta，而不是回退到 M5。

---

# Prompt A — 发给当前 `lead_orchestrator`

```text
你正在继续执行《季风诸王 / Monsoon Sovereigns》。

本消息是：

M7-UI-LOCALIZATION-ART-COORDINATION-001

目标：

1. 以当前仓库事实为准确认项目处于 M7 / Beta: Content And Quality；
2. 先执行或恢复 M7-CONTENT-LOCK-CONTRACT-001；
3. 在 M7 Beta 内容锁框架内加入 UI / Localization / Visual Direction 质量轨道；
4. 在正式执行 UI 改造前，与已有美术/视觉设计线程进行一次结构化交接；
5. 将当前 prototype/debug UI 产品化为玩家可理解、可本地化、未来可替换正式切图和美术资产的界面；
6. 支持中英文，默认系统语言，允许手动切换并持久化；
7. 继续 M7 自动推进，除非触发既定 Human Gate。

这不是重新初始化，不回退 M5/M6，不修改 M5/M6 Gate，不重新打开手动节点会战决策，不进入 M8，不授权新大系统。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
一、恢复当前权威状态
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

先执行并记录：

git status
git fetch origin --prune
git checkout main
git pull --ff-only origin main
git log --graph --oneline --decorate --all -60

node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs list
node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs ready

显式调用：

$monsoon-studio-orchestrator

读取：

- AGENTS.md
- PROJECT_STATUS.md
- project/goal-mode-state.json
- project/model-routing-state.json
- docs/11-roadmap.md
- docs/23-milestone-acceptance-matrix.md
- docs/27-autonomous-goal-mode.md，如存在
- 当前所有 M7 task files
- M7 task graph 相关 PR、handoff 和 route
- M5 Gate / M6 Gate 最终 handoff，仅作为历史证据
- docs/01-game-design-document.md
- docs/02-program-design-document.md
- docs/04-software-architecture.md
- docs/05-coding-standards.md
- docs/06-delivery-workflow.md
- 当前 web/client/ui/localization 相关包
- 当前 Storybook / Playwright / Electron / build 配置
- 当前 app screenshot / UI reference / visual mockup，如仓库中已有

确认：

- 当前 milestone 确为 M7 / Beta: Content And Quality；
- M5 = PASS_WITH_LIMITS 或已通过；
- M6 = PASS_WITH_LIMITS 或已通过；
- M7 task graph 已进入 main；
- 当前 next ready task 是 M7-CONTENT-LOCK-CONTRACT-001，或其后继；
- M8 尚未开始；
- working tree clean；
- 没有遗留 active writer/reviewer。

如果 PROJECT_STATUS、goal-mode-state、taskctl、Git 之间存在冲突：

- 输出 M7_STATUS_CONFLICT；
- 列出冲突；
- 创建最小 reconciliation task；
- 经独立 reviewer 验收后自动集成；
- 不回退已通过的 M5/M6。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
二、先执行或确认 M7-CONTENT-LOCK-CONTRACT-001
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

M7-CONTENT-LOCK-CONTRACT-001 是当前 Beta 阶段的入口任务。若尚未 CLOSED，必须先执行。

严格使用任务文件中的：

- owner；
- dependencies；
- allowed_paths；
- forbidden_paths；
- acceptance_criteria；
- required_tests；
- required_reviewers。

默认角色：

Writer:
- systems_architect
- model = gpt-5.5
- effort = xhigh

Reviewer:
- qa_reviewer
- model = gpt-5.5
- effort = xhigh
- sandbox = read-only

必要时加入：

- gameplay_designer / gpt-5.5 xhigh
- client_engineer / gpt-5.5 high
- historical_researcher / gpt-5.5 high

M7-CONTENT-LOCK-CONTRACT-001 必须定义 Beta 内容锁边界，包括：

1. 1.0 必须完成内容；
2. 1.0 可推迟内容；
3. post-1.0 内容；
4. UI / localization / visual direction 进入 1.0 的范围；
5. 美术、音频、百科、教程、剧本、人物、事件的锁定规则；
6. 文化审查和本地化审查完成门；
7. M7 中哪些任务允许新增内容，哪些任务只允许修正和打磨；
8. M8 RC 之后不得再做的大范围变化。

不得在内容锁完成前直接大改 UI。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
三、与美术/视觉设计线程建立交接
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

当前已有一个负责美术/视觉设计的 AI 线程看过 UI 原画，并给出过基于当前代码和设计的功能映射。该线程的意见有价值，但必须被纳入正式流程、不能成为未审查的口头设计。

在执行任何 UI 美化实现前，先做一次结构化 Art / UX handoff。

执行方式：

1. 若当前 Codex 环境可以向已有美术线程 `send_input`：
   - 使用真实 send_input；
   - 将下文 “Prompt B — 发给美术线程” 的内容路由给该美术线程；
   - 保存 route evidence；
   - 记录真实 thread id；
   - 等待美术线程返回结构化 handoff；
   - 将 handoff 存入 project/messages/outbox 或项目现有设计 evidence 路径；
   - 由 systems_architect 和 qa_reviewer 审查。

2. 若无法向已有美术线程 send_input：
   - 不伪造 route；
   - 输出 ART_THREAD_MANUAL_ROUTE_REQUIRED；
   - 将 Prompt B 的内容写入 project/messages/outbox 中的待发送文件；
   - 等待用户手动发送；
   - 不启动 UI implementation，但可以继续不依赖美术反馈的 M7 content lock 文档任务。

3. 若没有可用美术线程：
   - 创建 design_art_director 或 visual_design_reviewer 任务/线程；
   - model 可使用 gpt-5.5 high 或 xhigh；
   - 其权限默认为 design-only / read-mostly；
   - 不允许直接修改程序代码，除非任务明确授权；
   - 它应输出设计 handoff，而不是直接实现。

美术线程输出必须回答：

- 当前 UI 原画和当前实现之间的功能映射；
- 哪些 UI 元素是当前系统已有能力；
- 哪些只是目标化表达；
- 哪些不应进入 1.0；
- 哪些 debug 信息必须隐藏；
- 哪些视觉结构要为未来切图/正式美术预留；
- 资产替换点；
- 设计 tokens；
- 语言和文本长度对布局的影响；
- 地图、侧栏、底栏、任命、义务、战役、继承、通知各自的信息层级；
- 不得凭空引入代码和设计中不存在的系统。

该 handoff 必须经过 reviewer 后，才能驱动 UI 实现。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
四、将 UI / Localization / Visual Direction 纳入 M7
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

在 M7-CONTENT-LOCK-CONTRACT-001 合并后，创建或更新 M7 task graph，加入：

M7-UI-LOCALIZATION-QUALITY-TRACK

这不是新里程碑，不是 M5U，而是 M7 Beta 内部质量轨道。

目标：

把当前仍像 prototype/debug dashboard 的界面，调整为 1.0 Beta 可测、可读、可本地化、未来可替换正式切图和美术资产的玩家界面。

必须覆盖：

- UI 可理解性；
- 游戏主界面信息层级；
- debug 信息默认隐藏；
- 地图、地区详情、任命/治理、战役相关界面一致性；
- 中英文多语言；
- 默认系统语言；
- 手动语言切换；
- 语言选择持久化；
- Storybook / Playwright / Web / Windows 验证；
- Beta 内容锁后的文案冻结和本地化冻结策略；
- 视觉结构和资产替换点。

不得：

- 把它作为 M5 前置；
- 回退 M5/M6；
- 借 UI 任务重写核心模拟；
- 重做全部美术；
- 实现手动节点会战；
- 引入服务器、数据库、Rust/WASM 或未批准大型依赖；
- 在 M8 后继续大改 UI 信息架构。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
五、当前 UI 问题和产品化目标
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

当前 prototype UI 的问题包括：

- 玩家看到的是 debug/prototype dashboard；
- 地图像测试格子；
- 密集数据表占据主界面；
- state hash、revision、prototype district、M2/M3 测试文案默认暴露；
- appointment UI 像测试表单；
- 地区、资源、路线、治理、任命之间缺少玩家路径；
- 缺少语言选项；
- 文案大量硬编码英文；
- 中英文切换和系统语言默认尚未成为产品能力。

M7 UI 目标不是最终商业美术，而是：

玩家打开游戏后，能理解自己在看什么、能做什么、下一步是什么。

M7 UI 至少应提供：

1. App Shell
   - 顶部状态栏；
   - 地图主区域；
   - 侧边详情面板；
   - 行动/目标面板；
   - 设置入口；
   - debug/dev overlay 默认隐藏。

2. 顶部状态栏
   - 当前势力 / 剧本；
   - 当前日期、季节或阶段；
   - 关键资源摘要；
   - 当前模式；
   - 语言 / 设置入口；
   - dev mode 入口仅开发环境或明确开关可见。

3. 地图
   - District 边界；
   - Settlement 标记；
   - Route / transport overlay；
   - Seasonal / Economy / Route 图层；
   - 图例；
   - hover / selected / reachable / blocked；
   - zoom / pan；
   - 点击选择地区；
   - 空白点击取消；
   - 列表选择同步地图高亮。

4. 地区详情
   - 地区名称；
   - 地形或经济特征；
   - 人口；
   - 劳役；
   - 粮食；
   - 现金；
   - 路线状态；
   - 治理 / 任命状态；
   - 可执行动作；
   - 影响解释；
   - 不可执行原因。

5. 列表
   - 作为二级浏览器，不是主界面中心；
   - 可折叠；
   - 搜索；
   - 筛选；
   - 排序；
   - 虚拟化或有明确渲染上限；
   - 小屏/窄屏不压死地图；
   - 与地图选中状态联动。

6. 任命 / 治理流程
   - 选择职位；
   - 候选人列表；
   - eligible / rejected explanation；
   - 影响预览；
   - 确认动作；
   - 结果反馈；
   - 批量预览可用但不支配主界面；
   - reason code 翻译为玩家语言；
   - dev tooltip 可保留原始 reason code。

7. 目标提示
   - 当前目标；
   - 推荐下一步；
   - 为什么要做；
   - 完成条件；
   - 可关闭；
   - 不做长篇强制教程。

8. Debug 信息
   默认不显示：
   - revision；
   - state hash；
   - prototype map ready；
   - Prototype District 001；
   - raw reason code；
   - bare test IDs；
   - M2/M3 internal labels。

   这些只能出现在 dev/debug overlay。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
六、多语言 / Localization 要求
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

M7 必须支持：

- English；
- 简体中文；
- 默认系统语言；
- 玩家手动切换；
- 语言选择持久化；
- Web；
- Windows Electron。

语言代码：

- en-US；
- zh-CN；
- system。

默认策略：

1. 首次启动 = system；
2. 如果系统语言为中文，使用 zh-CN；
3. 否则 fallback en-US；
4. 玩家手动选择优先；
5. 刷新或重启后保持玩家选择。

检测来源：

- Web:
  navigator.languages / navigator.language

- Electron:
  若已有安全 preload/platform adapter，则使用安全 locale API；
  否则使用 browser language；
  不暴露 Node API 到 renderer。

实现要求：

1. 新增 Settings / Language 入口：
   - System；
   - English；
   - 简体中文。

2. 玩家可见文本必须通过 i18n：
   - 页面标题；
   - 按钮；
   - 表头；
   - 空状态；
   - 错误；
   - tooltip；
   - reason code display；
   - objectives；
   - resource labels；
   - layer names；
   - appointment UI；
   - settings；
   - language menu；
   - route / district / governance labels。

3. 不需要本地化：
   - internal IDs；
   - test IDs；
   - state hash；
   - dev-only diagnostics；
   - file names。

4. 使用 typed message keys 或等价机制。

5. 不允许核心 UI 出现裸 key。

6. 数字格式使用 Intl.NumberFormat 或项目 wrapper。

7. 日期/季节使用 localization wrapper；如果暂无正式历法，不发明复杂历法，只用现有状态的最小显示。

8. 中文不乱码，不依赖未授权字体。

9. 优先系统字体栈，不把 CJK 字体直接打包，除非经过授权和 size review。

10. 语言切换不得改变 simulation state hash。

11. sim-core 不依赖 i18n。

12. sim-core 只产出稳定 reason code 和 context，UI 层翻译。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
七、未来美术切图与资产替换要求
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

UI 任务必须为未来实际美术定稿和切图替换预留结构。

要求：

1. 不把颜色、间距、边框、字体大小、阴影等散落在组件内部。
2. 建立或使用设计 token 层：
   - color；
   - spacing；
   - typography；
   - elevation；
   - radius；
   - z-index；
   - map layer colors；
   - semantic states。

3. 建立组件 slot / asset replacement points：
   - top bar background；
   - panel frame；
   - button variants；
   - map district fill/stroke；
   - settlement icon；
   - route line styles；
   - warning / obligation / succession / campaign icons；
   - resource icons；
   - portrait placeholders；
   - notification icons；
   - tooltip/scrollbar styling。

4. 资产路径和引用集中管理：
   - 不在组件内硬编码最终素材路径；
   - 使用 manifest、theme config 或 asset registry；
   - 允许 placeholder 资产替换为正式切图。

5. 地图美术不得成为权威状态。
   地图表现层必须可由 read model 重建。

6. 中英文文本长度必须影响布局测试。
   不能只按英文短文本设计。

7. 如果美术线程输出视觉规范：
   - 转成 design tokens / component specs；
   - 由 systems_architect 审查是否符合架构；
   - 由 client_engineer 实现；
   - 由 qa_reviewer 验收；
   - 不允许美术线程直接绕过 UI 架构改业务代码。

8. 当前阶段可以继续使用 placeholder 图形，但必须：
   - 命名清楚；
   - 不与最终素材混淆；
   - 可一键替换；
   - 不污染 sim-core。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
八、建议新增 M7 任务
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

在 M7-CONTENT-LOCK-CONTRACT-001 合并后，创建或确认以下任务。ID 可根据仓库规范调整，但语义必须保留。

### M7-VISUAL-UX-HANDOFF-001

Owner:
gameplay_designer / gpt-5.5 xhigh
+
visual_design_reviewer 或 art_director / gpt-5.5 high

Reviewers:
systems_architect + qa_reviewer

目标：
把已有 UI 原画、美术线程功能映射和当前代码/设计事实整合为正式 UI/UX/Visual handoff。

验收：
- 明确哪些图上功能已有代码对应；
- 明确哪些是目标表达；
- 明确哪些不进 1.0；
- 明确每个主区域的信息层级；
- 明确可替换资产 slots；
- 明确 design tokens；
- 明确多语言布局风险；
- 不凭空引入未实现系统；
- reviewer ACCEPT。

### M7-UI-LOCALIZATION-PLAN-001

Owner:
systems_architect / gpt-5.5 xhigh

Reviewers:
client_engineer + qa_reviewer

目标：
定义 UI / Localization Beta 范围、依赖、任务图、验收矩阵。

不实现 UI。

验收：
- M7 task graph 更新；
- M7 content lock 与 UI/localization lock 对齐；
- M8 不允许大改 UI 信息架构；
- 明确哪些 debug UI 必须隐藏；
- 明确哪些文本必须本地化；
- 明确延期内容；
- reviewer ACCEPT。

### M7-I18N-FOUNDATION-001

Owner:
client_engineer / gpt-5.5 high

Reviewers:
systems_architect + qa_reviewer

目标：
建立或完善 localization infrastructure。

验收：
- en-US / zh-CN / system；
- 系统语言默认；
- 手动切换；
- 持久化；
- typed keys；
- no bare key；
- Storybook locale decorator；
- Playwright language switching；
- Web / Electron 路径；
- 不污染 sim-core。

### M7-DESIGN-TOKENS-ASSET-SLOTS-001

Owner:
client_engineer / gpt-5.5 high

Reviewers:
systems_architect + qa_reviewer

目标：
建立 UI design tokens 和 asset replacement slots，便于未来正式切图替换。

验收：
- token 层；
- asset registry / manifest 或等价机制；
- placeholder 与 final asset 区分；
- 组件不硬编码 final asset path；
- 文档说明替换方式；
- Storybook 展示核心组件 states；
- 不影响 sim-core；
- 不引入未经批准大型依赖。

### M7-APP-SHELL-QUALITY-001

Owner:
client_engineer / gpt-5.5 high

Reviewer:
qa_reviewer / gpt-5.5 xhigh

目标：
将首屏从 prototype dashboard 转为玩家可理解 app shell。

验收：
- top status bar；
- map main area；
- side inspector；
- objective/action panel；
- settings/language entry；
- dev overlay hidden by default；
- no prototype text in player mode；
- responsive baseline；
- Storybook；
- Playwright。

### M7-MAP-PRESENTATION-QUALITY-001

Owner:
client_engineer / gpt-5.5 high

Reviewers:
systems_architect + qa_reviewer

目标：
产品化地图表现，不重写核心地图系统。

验收：
- district selection；
- settlement marker；
- route overlay；
- layer legend；
- hover/selected/reachable/blocked；
- zoom/pan；
- list-map sync；
- no authoritative state in Pixi；
- map rebuilds from read model；
- localized layer labels。

### M7-DISTRICT-INSPECTOR-QUALITY-001

Owner:
client_engineer / gpt-5.5 high

Reviewer:
qa_reviewer

目标：
产品化地区详情与列表。

验收：
- player-facing labels；
- resource summary；
- route/governance/appointment summary；
- action entry；
- search/sort/filter；
- list secondary；
- localized columns；
- no debug/prototype text；
- tests。

### M7-APPOINTMENT-FLOW-QUALITY-001

Owner:
client_engineer / gpt-5.5 high

Reviewers:
systems_architect + qa_reviewer

目标：
将任命/治理从 debug form 改为玩家流程。

验收：
- office selection；
- candidate list；
- eligible/rejected explanations；
- impact preview；
- confirm；
- result feedback；
- bulk preview not dominant；
- localized reason display；
- no duplicated domain logic；
- Storybook / Playwright。

### M7-PLAYER-GUIDANCE-LITE-001

Owner:
gameplay_designer / gpt-5.5 xhigh
+
client_engineer / gpt-5.5 high

Reviewer:
qa_reviewer

目标：
最小目标提示 / walkthrough。

验收：
- first objective；
- select district；
- inspect district；
- appointment/governance action；
- observe result；
- localized；
- dismissible；
- not a full tutorial system；
- core path e2e。

### M7-UI-REGRESSION-MATRIX-001

Owner:
test_engineer / gpt-5.4-mini high

Reviewer:
qa_reviewer

目标：
建立 UI/i18n 回归矩阵。

验收：
- Storybook build；
- Chromium e2e；
- English path；
- Chinese path；
- system language path；
- no missing key assertion；
- no prototype/debug text assertion；
- console error check；
- viewport checks；
- Windows/Electron smoke if existing tooling supports。

### M7-UI-LOCALIZATION-EXIT-001

Owner:
lead_orchestrator / gpt-5.5 xhigh

Reviewers:
systems_architect + qa_reviewer

目标：
确认 UI / Localization 质量轨道完成，满足 M7 Beta 标准。

验收：
- all UI/i18n/visual tasks CLOSED；
- Web build；
- Windows package；
- Storybook；
- Playwright；
- language switch；
- no prototype text in player mode；
- known UI limitations recorded；
- content lock remains intact；
- ready for M7 Exit.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
九、执行顺序
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 先执行 M7-CONTENT-LOCK-CONTRACT-001。
2. 执行 M7-VISUAL-UX-HANDOFF-001，与美术线程完成正式 handoff。
3. 执行 M7-UI-LOCALIZATION-PLAN-001。
4. 执行 M7-I18N-FOUNDATION-001。
5. 执行 M7-DESIGN-TOKENS-ASSET-SLOTS-001。
6. 再按依赖推进 app shell、map、district inspector、appointment flow、guidance、regression matrix。
7. UI/i18n 与正式内容填充、文化审查、教程百科、美术音频、本地化、性能矩阵可以并行，但必须遵守 content lock 和 allowed_paths。
8. 所有 UI/i18n/visual tasks 必须在 M7 Exit 前 CLOSED。
9. M7 Gate 通过后才进入 M8。
10. 不在 M7 中引入 M8 发布工程大范围任务，除非 task graph 明确允许。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
十、M7 Beta 内容锁原则
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

M7 不是继续加系统的阶段，而是内容与质量阶段。

允许：

- 补全 1.0 必要内容；
- 修复 UI/UX；
- 本地化；
- 文化审查；
- 剧本和人物内容；
- 教程/百科；
- 美术/音频占位到可交付；
- 性能矩阵；
- 平台测试；
- 平衡；
- 存档迁移测试；
- bug 修复。

不允许：

- 新增大系统；
- 手动节点会战；
- 多人；
- 服务器；
- 改核心架构；
- 大规模改 sim-core；
- 改 1.0 平台策略；
- 大幅改变产品方向。

任何新增系统都必须触发 Human Gate 或明确 post-1.0。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
十一、验证要求
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

每个 UI/i18n/visual 任务至少运行：

git diff --check
taskctl validate <task-id>
taskctl list
taskctl ready
handoff validator
JSON/schema validator

代码任务运行：

pnpm install --frozen-lockfile
pnpm check
pnpm build:web
pnpm storybook:build
pnpm test:e2e --project=chromium

i18n 任务额外运行：

- language detector tests；
- persisted preference tests；
- missing translation tests；
- English UI path；
- Chinese UI path；
- system fallback path。

UI 任务额外运行：

- no prototype/debug text in player mode；
- Storybook state checks；
- Playwright core path；
- console error check；
- viewport checks if existing tooling supports；
- Windows/Electron smoke if relevant。

Visual/design-token 任务额外运行：

- token usage lint or equivalent review；
- asset slot/manifest consistency；
- Storybook component states；
- placeholder/final asset distinction check；
- no direct final asset path hardcoding in components, unless explicitly allowed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
十二、停止条件
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

只有以下情况可停止请求人类：

- 当前状态并非 M7，且无法自动协调；
- M5/M6 Gate 事实和项目状态不可调和；
- 无法联系美术线程且 UI 实现必须依赖其输出；
- 需要修改冻结产品方向；
- 需要新增大系统；
- 需要付费服务、账号或 secret；
- 需要服务器、多人、遥测或任意代码 Mod；
- 重大历史、宗教、族群、法律风险；
- 需要决定手动节点会战；
- M7 内容锁范围发生产品级冲突；
- M8 RC 是否启动前发现严重 release risk；
- GitHub 权限持续阻止合并。

不得因以下原因停止：

- 单个任务完成；
- PR 已创建或合并；
- reviewer ACCEPT；
- main 干净；
- 下个 M7 task READY；
- UI 任务很多；
- 输出很长；
- 普通测试失败且可在范围内修复。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
十三、最终报告
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

只有发生 Human Gate、流程阻塞或会话窗口结束时才输出总结。

总结只包含：

- current milestone；
- current main commit；
- 本次 CLOSED tasks；
- 当前 active task；
- M7-CONTENT-LOCK-CONTRACT-001 状态；
- Visual/UX handoff 状态；
- UI/i18n track 状态；
- language support 状态；
- design token / asset slot 状态；
- Web/Windows build 状态；
- Storybook/Playwright 状态；
- active threads；
- PR / merge commits；
- unresolved risks；
- human_gate；
- goal-mode-state 路径；
- GOAL-MODE-CONTINUATION 路径；
- 下一条机器可执行动作。

现在从权威 main 恢复，确认项目处于 M7，先执行 M7-CONTENT-LOCK-CONTRACT-001，然后联系美术线程完成 M7-VISUAL-UX-HANDOFF-001，并将 UI / Localization / Visual Direction quality track 纳入 M7 Beta 后持续推进。
```

---

# Prompt B — 发给美术/视觉设计线程

> 只有在 lead 无法直接 `send_input` 给美术线程时，才手动发送这段。  
> 如果 lead 已经能路由，就不要重复发送。

```text
你是《季风诸王 / Monsoon Sovereigns》的 visual_design_reviewer / art_director 线程。

本消息由主 lead_orchestrator 请求，用于：

M7-VISUAL-UX-HANDOFF-001

目标：

基于当前项目代码、设计文档、已实现 read model / command / UI 状态，以及你看过的 UI 原画，输出一份可交给主线程和 client_engineer 实现的结构化视觉与 UX handoff。

重要边界：

1. 不要基于想象发明新系统。
2. 不要假设手动节点会战进入 1.0。
3. 不要要求重写核心模拟。
4. 不要直接修改代码，除非主线程另行授权。
5. 不要以最终美术为目标；目标是 Beta 可理解、可替换资产、可本地化。
6. 必须区分：
   - 当前代码已经有的功能；
   - 已设计但未完全产品化的功能；
   - 原画中的目标化表达；
   - 不应进入 1.0 的内容；
   - 未来 post-1.0 或 DLC 候选。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
一、先建立事实边界
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

请根据你能读取的当前仓库和文档，确认：

- 当前 milestone 是否为 M7；
- 当前 UI 是否仍存在 prototype/debug dashboard 特征；
- 当前 M5/M6 是否已经通过；
- 当前客户端是否已有地图、地区、任命、义务、继承、战役等 read model 或 UI 基础；
- 哪些 UI 能力已经真实存在；
- 哪些只是设计文档或目标图表达。

不要引用不存在的代码。

如果无法直接读取仓库，请基于主线程提供的材料输出，并明确 `source_limitations`。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
二、输出结构化 handoff
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

请输出一份结构化文档，推荐命名：

M7-VISUAL-UX-HANDOFF-001.md

内容至少包括：

## 1. Design intent

一句话说明这个 UI 应给玩家什么感觉。

必须符合项目核心：

- 不是涂色扩张；
- 是宫廷 / 宗主网络；
- 看季风、资源、义务、任命、补给、战役风险；
- 通过 GameCommand 下达命令；
- 胜利在于治理和稳定。

## 2. Screen-level information hierarchy

按区域说明：

- top bar；
- central map；
- left/court panel，如适用；
- right inspector；
- bottom panels；
- notification / proposal area；
- settings / language；
- dev overlay。

每个区域说明：

- player question answered；
- current implemented mapping；
- required visible data；
- hidden debug data；
- primary actions；
- secondary actions；
- localization risk；
- asset slots。

## 3. Mapping from concept art to current systems

列成表：

| Concept art element | Current code/design mapping | Status | 1.0 decision |
|---|---|---|---|

Status 可用：

- implemented；
- implemented but prototype UI；
- designed but not surfaced；
- target expression only；
- post-1.0；
- rejected for 1.0。

必须包括：

- top seasonal/resource bar；
- map；
- district inspector；
- court / ruler / succession；
- tribute obligations；
- appointment candidates；
- campaign preparation；
- notification/proposal area；
- settings/language；
- debug diagnostics；
- manual node battle UI。

manual node battle UI 必须标注为：
not in 1.0 mainline，unless later human decision changes.

## 4. Recommended player flow

描述一个 3–7 分钟核心 UI 流程：

1. 进入游戏；
2. 识别当前局势；
3. 选择地区；
4. 查看资源/路线/治理；
5. 任命或治理；
6. 查看义务或继承风险；
7. 预览战役或推进时间；
8. 获得反馈。

每一步说明：

- 需要什么 UI；
- 当前代码中可能已有哪个 read model / command；
- 需要 client engineer 做什么；
- 哪些只需要文案或布局，不需要新系统。

## 5. Visual direction

给出 Beta 阶段视觉方向，不要要求最终美术完整实现。

至少说明：

- overall tone；
- palette direction；
- map color categories；
- panel style；
- hierarchy；
- typography approach；
- icon style；
- alert severity；
- disabled / rejected / eligible / warning / success states；
- dev mode visual distinction。

不得指定未经授权的字体或素材。

## 6. Design tokens

列出建议 tokens：

- colors；
- spacing；
- typography；
- radii；
- borders；
- shadows/elevation；
- semantic states；
- map layer colors；
- route states；
- obligation states；
- appointment states；
- campaign risk states。

不需要写最终数值，但要写 token 语义和使用位置。

## 7. Asset replacement slots

列出未来切图和正式美术应替换的位置：

- top bar frame；
- panel frame；
- map terrain tiles / fills；
- settlement icons；
- route line styles；
- district selection glow；
- resource icons；
- obligation icons；
- succession icons；
- appointment/office icons；
- campaign icons；
- alert icons；
- portrait placeholders；
- buttons；
- tooltip frames；
- scrollbars；
- language/settings icon。

对每个 slot 说明：

- required aspect ratio or flexible sizing；
- whether scalable vector preferred；
- fallback placeholder；
- localization impact；
- whether purely cosmetic or functional.

## 8. Localization implications

说明中英文对 UI 的影响：

- 中文标签更短/不同换行；
- 英文 reason strings 可能更长；
- 表格列名；
- tooltip；
- button width；
- date/season；
- number format；
- font fallback；
- no bitmap CJK unless licensed。

明确所有玩家文本必须走 i18n。

## 9. Debug vs player mode separation

列出哪些内容必须从 player mode 隐藏：

- revision；
- state hash；
- prototype map ready；
- Prototype District 001；
- raw reason code；
- internal IDs；
- M2/M3 labels；
- dev timings；
- test-only labels。

说明 debug overlay 应如何保留给开发者。

## 10. Implementation guidance for client_engineer

用可执行建议说明：

- 不把完整 WorldState 放到 React/Redux；
- 不让 Pixi 存权威状态；
- 使用 read model；
- reason code 在 UI 层翻译；
- tokens 集中；
- asset slots 集中；
- Storybook 状态；
- Playwright 核心路径；
- no hard-coded player-visible strings；
- responsive baseline。

## 11. Risks and non-goals

明确：

- 不做手动节点会战；
- 不重写核心模拟；
- 不做完整美术；
- 不做完整教程；
- 不做完整百科；
- 不引入未批准大依赖；
- 不把原画中的所有元素都当作 1.0 必做。

## 12. Handoff summary

最后给主线程一个简短 actionable summary：

- must-do for M7；
- should-do if time；
- defer to post-1.0；
- requires human decision；
- requires real art assets later；
- safe placeholder path.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
三、输出格式
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

最终输出：

1. 一份结构化 Markdown handoff；
2. 一个简短 JSON-like summary；
3. 不要修改仓库文件，除非主线程明确授权；
4. 不要生成实现 PR；
5. ROUTE_TO = lead_orchestrator；
6. requested_action = systems_architect + client_engineer + qa_reviewer review and convert into M7 UI/localization tasks。

请开始执行 M7-VISUAL-UX-HANDOFF-001。
```
