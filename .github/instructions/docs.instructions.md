---
applyTo: "docs/**/*.md,specs/**/*.md,README.md"
description: 文档与规格写作约定
---
# 文档约定

## 规格（openspec/）

需求由 **OpenSpec** 管理，手写 `specs/NNNN-*.md` 已废止。详见 `docs/openspec.md`。

- 目录：`openspec/specs/` 是能力累积态，`openspec/changes/<name>/` 是进行中的变更
- 每条 Requirement 至少一个 Scenario，写成 `WHEN … THEN …`，必须能当场演示
- 规则里必须含「失败时怎么办」的分支
- `specs/` 用现在时（系统必须满足什么），`changes/` 写计划与任务
- 完成后 `/opsx-archive`，否则 `changes/` 会堆积
- 校验用 `openspec validate --all`（不带参数会进交互）

## 文档（docs/）
| 文件 | 职责 |
|---|---|
| `workflow.md` | 六步流程与退出条件 |
| `openspec.md` | OpenSpec 命令、规格格式、何时必须走 |
| `architecture.md` | 分层、依赖方向、新东西放哪 |
| `ui.md` | 视觉与交互规则 |
| `quality.md` | 自查、提交、发版 |
| `tech-notes.md` | Tauri / 主题 / i18n 踩坑记录 |
| `design.md` | 设计读法、dial、关键决策、状态覆盖 |

- 改视觉时同步更新 `docs/design.md`
- 架构决策写进 `docs/adr/NNNN-*.md`：只记"选了什么、为什么、放弃了什么"

## 写作
- 中文；先结论后细节
- 约束用表格承载，不写大段散文
- 示例命令必须可直接复制执行，不留占位符
