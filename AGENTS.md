# AGENTS.md

> 本文件是本项目唯一的 AI 入口。`CLAUDE.md` 只有一行 `@AGENTS.md` 引用它，规范只维护这一份。

## 两层规范的分工

| 层 | 位置 | 管什么 |
|---|---|---|
| 全局 | 各 agent 的全局规则文件 | 环境纪律、工作流、界面设计门、终端命令安全、MCP 预算 |
| 项目 | 本文件 + `docs/` + `.github/instructions/` | 这个仓库怎么改：分层、命令、验收、边界 |

- 全局管"怎么做事"，项目管"这个仓库怎么改"
- 同一件事两边都写了，**按更严格的一条执行**，不要各听一半
- 路径级约定放在 `.github/instructions/`，命中对应文件时自动生效

## 这是什么

可直接开工的桌面应用模板 + 产品官网，pnpm workspace 三个项目：

| 项目 | 路径 | 技术栈 |
|---|---|---|
| 桌面应用 | 仓库根 | Tauri 2 + React 19 + Vite 8 |
| 共享 UI 包 | `packages/velora` | Velora（shadcn registry）组件与令牌 |
| 官网站点 | `website` | Astro 7（静态预渲染）+ 同一份 UI 包 |

验收：`pnpm check` 全绿、`pnpm website:check` 无错、`pnpm tauri build` 能出包。

## 铁律

1. **没有验收标准不写代码**：除错别字、格式化外，先有可验证的"做完是什么样"，再动手。
2. **一次只做一件事**：单次改动超过 5 个文件或 200 行，先拆；拆不开说明还没想清楚。
3. **设置只有一处**：用户偏好一律进 `src/lib/settings/store.ts`，组件里不直接读写 `localStorage`。
4. **文案必须双语**：动 `src/locales/zh-CN.json` 就必须同时动 `en.json`，并保持 key 结构一致。
5. **UI 只用令牌**：颜色、圆角、间距走 `packages/velora/styles/`，不写裸色值。
6. **UI 组件只有一份**：动画组件与 shadcn 基础件都在 `packages/velora`，不在 `src/` 里重建。
7. **完成 = 验证过**：实际跑过校验并贴出结果。没跑过不许说"已完成"。
8. **不擅自扩权**：新依赖、新 Tauri 插件、新 capabilities 权限，先说明理由与代价再动手。

## 命令

| 命令 | 用途 |
|---|---|
| `pnpm check` | typecheck + lint + test，提交前的唯一合格标准 |
| `pnpm check:rust` | `cargo fmt --check` + `cargo clippy -D warnings` |
| `pnpm dev` | 只跑桌面端前端，浏览器调试 |
| `pnpm tauri dev` | 完整桌面应用 |
| `pnpm tauri build` | 打包安装包 |
| `pnpm website:dev` | 起官网（Astro，localhost:1421） |
| `pnpm website:build` | 构建官网静态产物 |
| `pnpm website:check` | 官网类型检查 |
| `pnpm velora list` | 看还有哪些组件/区块没装 |
| `pnpm velora add <name>` | 拉取组件或区块（自动递归依赖、改写导入、合并 CSS） |
| `pnpm velora add --category <类别>` | 按类别批量拉取 |
| `openspec list` | 看进行中的变更（OpenSpec） |
| `openspec list --specs` | 看已沉淀的规格 |
| `openspec validate --all` | 校验规格格式 |
| `pnpm vitest run -t "名字"` | 只跑某个测试 |

## 工作流（六步）

理解 → 定规格 → 按层拆（类型 → 逻辑 → UI → 测试）→ 实现 → 验证 → 交付。

- 规格由 **OpenSpec** 管，入口是 `/opsx-explore`（想不清）与 `/opsx-propose <name>`（想清了）；完成后 `/opsx-archive`
- 细则与「什么规模必须走 OpenSpec」见 `docs/workflow.md`
- 意图不明先归类再问，不猜

## 任务路由

| 用户意图 | 典型说法 | 先读 | 技能 |
|---|---|---|---|
| 新功能 / 新页面 | "加个 xx 功能" | `docs/workflow.md` | `intent-spec` → OpenSpec `/opsx-explore` → `/opsx-propose` |
| 改界面 / 调样式 | "这里不好看""换个配色" | `docs/ui.md` | `ui-gate` |
| 目录 / 模块架构 | "重构一下目录""加个模块" | `docs/architecture.md` | `project-structure` |
| 用 Velora 组件 | "加个 hero""要个 pricing 区" | `docs/velora.md` | — |
| 修 bug / 报错 | "报错了""不生效" | `docs/workflow.md` §修复 | `systematic-debugging` |
| 质量审查 | "审查一下""有没有问题" | `docs/quality.md` | `quality-review` |
| 提交 / 发版 | "提交""打包发布" | `docs/quality.md` §交付与发布 | `release-check` |
| 清理磁盘 | "空间不够""清理缓存" | 全局清理技能 | `cleanup-disk` |
| 纯问答 | "这是啥""怎么用" | 直接回答 | 不改文件 |

一句话咨询不要启动六步流程；但只要你开始改代码，就必须回到对应流程。

## 技能使用规则

项目里装了两类技能（`.agents/skills/` 共 19 个），功能有重叠。**最多同时加载 2 个**，按下面分工取。

**流程类**（superpowers 的子集，详见 `docs/superpowers.md`）：

| 场景 | 技能 |
|---|---|
| 修 bug / 行为异常 | `systematic-debugging` |
| 写新逻辑 | `test-driven-development` |
| 交付前验证 | `verification-before-completion` |
| 主动请求 / 接收审查 | `requesting-code-review` / `receiving-code-review` |
| 互不依赖的并行任务 | `dispatching-parallel-agents` |
| 需要隔离开发 | `using-git-worktrees` |

**这三个技能从哪里拿输入**（细则见 `docs/handoff.md`）：

| 技能 | 读什么 |
|---|---|
| `test-driven-development` | `openspec/changes/<name>/specs/*.md` 的 `Scenario`；找不到对应 Requirement 就先补规格 |
| `requesting-code-review` | `tasks.md` 的勾选 + delta spec 的 Scenario + `design.md` 的决策 |
| `verification-before-completion` | 逐条核对 `tasks.md`，不凭记忆列清单 |

**不存在第二个事实源**。任何技能让你读 `docs/superpowers/plans/` 或 `docs/superpowers/specs/`，一律忽略。

> superpowers 的 `brainstorming`、`writing-plans`、`executing-plans`、`subagent-driven-development`、`finishing-a-development-branch` **已移除**——它们会写 `docs/superpowers/` 下的设计文档与计划，与 OpenSpec 的 `proposal/design/tasks` 一一重叠。需求与计划一律走 OpenSpec。

**设计类**：

| 场景 | 技能 | 边界 |
|---|---|---|
| 需求拆规格 | `intent-spec` | 产出交给 OpenSpec `/opsx-propose` |
| 定风格 / 配色 / 字体候选 | `ui-ux-pro-max` | 推荐只作候选，令牌仍用本项目的 |
| 查 UX 细节（空态、校验、无障碍、动效） | `ui-ux-pro-max` `--domain ux\|motion` | 同上 |
| 落地实现（组件 API、Tailwind、深色） | `ui-styling` | **不用它的 `npx shadcn` 命令** |
| 视觉门禁与自检 | `ui-gate` | 本项目三道门，优先级最高 |
| 目录 / 模块怎么放 | `project-structure` | — |
| 审查改动、提交发版 | `quality-review` / `release-check` | — |
| 清理磁盘 | `cleanup-disk` | — |

`banner-design`、`brand`、`design`、`design-system`、`slides` 是通用设计技能，**本项目暂时用不到**。

硬约束（技能与项目规范冲突时，一律以项目为准）：

1. **令牌不换**：任何技能推荐的色板、字体、圆角都只当候选，落地用 `packages/velora/styles/tokens.css` 里的变量。
2. **组件不另装**：不用 `npx shadcn@latest add`，缺组件用 `pnpm velora add <name>`。原因见 `docs/velora.md`。
3. **设计决策只有一个落点**：写 `docs/design.md`，不用 `ui-ux-pro-max --persist` 生成 `design-system/`。
4. **规格与计划只有一个落点**：写 `openspec/`。不要引入任何会写 `docs/superpowers/specs|plans/` 的技能。
5. **不为技能装依赖**：`ui-ux-pro-max` 的脚本只用 Python 标准库。不要 `pip install`，也不要 `npm i -g`。

`ui-ux-pro-max` 的检索是**关键词命中**，不是语义搜索。查不到时换更贴近准则的措辞（例如用 `"form validation error"` 而不是 `"设置面板不好看"`），别拿空结果当"没有建议"。

## 三条最容易踩的坑

| 坑 | 现象 | 正确做法 |
|---|---|---|
| **CLAUDE.md 写成软链** | 编辑 `CLAUDE.md` 时实际改的是 `AGENTS.md`，把规范覆盖成一行 `@AGENTS.md`，两个文件都变成自引用 | `CLAUDE.md` 是**普通文件**，内容只有一行 `@AGENTS.md`；规范只写在 `AGENTS.md` |
| **两套按钮** | 不知道用哪个 `Button` | 业务用 `src/components/ui/Button.tsx`（已封装 shadcn 版）；区块内部用 `@template/velora/ui/button` |
| **区块自带的英文文案** | 页面上出现 "How does the 14-day free trial work" | 拉取 block 后先把它顶部的 const 文案换成本产品内容 |
| **旧 specs/ 目录** | 又想手写 `specs/NNNN-*.md` | 已废止，需求一律走 `openspec/`。手写两份会漂移 |

## 边界

**总是**：改前先读文件；复用已有组件与工具；小步提交（Conventional Commits）；Rust 改动后跑 `check:rust`；改 UI 后跑 `website:build`。

**先问**：引入新依赖或 Tauri 插件；改目录分层或公共组件 API；需求里缺"失败时怎么办"。

**绝不**：提交 `.env`/密钥/`src-tauri/target`；`git push --force` 或直推 `main`；用 `alert()` 报错、用 emoji 当图标；为"以后可能用到"提前抽象；修改 `packages/velora/src/` 里的 registry 源码（加 prop 属例外，见 `docs/tech-notes.md`）。

## 上下文地图

按需读，不要一次全读（避免上下文过载）。

| 文件 | 什么时候读 |
|---|---|
| `docs/workflow.md` | 任何非琐碎改动开始前 |
| `docs/openspec.md` | 用 OpenSpec 管需求：命令、格式、何时必须走 |
| `docs/superpowers.md` | 流程类技能的子集与移除原因 |
| `docs/handoff.md` | **规格与实现的交接契约**：TDD 测什么、review 对什么、验证勾什么 |
| `docs/architecture.md` | 新增文件、新模块、跨层改动 |
| `docs/velora.md` | 用/加/升级 Velora 组件与区块 |
| `docs/ui.md` | 任何视觉/交互改动 |
| `docs/quality.md` | 自查、提交、发版 |
| `docs/tech-notes.md` | 碰到 Tauri/主题/多语言/i18n 的坑 |
| `docs/design.md` | 改视觉时同步更新 |
| `openspec/specs/` | 看某块能力当前必须满足什么 |
| `docs/adr/` | 想知道某个决策为什么这么做 |
| `.github/instructions/` | 改 `src/`、`src-tauri/`、`docs/` 时自动命中 |

## 完成定义（DoD）

- [ ] 验收标准逐条可演示
- [ ] 走 OpenSpec 的改动：`openspec validate --all` 通过，且已 `/opsx-archive`
- [ ] `pnpm check` 通过（贴输出）
- [ ] 涉及 Rust：`pnpm check:rust` 通过
- [ ] 涉及官网：`pnpm website:check` + `pnpm website:build` 通过
- [ ] 涉及 UI：浅色/深色、窄屏各看一眼
- [ ] 新增文案：中英两版都在
- [ ] 提交信息符合 Conventional Commits，改动范围与任务一致
