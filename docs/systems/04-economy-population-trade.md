# 系统规格 04：经济、人口与贸易

## 1. 设计目标

战争必须先占用某种生产能力。经济不是每月自动进入仓库的三个数字，而是人口、劳役、季节、市场和统治能力的转换过程。

## 2. 核心资源

首版权威资源：

- `cash`：税、贸易、贡赋；用于薪俸、购买、外交、常备力量。
- `grain`：收获、储备、贸易；用于人口安全、军队和围城。
- `labor`：由人口在特定时段提供；用于农业、建设、运输与动员。
- `politicalCapacity`：不可无限囤积的决策/行政容量。
- `strategicGoods`：象、马、火器/金属等有限类别，首版谨慎控制。

## 3. 人口组

聚合而不模拟个人：

```text
cultivators
urbanHouseholds
mobile/forestCommunities
courtAndMilitaryHouseholds
craftSpecialists
forcedOrDisplacedPopulation（只在确有机制和伦理表达时启用）
```

每组有规模、生产角色、义务、迁移倾向、健康/安全和地方关系。首版避免以现代族群作为生产职业硬标签。

## 4. 农业

示例基线：

```text
Harvest = cultivatedArea
        × fertility
        × laborCoverage
        × localControl
        × seasonOutcome
        × infrastructure
```

实际税粮还要经过留种、口粮、地方截留、运输损耗和政策。

动员损失：

```text
FutureHarvestLoss = mobilizedCultivators
                  × absenceDuringCriticalStage
                  × regionalSensitivity
                  × campaignDisruption
```

不得让农兵离田仅支付一次性征召费。

## 5. 常备与随从力量

职业随从/常备力量：

- 持续现金与粮食成本；
- 战备更稳定；
- 不直接抽空农时；
- 形成统治者或地方领主的政治力量。

农兵：

- 现金成本低；
- 农时机会成本高；
- 长期出征士气与补给压力更大；
- 伤亡会损害家庭和未来劳力。

## 6. 市场与贸易

市场收益取决于：

```text
localProduction
routeAccessibility
merchantConfidence
security
demand
polityShareAndFees
```

控制港口或城市不自动锁定全部贸易。战争、苛征、商人迁移和竞争路线可转移繁荣。

首版贸易为路网流量/节点吸引力模型，不做逐个商船 agent。季风影响沿海/河运可达性。

## 7. 贡赋与流转

资源转移必须记录来源和义务：

- 地方税；
- 臣属贡赋；
- 战时采购/征发；
- 外交赠礼；
- 战利品；
- 贸易。

同一份粮食不得既计为地方库存又计为中央库存。运输期间属于 convoy/in-transit 状态并有损耗风险。

## 8. 灾害与人类代价

饥荒、迁徙、强制迁移、疫病不得只是数字波动：

- 影响人口安全、地方信任、生产、军队补充、威望；
- 产生长期恢复时间；
- UI 显示受影响人口和责任来源；
- 不把强制迁移包装为无代价“获得人口”。

## 9. 数值目标

- 和平富裕地区可形成 1–2 年安全储备，但维护过大军队会侵蚀。
- 一次长战役应显著影响至少一个收获周期。
- 直接吞并的新地区名义收入高、最初实现率低。
- 贸易中心收益高但对安全与信用更敏感。

## 10. 不变量

- 人口与资源不为负。
- 资源转移守恒（除明确生产、消费、损耗）。
- 兵力来源可追溯到人口/随从单位。
- 收获只在配置的农事阶段结算一次。
- 税率与比例使用整数基点。
