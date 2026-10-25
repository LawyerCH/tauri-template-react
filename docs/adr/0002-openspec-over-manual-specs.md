# ADR 0002：用 OpenSpec 替代手写 specs/

- 状态：已采纳
- 日期：2026-10-25
- 取代：ADR 0001 第 4 条（"不引入 Spec Kit 工具链"）

## 背景

模板原本用手写的 `specs/NNNN-*.md` 承载需求。实际运行下来有三个问题：

1. **规则没被执行**。`docs/workflow.md` 要求"新建类改动写 spec"，但共享包重构（60 文件）、Astro 官网改造（11 文件）、技能适配三件典型改动都没有 spec。
2. **文件会腐烂**。`0001-shell.md` 里写的 `src/styles/tokens.css` 在 workspace 改造后已不存在；`0003-window-state.md` 状态仍是"进行中"，而功能早已合入 `origin/main`。
3. **缺少累积态**。手写 spec 是"一次性需求快照"，完成即失效；没有地方沉淀"系统现在必须满足什么"。

## 决策

改用 [OpenSpec](https://github.com/Fission-AI/OpenSpec)（MIT，72.9k stars，1.4.1）。

选它而非 spec-kit 的理由：

| 候选 | 排除原因 |
|---|---|
| `github/spec-kit`（142k） | Python CLI + 严格阶段门，官方自评"heavyweight"；本项目不需要 |
| **OpenSpec** | 轻量、无阶段门、`openspec/specs` 累积态 + `openspec/changes` 变更集，正好补上第 3 个缺口 |

> 注：`obra/superpowers` 另行引入，但它与 OpenSpec **不竞争**——前者是开发方法论（逼需求→写计划→执行→验证），后者是规格的存档与累积。分工见 `docs/superpowers.md`。

落地方式：

- CLI 走 Homebrew（`/opt/homebrew/bin/openspec`，1.4.1），不引入 npm 全局包。
- `openspec init --tools github-copilot` 生成 `.github/prompts/opsx-*.prompt.md`（5 个）与 `.github/skills/openspec-*/`（5 个）。
- 关闭遥测：`openspec config set telemetry.enabled false`。
- 目录约定：`openspec/specs/` 是"系统当前必须满足什么"的累积态；`openspec/changes/<name>/` 是单个变更的 proposal + specs + design + tasks；完成后 `openspec archive` 归档。

## 迁移

| 旧文件 | 处理 |
|---|---|
| `specs/_template.md` | 删除，模板由 OpenSpec schema 提供 |
| `specs/0001-shell.md` | 能力沉淀进 `openspec/specs/`，历史决策内容不再保留（ADR 0001 已记录） |
| `specs/0002-desktop-integration.md` | 沉淀进 `openspec/specs/desktop-integration/spec.md` |
| `specs/0003-window-state.md` | 沉淀进 `openspec/specs/window-state/spec.md` |

## 后果

- 需求唯一入口变成 `/opsx:propose`（Copilot 写作 `/opsx-propose`）；手写 `specs/NNNN-*.md` 的做法废止。
- `docs/workflow.md` 第 2 步"定规格"改为调用 OpenSpec 流程。
- 需要记住两条命令：`openspec list`（看进行中的变更）与 `openspec validate --all`（校验格式）。
- 新增一条纪律：改完一个变更必须 `openspec archive`，否则 `changes/` 会堆积。
