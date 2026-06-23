# 系统设计索引

游戏系统都应服务同一命题：**玩家通过分配权力、人口、义务和信用来组织战争，并承受这些选择的长期后果。**

| 文档 | 核心问题 | 主要依赖 |
|---|---|---|
| `systems/01-world-time-map.md` | 世界如何分区、时间如何推进 | 无 |
| `systems/02-polity-vassalage-governance.md` | 如何统治而非仅占领 | 世界、人物 |
| `systems/03-characters-court-succession.md` | 谁执行命令、为何忠诚或背叛 | 政体、关系 |
| `systems/04-economy-population-trade.md` | 战争从哪里取得人口、粮食与现金 | 世界、治理 |
| `systems/05-campaign-logistics-intelligence.md` | 何时能打、能走多远、知道多少 | 经济、地图、人物 |
| `systems/06-battle-siege.md` | 战役如何转化为伤亡、威望与控制 | 战役、人物 |
| `systems/07-diplomacy-legitimacy.md` | 如何建立承认、承诺与联盟 | 政体、人物 |
| `systems/08-ai-proposals-explainability.md` | 代理人如何有界理性行动 | 全系统查询 |
| `systems/09-ui-ux-accessibility.md` | 玩家如何理解复杂系统 | read model |
| `systems/10-save-content-mods.md` | 如何持久化和填充世界 | 全部数据定义 |

## 共同系统原则

1. 不存在孤立资源条；每项资源至少参与两个系统。
2. 每个优势都有机会成本或暴露面。
3. 每个系统有明确权威状态、更新频率、不变量、玩家解释和 AI 接口。
4. 数值不能替代关系与制度；人物不能退化为四维属性卡。
5. 领土变化不是战争唯一结果；臣服、贡赋、迁徙、威望、俘虏、人质和信用同样重要。
6. 规则先支持自动结算与无界面模拟，再添加表现层。
7. 首版优先“少而联动”，不追求每种历史细节都有按钮。
