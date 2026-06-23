# 系统规格 02：政体、臣属与治理

## 1. 设计目标

占领、承认与统治是三件不同的事。帝国应表现为由宫廷、地方王族、军事据点、贡赋义务和个人忠诚构成的网络。

## 2. 政治实体

`Polity` 是能做外交和承担义务的主体，可是王国、城邦、山地领主集团或附庸宫廷。首版不对所有实体使用现代“国家”模板。

核心字段：

```text
ruler
court
capital/itinerantSeat
controlledDistricts
suzerainId?
obligations
claims
legitimacyProfile
autonomy
administrativeCapacity
```

## 3. 控制与宗主链

- 一个 District 只有一个 `controllerPolityId`。
- 一个 Polity 最多一个直接宗主，形成无环宗主链。
- 宗主不能直接支配臣属所有 District；其权力来自义务和干预权。
- 可有多个宣称者、保护承诺、贸易依赖和宗教承认。

义务示例：

```text
annualTribute
campaignTroops
hostage
courtAttendance
militaryAccess
foreignPolicyConstraint
marriagePromise
ritualAcknowledgement
```

每项义务包含数额/条件、到期、履行历史、争议和违约后果。

## 4. 治理权束

地区权力拆分为：

- 实际治安/军事实控；
- 税收与贡赋；
- 征发劳力；
- 征兵；
- 任命地方代理人；
- 建设和驻军；
- 司法/仪式性承认（首版可抽象）。

首版不需要让每个 District 同时有五个所有者，但必须在领主职位与义务中表达权利并非绝对所有权。

## 5. 行政能力与授权

```text
AdministrativeLoad = Σ(localComplexity × communicationCost × directness × frontierPressure)
AdministrativeEfficiency = capacity / max(capacity, load)
```

超载渐进导致：

- 命令和情报延迟；
- 收入流失；
- 地方自主决策增加；
- 贡赋/征兵履约下降；
- 人事与忠诚风险；
- 玩家需要建立军团或保留臣属。

不得使用“超过十城就完全不能控制”的硬断点。

## 6. 战后安排

战争结束后玩家在以下方案中选择：

- 直接控制并驻军；
- 恢复/保留原统治者为臣属；
- 另立亲近王族；
- 划出边疆军事领；
- 仅要求贡赋、通行或人质；
- 接受有条件停战。

每个方案立即给出：行政负荷、驻军、合法性、地方接受度、臣属可靠性和未来叛乱风险预测。

## 7. 臣属可靠性

不使用单一“忠诚值”。至少包括：

```text
fear
trust
interestAlignment
localPower
rulerRelationship
successionSecurity
recentTreatment
outsideOptions
```

是否违约由能力、机会、动机共同决定。高好感也可能因生存利益拒绝出兵；被威慑的臣属可能在宗主失败后迅速脱离。

## 8. 不变量

- 宗主链无环。
- 义务付款/兵力不重复计入多个宗主。
- 地区控制转移必须经领域命令和事件。
- 已被废除的 Polity 仍保留历史 ID，不复用。
- 行政超载不能直接生成或销毁资源，只改变可实现率与风险。

## 9. 垂直切片证明

同一敌对地区至少支持：直接吞并、保留臣属、仅索贡三种可行战后方案，且在 24 个游戏月内产生明显不同的收入、行政、忠诚和军事后果。
