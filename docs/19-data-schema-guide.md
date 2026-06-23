# 数据模型与 Schema 指南

## 1. 目标

内容数据应可由人编辑、由构建工具严格验证、由运行时高效读取，并保留历史来源和稳定 ID。

## 2. ID 规范

机器 ID：

```text
officer.toungoo.bayinnaung
polity.toungoo.1531
district.irrawaddy.toungoo_core
settlement.pegu
source.lieberman.1984.admin_cycles
```

- 小写 ASCII、点分命名空间；
- 发布后不复用；
- 显示名可变、ID 不变；
- 剧本状态引用定义 ID，不复制文本。

内容编译器将字符串 ID 映射为运行时紧凑整数，并生成 manifest。

## 3. Definition 示例

```json
{
  "id": "officer.example",
  "historicity": "COMPOSITE",
  "displayNameKey": "officer.example.name",
  "validFrom": 1531,
  "validTo": 1600,
  "abilities": {
    "command": 55,
    "valor": 42,
    "administration": 63,
    "intrigue": 58
  },
  "traitIds": [],
  "sourceIds": [],
  "confidence": "LOW"
}
```

这只是 schema 形状，不是正式人物。

## 4. 场景状态与定义分离

Definition：人物身份、地区地形、路线基础、政策规则。  
Scenario State：某年所属、库存、职位、关系、军队、健康。

不要在人物定义里写“永远属于某势力”，也不要把 1581 的关系覆盖 1531。

## 5. 数值单位

所有字段名或 schema description 标明：

- integer count；
- basis points；
- game days；
- map units；
- abstract grain/cash/labor units；
- display 1–100 ability。

不允许同一字段在不同内容文件使用不同单位。

## 6. 来源字段

```json
{
  "claimId": "HIST-0001",
  "sourceIds": ["source.example"],
  "confidence": "MEDIUM",
  "historicity": "INFERRED",
  "note": "Exact year disputed; scenario uses working date."
}
```

能力和关系可引用多个 claim，不只实体整体引用一条来源。

## 7. GeoJSON

- geometry 仅用于视觉和内容 authoring；
- 权威邻接/距离由明确 route definitions 生成，不从像素临时推断；
- 坐标系、简化容差和来源写入 metadata；
- 不以现代行政 polygon 直接冒充 16 世纪边界。

## 8. Localization

```text
key
zh-Hans
zh-Hant
english
source_note
context
character_limit
```

- key 稳定；
- 名称支持别名和不同剧本称号；
- 变量使用具名 ICU 风格，不拼接句子；
- 历史术语有 tooltip/plain-language gloss。

## 9. 事件数据

事件必须声明：

```text
id
historicity
sourceIds
availability window
trigger/conditions
effects via commands
player choices
AI evaluation
cooldown/one-shot
localization keys
test fixture
```

不得把史实事件写成无条件强制结果；除“历史锁定模式”外，条件不满足时不强演。

## 10. 验证层次

1. 语法/schema；
2. ID 唯一；
3. 引用完整；
4. 时间有效；
5. 图连通/坐标；
6. 领域不变量；
7. 历史来源/置信度；
8. 本地化覆盖；
9. 事件可达性和循环；
10. 场景经济/人口守恒。

内容错误必须指出文件、JSON path、ID 和修复建议。
