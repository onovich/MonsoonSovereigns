# 系统规格 10：存档、内容与 Mod

## 1. 存档目标

- 可恢复、可校验、可迁移；
- 浏览器和 Electron 共用权威格式；
- 可检查和调试；
- 不依赖 JS 类原型或运行时对象图；
- 内容版本不匹配时给出明确结果。

## 2. 存档结构

```text
SaveEnvelope
├─ header
│  ├─ schemaVersion
│  ├─ gameBuild
│  ├─ contentManifestHash
│  ├─ scenarioId
│  ├─ seed
│  ├─ currentDay
│  └─ checksum
├─ worldSnapshot
├─ pendingCommands
├─ recentEventTail (optional)
└─ presentationState (separate/optional)
```

早期使用可读、版本化 JSON + 压缩；若测量证明体积/速度不足再评估 MessagePack。不得先做自定义不可调试二进制。

## 3. 保存流程

模拟 Worker 在完整 commit 边界生成 snapshot；主线程不拼装权威状态。

Electron：

```text
serialize → temp file → flush/close → verify → rotate backup → atomic replace
```

Web：IndexedDB + persistent storage 请求 + 明确导出/导入文件。浏览器存储不能作为唯一保障。

## 4. 迁移

- 每个 schema 版本有显式迁移或明确拒绝。
- 不在解析器中散布兼容分支。
- 保存真实旧版 golden saves。
- 迁移结果再次 schema 验证并计算 hash。
- 内容 manifest 不同但可兼容时记录映射；无法兼容时不静默丢内容。

## 5. 内容源

```text
CSV: 人物、地区、简单表格
GeoJSON: 地区边界、路线、坐标
JSON: 政策、事件、剧本、复杂配置
Localization: 独立 key/value 表
Assets: 图像、字体、音频 manifest
```

内容编译器：验证 → 解析 → 稳定 ID → 交叉引用 → 地图/事件校验 → 生成只读 content pack 和 manifest。

## 6. 历史内容元数据

每个可验证实体/声明包含：

```text
historicity: HISTORICAL | INFERRED | COMPOSITE | FICTIONAL
sourceIds
confidence: HIGH | MEDIUM | LOW | DISPUTED
validFrom/validTo
notes
```

玩家界面不必显示全部内部元数据，但百科/鸣谢可披露。

## 7. 事件 DSL

事件由类型化触发器和效果组成：

```text
Trigger: date, relationship, succession, control, obligation, resource, campaign...
Condition: all/any/not + typed predicates
Effect: issueCommand, addClaim, modifyRelation, createProposal, startCrisis...
```

禁止执行任意 JavaScript、动态 import 或字符串 eval。内容编译器检查不可达事件、循环和无效引用。

## 8. Mod 范围

1.0 候选：数据 Mod（人物、剧本、数值、政策、事件、地图内容）。是否正式开放在 milestone 决定。

明确不支持：

- 任意 JS/DLL；
- 覆盖 Electron preload/main；
- 运行远程代码；
- 未声明依赖的 load-order 魔法。

若开放 Mod，使用 manifest、命名空间、依赖、版本和冲突报告。Mod 存档记录完整内容列表。

## 9. 不变量

- 同一快照在 Node/浏览器解析后状态 hash 一致。
- ID 不复用。
- 存档损坏不覆盖最后有效备份。
- 内容失败在启动/构建明确终止，不带缺失引用继续运行。
- presentation state 不能改变权威结果。
