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
| `pnpm vitest run -t "名字"` | 只跑某个测试 |

## 工作流（六步）

理解 → 定规格（`specs/NNNN-*.md`，验收可执行）→ 按层拆（类型 → 逻辑 → UI → 测试）→ 实现 → 验证 → 交付。

- 每步退出条件不满足，不进入下一步
- 细则见 `docs/workflow.md`
- 意图不明先归类再问，不猜

## 任务路由

| 用户意图 | 典型说法 | 先读 | 技能 |
|---|---|---|---|
| 新功能 / 新页面 | "加个 xx 功能" | `docs/workflow.md` | `intent-spec` |
| 改界面 / 调样式 | "这里不好看""换个配色" | `docs/ui.md` | `ui-gate` |
| 目录 / 模块架构 | "重构一下目录""加个模块" | `docs/architecture.md` | `project-structure` |
| 用 Velora 组件 | "加个 hero""要个 pricing 区" | `docs/velora.md` | — |
| 修 bug / 报错 | "报错了""不生效" | `docs/workflow.md` §修复 | 全局 `systematic-debugging` |
| 质量审查 | "审查一下""有没有问题" | `docs/quality.md` | `quality-review` |
| 提交 / 发版 | "提交""打包发布" | `docs/quality.md` §交付与发布 | `release-check` |
| 清理磁盘 | "空间不够""清理缓存" | 全局清理技能 | `cleanup-disk` |
| 纯问答 | "这是啥""怎么用" | 直接回答 | 不改文件 |

一句话咨询不要启动六步流程；但只要你开始改代码，就必须回到对应流程。

## 三条最容易踩的坑

| 坑 | 现象 | 正确做法 |
|---|---|---|
| **CLAUDE.md 写成软链** | 编辑 `CLAUDE.md` 时实际改的是 `AGENTS.md`，把规范覆盖成一行 `@AGENTS.md`，两个文件都变成自引用 | `CLAUDE.md` 是**普通文件**，内容只有一行 `@AGENTS.md`；规范只写在 `AGENTS.md` |
| **两套按钮** | 不知道用哪个 `Button` | 业务用 `src/components/ui/Button.tsx`（已封装 shadcn 版）；区块内部用 `@template/velora/ui/button` |
| **区块自带的英文文案** | 页面上出现 "How does the 14-day free trial work" | 拉取 block 后先把它顶部的 const 文案换成本产品内容 |

## 边界

**总是**：改前先读文件；复用已有组件与工具；小步提交（Conventional Commits）；Rust 改动后跑 `check:rust`；改 UI 后跑 `website:build`。

**先问**：引入新依赖或 Tauri 插件；改目录分层或公共组件 API；需求里缺"失败时怎么办"。

**绝不**：提交 `.env`/密钥/`src-tauri/target`；`git push --force` 或直推 `main`；用 `alert()` 报错、用 emoji 当图标；为"以后可能用到"提前抽象；修改 `packages/velora/src/` 里的 registry 源码（加 prop 属例外，见 `docs/tech-notes.md`）。

## 上下文地图

按需读，不要一次全读（避免上下文过载）。

| 文件 | 什么时候读 |
|---|---|
| `docs/workflow.md` | 任何非琐碎改动开始前 |
| `docs/architecture.md` | 新增文件、新模块、跨层改动 |
| `docs/velora.md` | 用/加/升级 Velora 组件与区块 |
| `docs/ui.md` | 任何视觉/交互改动 |
| `docs/quality.md` | 自查、提交、发版 |
| `docs/tech-notes.md` | 碰到 Tauri/主题/多语言/i18n 的坑 |
| `docs/design.md` | 改视觉时同步更新 |
| `specs/` | 当前任务对应的规格 |
| `.github/instructions/` | 改 `src/`、`src-tauri/`、`docs/` 时自动命中 |

## 完成定义（DoD）

- [ ] 验收标准逐条可演示
- [ ] `pnpm check` 通过（贴输出）
- [ ] 涉及 Rust：`pnpm check:rust` 通过
- [ ] 涉及官网：`pnpm website:check` + `pnpm website:build` 通过
- [ ] 涉及 UI：浅色/深色、窄屏各看一眼
- [ ] 新增文案：中英两版都在
- [ ] 提交信息符合 Conventional Commits，改动范围与任务一致
