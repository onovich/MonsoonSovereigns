# 依赖准入模板

新增生产依赖前记录：

- 解决的问题；
- 为什么平台 API/已有依赖不能解决；
- 维护活跃度与 bus factor；
- 许可证；
- 安装脚本/原生代码/网络行为；
- bundle/runtime 内存影响；
- Web Worker/Electron/Node 兼容；
- 替代方案；
- 升级/移除策略。

核心 schema 库（Zod/TypeBox）通过一个小 spike 选一套；禁止长期双栈。
