# OpenSpec 使用说明

> 规格真源是 [OpenSpec](https://github.com/Fission-AI/OpenSpec)（MIT）。它是本仓库唯一的需求管理方式，手写 `specs/NNNN-*.md` 已废止（见 `docs/adr/0002-openspec-over-manual-specs.md`）。

## 落地了什么

`openspec init --tools github-copilot` 生成了两类文件：

| 位置 | 内容 | 作用 |
|---|---|---|
| `.github/prompts/opsx-*.prompt.md` | 5 个：explore / propose / apply / archive / sync | Copilot 里输入 `/opsx-propose` 等触发 |
| `.github/skills/openspec-*/SKILL.md` | 5 个同名技能 | 供其他 agent 与自动触发 |
| `openspec/specs/` | 能力累积态 | 「系统当前必须满足什么」 |
| `openspec/changes/` | 进行中的变更 | 每个变更一个文件夹 |

CLI 来自 Homebrew（`openspec --version` 应输出 1.4.1+），不引入 npm 全局包。遥测已关闭。

## 日常工作流

```bash
# 1. 需求还不清楚：先探索
/opsx-explore

# 2. 需求明确了：生成变更
/opsx-propose add-dark-mode

# 3. 按 tasks 实现
/opsx-apply

# 4. 归档，能力合并进 specs/
/opsx-archive
```

`propose` 会生成四份文件：

```
openspec/changes/add-dark-mode/
├── proposal.md     为什么做、改什么
├── specs/          Requirement + Scenario（WHEN/THEN）
├── design.md       技术方案与取舍
└── tasks.md        可勾选的实现清单
```

## 命令行速查

| 命令 | 作用 |
|---|---|
| `openspec list` | 进行中的变更 |
| `openspec list --specs` | 已沉淀的规格 |
| `openspec validate --all` | 校验格式（**非交互**，可进 CI） |
| `openspec show <name>` | 看某个变更或规格的详情 |
| `openspec archive <name>` | 归档并把能力合并进 `specs/` |
| `openspec status --change <name>` | 看某个变更的产物完成度 |

**注意**：`openspec validate` 不带参数会进交互式选择（会卡住），脚本里一律用 `--all`。

## 什么时候必须走 OpenSpec

任一命中即走：

- 跨两个及以上包（根 `src` / `packages/*` / `website` / `src-tauri`）
- 新增或改变公开 API、路由、设置字段
- 涉及 Rust 侧、Tauri 插件、capabilities 权限
- 单次改动预计超过 5 个文件或 200 行

改错别字、调格式、单文件小修不需要。

## 写规格的硬要求

1. **每条 Requirement 至少一个 Scenario**，写成 `WHEN … THEN …`，能当场演示。
2. **失败分支必须写**：异常、空数据、无权限时的表现。
3. **不写"体验良好"**这类无法判定的描述。
4. **`specs/` 是现在时**：描述"系统必须满足什么"，不写"计划做什么"。计划属于 `changes/`。
5. 改动完成必须 `archive`，否则 `changes/` 会堆积成垃圾场。

## 当前已有规格

| 规格 | Requirements | 覆盖范围 |
|---|---|---|
| `openspec/specs/app-shell/spec.md` | 6 | 三页外壳、主题、双语、设置单一来源、任务页、验收命令 |
| `openspec/specs/desktop-integration/spec.md` | 7 | 关闭到托盘、单实例、托盘菜单、通知、自启、浏览器降级、日志 |
| `openspec/specs/window-state/spec.md` | 2 | 窗口几何恢复、状态损坏回落 |

## 与技能的关系

- `intent-spec`（项目技能）：把一句话需求问清楚，产出可写进 `/opsx-propose` 的输入。
- `quality-review` / `release-check`：实现完成后审查与提交。
- 三者顺序：`intent-spec` → OpenSpec `propose` → 实现 → `quality-review` → `release-check`。
