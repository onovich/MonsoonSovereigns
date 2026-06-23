# 项目术语表

| 术语 | 项目定义 |
|---|---|
| Polity / 政体 | 能作外交并承担义务的政治实体，不默认等于现代国家 |
| District / 地区 | 人口、经济与实际控制的基础单位 |
| Settlement / 聚落 | 城、镇、港、寺院或堡垒等节点 |
| Controller / 实控者 | 当前能在地区执行主要治安/征发的唯一政体 |
| Suzerain / 宗主 | 通过义务关系约束另一政体的直接上级 |
| Vassal / 臣属 | 保留自身宫廷/资源但承担义务的政体；具体历史术语另行本地化 |
| Obligation / 义务 | 贡赋、出兵、人质、通行、外交限制等可履约承诺 |
| Claim / 宣称 | 对职位、地区或统治权的主张，不等于实控 |
| Administrative Load | 直接治理、通信、边境和复杂性造成的组织负荷 |
| Political Capacity | 任命、干预、政策和承诺可用的组织容量，不是无限囤积点数 |
| FactionKnowledge | 某政体已知/估计的世界状态，而非真相 |
| Command | 玩家/AI 请求改变世界的版本化意图 |
| Domain Event | 已发生的语义结果，用于 read model、日志和回放尾 |
| Read Model | 为 UI/AI 查询准备的只读、裁剪视图 |
| WorldState | 模拟 Worker 内的唯一权威运行状态 |
| Definition | 内容编译后不可变规则/历史数据 |
| Determinism | 相同定义、状态、种子、命令得到相同 hash |
| Decision Trace | AI 候选、评分、阻塞和选择的可复现记录 |
| Vertical Slice | 小内容规模但含完整闭环的可玩证明，不是演示动画 |
| HISTORICAL | 有可靠来源支持的内容 |
| INFERRED | 由证据合理推断但非直接记载 |
| COMPOSITE | 多个来源/典型合成为一个游戏实体 |
| FICTIONAL | 明确虚构内容 |
| FROZEN | 普通任务不得改变的项目基线 |
| TARGET | 目标规格，可经测试和 ADR 调整 |
| HYPOTHESIS | 必须通过原型/数据验证的假设 |
| RESEARCH REQUIRED | 证据不足，不得进入正式内容 |

注：`mandala` 仅作为史学讨论词，不作为一个万能、无差别的游戏实体类型。
