# 严格代码规范

> 状态：**FROZEN ENGINEERING POLICY**  
> 适用范围：仓库中的 TypeScript、React、PixiJS、Electron、Node 工具、测试和构建脚本。

本规范优先保障：正确性、确定性、可审查性、AI Agent 可理解性、跨环境一致性。任何“为了快一点”而绕过边界、类型或测试的提交均不合格。

## 1. 工具链与编译门禁

- 仅使用 `pnpm`；禁止 npm/yarn 混用。
- Node 使用仓库 `.node-version` 指定的 LTS 大版本。
- TypeScript 全仓统一基线；不得在子包关闭严格选项。
- `pnpm-lock.yaml` 必须提交；禁止手改锁文件。
- 生产构建必须在干净 checkout 中成功。
- 所有 package script 必须可在 Windows PowerShell 与 POSIX shell 之外通过 Node 调用；不得依赖 Bash-only 行为完成关键流程。

`tsconfig.base.json` 至少开启：

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "useUnknownInCatchVariables": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "noPropertyAccessFromIndexSignature": true,
    "forceConsistentCasingInFileNames": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "erasableSyntaxOnly": true
  }
}
```

## 2. 禁止项

除非批准 ADR 明确豁免，禁止：

- `any`、隐式 `any`；
- 非空断言 `!`；
- `as unknown as T` 双重断言；
- TypeScript `enum`、运行时 `namespace`；
- 装饰器、反射型依赖注入和 service locator；
- 默认导出业务对象；
- 在业务代码中使用魔法字符串、裸数字 ID；
- 通过 `JSON.parse(...) as T` 假装完成校验；
- 捕获异常后静默忽略；
- 无界重试、无界队列、无界缓存；
- 模拟层调用 `Math.random()`、`Date.now()`、`performance.now()` 或环境时区；
- 依赖 `Object.keys`、`Map` 或 `Set` 当前遍历顺序决定游戏结果；
- 未指定稳定 tie-breaker 的排序；
- 在 React state/Redux 中保存 Pixi DisplayObject 或完整 `WorldState`；
- 在 Electron Renderer 中调用 Node API；
- 将测试失败改为 skip 以通过 CI；
- 生产路径中的永久 `TODO`、`FIXME`、假实现、硬编码成功返回；
- 与当前任务无关的全仓重排、重命名或格式化。

边界处不得避免断言时，必须封装在一个可测试的解析器中，并说明运行时证据，不得把断言扩散到调用方。

## 3. 命名

- 文件、目录：`kebab-case`。
- 类型、类、React 组件：`PascalCase`。
- 函数、变量：`camelCase`。
- 常量：可使用 `UPPER_SNAKE_CASE`，仅限真正不变且跨模块有语义的常量。
- 布尔值以 `is`、`has`、`can`、`should`、`was` 开头。
- 集合使用复数；映射命名说明 key/value，例如 `armyById`。
- 单位必须写进名字或类型：`distanceInMapUnits`、`durationInDays`、`taxRateBps`。
- 避免 `data`、`info`、`manager`、`helper`、`util`、`process` 这类无领域含义名称。

## 4. 类型建模

### 4.1 ID 与单位

```ts
export type Brand<T, B extends string> = T & { readonly __brand: B };
export type OfficerId = Brand<number, "OfficerId">;
export type DistrictId = Brand<number, "DistrictId">;
export type GameDay = Brand<number, "GameDay">;
export type BasisPoints = Brand<number, "BasisPoints">;
```

- ID 只在内容编译器或安全构造函数中生成。
- 不能把任意 `number` 直接当领域 ID。
- 跨 Worker、存档、JSON 边界时先做 schema 校验，再构造 brand。

### 4.2 联合类型

使用判别联合表达状态机：

```ts
type CampaignState =
  | { readonly kind: "planning"; readonly targetId: PolityId }
  | { readonly kind: "mobilizing"; readonly completionDay: GameDay }
  | { readonly kind: "marching"; readonly routeId: RouteId }
  | { readonly kind: "besieging"; readonly siegeId: SiegeId }
  | { readonly kind: "ended"; readonly outcome: CampaignOutcome };
```

所有 `switch` 必须穷尽，使用 `assertNever`；禁止用多个互相矛盾的布尔值表达同一状态。

### 4.3 可选与空值

- “字段不存在”和“字段存在但值为空”要有明确语义。
- 优先使用判别联合，不把 `null | undefined | value` 混作一个状态。
- 对数组索引结果必须处理 `undefined`。

### 4.4 可变性

- 对外 API 默认 `readonly`。
- 权威状态仅由系统函数在明确提交阶段修改。
- UI read model 使用不可变快照或增量消息。
- 不把深拷贝当作架构；大型世界状态采用受控数组、结构化更新和版本号。

## 5. 模块与依赖

- 每个 package 只通过根 `index.ts` 暴露稳定公共 API；包内部禁止跨越公开边界的深层导入。
- 包内部避免“barrel everywhere”，防止循环依赖与不可见耦合。
- 类型导入使用 `import type`。
- `sim-core` 只能依赖标准 ECMAScript 和明确批准的纯数据校验/算法库。
- `sim-ai` 可以依赖 `sim-core` 公共查询与命令类型，不能直接写世界数组。
- `map-renderer` 不得导入模拟内部实体实现。
- `apps/desktop` 不得成为业务逻辑来源。
- 通过 dependency-cruiser 或等价规则在 CI 检查依赖方向。

## 6. 函数与类

- 优先纯函数、显式输入输出、组合式模块。
- 类仅用于确有生命周期或封装可变资源的对象，例如 Worker client、Pixi scene、文件句柄适配器。
- 禁止 `GodObject`、`GameManager`、`WorldService` 等全能对象。
- 单函数应保持一个抽象层级；超过约 60 行或分支复杂度显著时必须拆解，除非性能热路径有测量依据。
- 参数超过 3 个时优先使用具名参数对象。
- 不使用布尔位置参数：`moveArmy(id, true, false)` 不可接受。
- API 必须表达失败：使用结果类型或领域错误，不用模糊的 `false`。

## 7. 错误处理

错误分三类：

1. **预期领域拒绝**：命令返回 `CommandRejected`，含稳定 reason code 和玩家可解释参数。
2. **内容/输入错误**：边界解析失败，给出路径、字段、期望、实际值；构建内容时立即失败。
3. **程序不变量破坏**：抛出带上下文的异常，在开发/测试立即终止；不得吞掉后继续模拟。

错误消息必须：

- 可定位到 task、day、entity、command；
- 不包含密钥或敏感本地路径；
- UI 文案与开发日志分离；
- 稳定逻辑依赖 reason code，而非匹配人类文本。

## 8. 确定性规范

- 每个逻辑系统有固定执行次序，并由测试锁定。
- 随机数只能来自 `DeterministicRng`，随机用途使用稳定 domain key。
- 所有需要排序的地方必须提供唯一稳定 tie-breaker（通常 ID）。
- 浮点值不得决定权威分支；权威经济、概率、士气使用整数/定点。
- 不依赖宿主 locale、时区、CPU 核数、浏览器帧率。
- Node Runner、Chrome Worker、Electron Worker 对金丝雀剧本必须产生相同状态哈希。
- 任何改变系统顺序、RNG 消耗、序列化字段顺序的改动都视为兼容性变化。

## 9. React 规范

- React 仅负责 DOM UI、路由、窗口、表格和可访问交互。
- 组件分为 `View`、`Presenter/Hook`、`ReadModel`，不得在展示组件中直接调用 Worker。
- 不把每个游戏日的完整世界放入 context/store。
- 订阅必须按 read-model slice；避免全局重渲染。
- 复杂列表必须虚拟化。
- 每个复杂状态至少有 Storybook story：正常、空、错误、加载、极限数据、窄屏。
- 副作用集中在 adapter/hook；不得在 render 中修改外部对象。
- 可访问性：键盘可达、焦点可见、语义标签、对比度和缩放必须测试。

## 10. PixiJS 规范

- Pixi 场景由命令式 renderer 管理；React 只传递高层 intent/read delta。
- DisplayObject 必须有所有者和销毁路径。
- 高频对象池化；不可见对象裁剪；标签使用 LOD/聚类。
- 不为每个地区、道路创建独立复杂组件和事件监听器。
- GPU context 丢失后必须能从 read model 重建场景。
- 所有贴图、字体、图集有稳定资源 ID；不得在领域对象中保存纹理引用。

## 11. Electron 规范

必须保持：

```text
nodeIntegration = false
contextIsolation = true
sandbox = true
```

- preload 只暴露具名、窄接口；不暴露原始 `ipcRenderer`。
- main process 验证所有参数、路径和消息来源。
- 文件写入使用临时文件、校验、原子替换和滚动备份。
- 禁止加载远程可执行页面或远程脚本。
- 外部链接只允许明确协议与域名白名单。
- 安全相关配置必须有自动测试或启动时断言。

## 12. 内容与 schema

- 所有外部内容必须由 schema 验证；错误在构建阶段失败。
- 历史记录必须包含来源 ID、置信度和内容标签。
- 事件 DSL 必须有穷尽的触发器/效果白名单，不执行任意 JS。
- 稳定 ID 永不复用；删除内容保留 tombstone 或迁移记录。
- schema 变化必须提升版本并提供迁移/拒绝策略。

## 13. 测试规范

### 最低测试类型

- 领域公式：单元测试。
- 状态空间与守恒：property-based/invariant 测试。
- Command：合法、非法、边界、幂等/重复提交行为。
- 存档：golden fixture、版本迁移、损坏数据拒绝。
- 协议：Worker 双端契约测试。
- UI：Storybook + 关键 Playwright 流程。
- 地图：视觉基线和选取/缩放行为。
- AI：固定场景测试 + decision trace。
- 性能：基准场景，不以单次本机结果做结论。

### 覆盖门槛

- `sim-core`：statement ≥ 90%，branch ≥ 85%；关键经济、所有权、存档迁移目标 100% 分支。
- `protocol`、`save-format`：statement/branch ≥ 90%。
- UI 不追求虚高全局覆盖，但关键命令流程必须 E2E。
- 覆盖率不能代替不变量、性能和回归测试。

每个缺陷修复必须先加入能失败的回归测试，除非无法自动化并在任务中解释。

## 14. 注释与文档

- 注释解释“为什么/约束/历史依据”，不复述代码。
- 公共 API 用 TSDoc，包含单位、失败方式、确定性约束。
- 复杂公式引用对应系统文档的公式 ID。
- 历史内容引用来源登记 ID。
- 改变玩家可见规则时同一提交更新系统文档与变更日志。

## 15. 提交规范

Conventional Commits：

```text
feat(sim): add seasonal labor reservation
fix(save): reject duplicate district ownership
refactor(ui): isolate campaign planner read model
test(ai): cover supply-driven retreat decision
docs(history): qualify Ava–Pegu identity framing
```

- 一个提交一个意图；实现、测试和必要文档同提交。
- 不提交生成目录、密钥、用户本地设置、截图垃圾。
- 不重写他人历史，不强推共享分支。

## 16. 完成定义

只有同时满足下列条件才能标记 `DONE`：

- 验收标准逐项有证据；
- 类型检查、lint、相关测试实际运行；
- 新行为有测试；
- 无架构边界违规；
- 文档/schema/迁移同步；
- 性能或安全风险已测量；
- 交接消息完整；
- reviewer 给出 `ACCEPTED`。

“代码已写”“页面看起来正常”“测试应该能过”均不构成完成。
