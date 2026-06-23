# 系统规格 05：战役、补给与情报

## 1. 设计目标

玩家在部队移动前完成真正的战略选择。能否集结、走哪条路、雨季前还有多少时间、谁会出兵，比战场点击速度更重要。

## 2. 战役状态机

```text
Concept
→ IntelligenceGathering
→ Planning
→ Mobilizing
→ Rallying
→ Marching
→ Engaging / Besieging / Maneuvering
→ Withdrawal / Occupation
→ Demobilization
→ Settlement
```

玩家可在阶段间取消或修改，但会产生沉没成本、信用和农时损失。

## 3. 战役计划

计划至少包含：

```text
objective
target
rallyPoints
rallyDate
assignedForces
obligatedVassals
routePolicy
supplyPlan
acceptableLoss
abortConditions
postwarIntent
```

界面显示预测区间，而非虚假精确值。

## 4. 备战

备战消耗：

- 地方领主/官员时间；
- 粮食采购与运输；
- 人口动员；
- 常备军薪饷；
- 道路、船只、象/畜力；
- 臣属信用与通知时间。

未完成备战也可出征，但携粮、队形、士气、集结和逃亡风险更差。

## 5. 补给

军队库存与补给线分开：

```text
OnHandSupply
InTransitConvoys
SourceStockpiles
RouteCapacity
DailyConsumption
Forage/PurchasePotential
LossAndInterdiction
```

补给可来自本国、臣属、盟友通行、当地采购和掠夺。后两者必须影响地方关系与人口安全。

预测输出：

- 安全作战天数；
- 最远安全推进节点；
- 瓶颈边；
- 预计雨季变化；
- 断粮概率区间；
- 撤退路径。

## 6. 集结与同步

战役规划器支持指定共同抵达日。系统自动给出各军出发建议，而不是要求玩家逐军手调。

不能准时抵达的原因以 reason code 显示：

```text
INSUFFICIENT_NOTICE
ROUTE_CAPACITY
VASSAL_REFUSAL
HARVEST_CONFLICT
COMMANDER_DELAY
ENEMY_INTERDICTION
```

## 7. 情报

来源：侦察、地方关系、商人、使者、俘虏、盟友、传闻。每条情报有更新时间、范围和可信度。

玩家看到：

```text
敌军约 4,000–7,000
最后确认：18日前
来源：两项相互印证
援军：可能，可信度中
```

AI 使用同样信息，不读取真实数组。

## 8. 撤退与终止

每个战役必须有 abort condition，例如：

- 作战天数低于阈值；
- 敌援军优势超过阈值；
- 雨季前无法完成目标；
- 关键臣属未履约；
- 本国发生继承危机；
- 退路受威胁。

撤退是合理决策，不应总被视为失败；但可能损失威望、供应或盟友信任。

## 9. 不变量

- 军队每日消耗有来源并一次结算。
- 补给边容量不能被多个 convoy 重复使用。
- 未知路线不能被 AI 精确规划。
- 同一单位不能同时属于两个战役。
- 战役结束必须释放动员人口/职位占用并结算后果。

## 10. 垂直切片

玩家可比较旱季道路快速进攻与雨季河运路线；系统能解释为什么某支军队未能集结、为何 AI 延迟或撤军。
