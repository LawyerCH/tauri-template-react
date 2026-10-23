---
applyTo: "docs/**/*.md,specs/**/*.md,README.md"
description: 文档与规格写作约定
---
# 文档约定

## 规格（specs/）
- 命名 `specs/NNNN-<name>.md`，模板见 `specs/_template.md`
- 验收标准必须可执行、可演示；不写"体验更好"这类无法判定的描述
- 需求里必须包含"失败时怎么办"

## 文档（docs/）
| 文件 | 职责 |
|---|---|
| `workflow.md` | 六步流程与退出条件 |
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
