# 系统规格 08：AI、家臣提案与可解释性

## 1. 设计目标

AI 的目标不是完美求解，而是形成可信、有个性、受信息和组织约束的行动。玩家应理解重要决定的主要原因，开发者应能复现。

## 2. 分层 AI

### 势力战略 AI（月度/重大事件）

威胁、战略姿态、预算、战役目标、外交方向、军团范围。

### 战役 AI（事件驱动）

集结、路线、补给、时机、目标、撤退、围城和援军。

### 地方/职位 AI（月度或脏标记）

建设、储粮、治安、征兵、道路、地方关系和提案。

### 战术 AI（战斗内）

节点目标、退路、夹击、保护主将、撤退。

## 3. 同权命令

AI 只通过公开 `GameCommand` 改变世界：

```text
Perceive own knowledge
→ Generate bounded candidates
→ Score with policy/personality
→ Select with deterministic tie-breaker/RNG
→ Submit command
→ Receive same validation as player
```

禁止直接写状态、免费资源、读取真相或绕过权限。

## 4. 候选裁剪

先以规则减少候选，再评分：

- 仅可达目标；
- 仅有情报或合理推断目标；
- 仅满足最低资源/权限；
- 距离、季节、关系过滤；
- 每阶段保留 top-K。

不得在每帧穷举全图组合。

## 5. 有界理性

效用示例：

```text
score = strategicValue
      + capabilityFit
      + personalityPreference
      + relationshipEffect
      + factionInterest
      + personalInterest
      - resourceCost
      - perceivedRisk
      + deterministicNoise
```

“个人利益”不是随机捣乱，而来自领地、家族、功勋、野心和安全。

## 6. Decision Trace

重要决定保存：

```ts
interface DecisionTrace {
  readonly actorId: number;
  readonly decisionType: string;
  readonly gameDay: number;
  readonly knowledgeVersion: number;
  readonly candidates: readonly CandidateScore[];
  readonly selectedCandidateId: string | null;
  readonly blockingReasons: readonly ReasonCode[];
  readonly rngDomain?: string;
}
```

生产存档可只保留近期/摘要；调试构建保留完整轨迹。

玩家解释示例：

```text
暂不进攻：安全军粮仅够 38–52 日
等待：一支承诺援军预计晚 16 日
放弃目标：雨季前攻城成功率过低
```

不能只显示“AI 决定等待”。

## 7. 家臣提案

提案由机会触发，不固定每月随机吐卡：

- 邻近城防空虚；
- 供应瓶颈；
- 商路机会；
- 地方不满；
- 人事空缺；
- 外交窗口；
- 个人求赏/派系诉求。

提案有提出者、目标、成本、估计、动机、有效期、权限和可替代方案。玩家可批准、修改、拒绝、授权以后自行处理。

## 8. AI 测试

- 固定微场景：应/不应行动。
- metamorphic：增加敌军不应提高进攻倾向（除特殊诱敌解释）。
- 长跑指标：战争频率、粮尽率、目标取消率、臣属履约、统一速度。
- 差异测试：不同性格/制度应产生可解释分布差异。
- 决策稳定：无关实体变化不应改变本地选择，除非 RNG domain 明确相关。

## 9. 作弊政策

默认 AI 不作弊。高难度可改变：规划深度、风险容忍、信息处理、错误幅度和协调效率。若提供资源加成，必须明确标注且与历史模式分开。
