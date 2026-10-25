# AGENTS.md

> 本项目唯一的 AI 入口。`CLAUDE.md` 只有一行 `@AGENTS.md`。

## 这是什么

桌面应用模板 + 官网，pnpm workspace 三个项目：

| 项目 | 路径 | 技术栈 |
|---|---|---|
| 桌面应用 | 仓库根 | Tauri 2 + React 19 + Vite 8 |
| 共享 UI 包 | `packages/velora` | Velora 组件与令牌 |
| 官网站点 | `website` | Astro 7 + 同一份 UI 包 |

## 铁律

1. **没有验收标准不写代码**。先有可演示的"做完是什么样"。
2. **一次只做一件事**。超过 5 个文件或 200 行先拆。
3. **设置只有一处**：`src/lib/settings/store.ts`，组件里不碰 `localStorage`。
4. **文案必须双语**：改 `zh-CN.json` 必须同步 `en.json`，key 结构一致。
5. **UI 只用令牌**：颜色、圆角、间距走 `packages/velora/styles/`，不写裸值。
6. **组件只有一份**：动画组件与 shadcn 基础件在 `packages/velora`，不在 `src/` 重建。
7. **完成 = 跑过校验并贴输出**。
8. **不擅自扩权**：新依赖、新插件、新权限，先说理由与代价。

## 命令

| 命令 | 用途 |
|---|---|
| `pnpm check` | typecheck + lint + test，提交前的唯一标准 |
| `pnpm check:rust` | cargo fmt + clippy |
| `pnpm dev` / `pnpm tauri dev` | 前端 / 完整桌面应用 |
| `pnpm tauri build` | 打包 |
| `pnpm website:dev` / `website:check` / `website:build` | 官网 |
| `pnpm velora list` / `add <name>` | 共享包组件清单 / 拉取 |
| `openspec list` / `validate --all` / `archive <name>` | 规格 |
| `pnpm vitest run -t "名字"` | 只跑某个测试 |

## 需求流程

**必须走 OpenSpec**（任一命中）：跨两个及以上包、新增或改变公开 API / 路由 / 设置字段、涉及 Rust 或权限、预计超过 5 个文件或 200 行。

其余情况口头说清验收条件即可，但仍要满足完成定义。

```
/opsx-explore → /opsx-propose <name> → /opsx-apply → /opsx-archive
```

规格只有一个落点：`openspec/`。`specs/` 是累积态，`changes/<name>/` 是进行中的变更（proposal / specs / design / tasks）。

## 技能

**最多同时加载 2 个**。

**流程类**：`systematic-debugging`（修 bug）、`test-driven-development`（写新逻辑）、`verification-before-completion`（交付前）、`requesting-code-review` / `receiving-code-review`（审查）、`dispatching-parallel-agents`（并行）、`using-git-worktrees`（隔离开发）。

**设计类**：`ui-gate`（视觉门禁，优先级最高）、`ui-ux-pro-max`（配色字体候选）、`ui-styling`（落地实现）、`intent-spec`（拆需求）、`project-structure`（定目录）、`quality-review` / `release-check`（审查与提交）。

技能与项目规范冲突时**以项目为准**：

1. 令牌不换，落地用 `packages/velora/styles/tokens.css`
2. 不用 `npx shadcn@latest add`，缺组件用 `pnpm velora add <name>`
3. 设计决策写 `docs/design.md`，不生成 `design-system/`
4. 规格与计划写 `openspec/`，不接受会另建规格目录的技能
5. 不为技能装依赖

## 最容易踩的坑

| 坑 | 正确做法 |
|---|---|
| `CLAUDE.md` 写成软链 | 它是普通文件，内容只有一行 `@AGENTS.md` |
| 两套按钮 | 业务用 `src/components/ui/Button.tsx`，区块内部用 `@template/velora/ui/button` |
| 区块自带英文文案 | 拉取 block 后先替换顶部的常量文案 |
| 手写 `specs/NNNN-*.md` | 已废止，需求一律走 `openspec/` |

## 边界

**总是**：改前先读文件；复用已有组件；小步提交（Conventional Commits）；Rust 改动跑 `check:rust`；改 UI 后跑 `website:build`。

**先问**：引入新依赖或插件；改目录分层或公共组件 API；需求缺"失败时怎么办"。

**绝不**：提交 `.env` / 密钥 / `src-tauri/target`；`git push --force` 或直推 `main`；用 `alert()` 报错或用 emoji 当图标；为"以后可能用到"提前抽象。

## 完成定义

- [ ] 验收标准逐条可演示
- [ ] 走 OpenSpec 的改动：`openspec validate --all` 通过且已 archive
- [ ] `pnpm check` 通过（贴输出）
- [ ] 涉及 Rust / 官网 / UI 时，对应校验各跑一遍
- [ ] 新增文案中英两版都在

## 细则去哪看

| 文件 | 什么时候读 |
|---|---|
| `docs/workflow.md` | 非琐碎改动开始前 |
| `docs/architecture.md` | 新增文件、跨层改动 |
| `docs/ui.md` + `docs/design.md` | 视觉与交互改动 |
| `docs/velora.md` | 用或加 Velora 组件 |
| `docs/quality.md` | 审查、提交、发版 |
| `docs/tech-notes.md` | 碰到 Tauri / 主题 / i18n 的坑 |
| `openspec/specs/` | 看某块能力当前必须满足什么 |
| `.github/instructions/` | 改 `src/`、`src-tauri/`、`docs/` 时自动命中 |
