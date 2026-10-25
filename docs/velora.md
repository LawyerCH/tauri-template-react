# Velora UI 使用指南

> 组件真源是 [ColorlibHQ/velora-ui](https://github.com/ColorlibHQ/velora-ui)（MIT）。本仓库不克隆它的仓库，而是把代码拉进 workspace 共享包 `packages/velora`，桌面应用与官网 `website/` 共用同一份。

## 当前安装状态

| 项 | 上游 | 本仓库 |
|---|---|---|
| 动画组件 `registry:ui` | 100 | **100 全装** |
| shadcn 基础件 | 15 | 9（block 实际用到的） |
| 成品区块 `registry:block` | 31 | **31 全装** |
| 整站模板 | 1 套 Next.js 多页站 | 0（**不在 registry 里，无法拉取**） |

上游全部条目声明的 npm 依赖只有 `lucide-react` 与 `motion`，已安装，所以全量拉取**没有新增依赖**，源码共约 900 KB（不参与构建，Vite/Astro 只打包被 import 的部分）。

> 关于“模板”：上游的 landing page templates 是 `src/app/templates/saas/page.tsx` 这类 Next.js 页面，不属于 `registry:ui` 也不属于 `registry:block`，registry 里查不到。要用只能整仓克隆或按结构重写。

## 为什么不克隆仓库共用

| 方案 | 问题 |
|---|---|
| 克隆到 `../velora-ui` 再软链 | 上游是 Next.js 16 App Router 全站（MDX 博客、静态导出、`next-themes`），与 Tauri 的 Vite 外壳结构不兼容；两套 `tsconfig` / `eslint` / 依赖版本会互相干扰 |
| git submodule | 同上，且 CI 要额外拉取、版本对齐靠人工 |
| **pnpm workspace + 共享包（本仓库做法）** | 只搬组件代码，依赖统一升级，桌面与官网同一份，改一次两边生效 |

## 目录

```
packages/velora/
├── package.json          导出映射：/ui/* /velora/* /blocks/* /lib/utils /styles/*
├── styles/
│   ├── tokens.css        色板（浅 / 深两套 CSS 变量）
│   ├── theme.css         @theme 映射 + @keyframes + reduced-motion 兜底
│   └── velora-additions.css  脚本自动追加的 keyframes / animate 变量（勿手改）
└── src/
    ├── lib/utils.ts      cn()
    ├── ui/               shadcn 基础件（block 依赖的 9 个）
    ├── velora/           动画组件（100 个全装）
    └── blocks/           成品区块（31 个全装）
```

## 常用命令

| 命令 | 作用 |
|---|---|
| `pnpm velora list` | 列出**尚未安装**的组件与区块 |
| `pnpm velora list --all` | 列出全部 |
| `pnpm velora list --category <类别>` | 按区块类别过滤 |
| `pnpm velora add <name...>` | 拉取组件/区块，自动递归依赖、改写导入、合并 CSS |
| `pnpm velora add --all` | 全量同步（升级上游时配合 `--force`） |
| `pnpm velora add --category <类别>` | 按类别批量拉取 |
| `pnpm velora add <name> --force` | 覆盖已有文件（用于跟上游升级） |

区块类别：`hero-sections` `feature-sections` `pricing-sections` `testimonial-sections` `cta-sections` `logo-clouds` `faq-sections` `navbars` `footers` `auth-sections`。

示例：

```bash
pnpm velora add pricing-three-tiers              # 单个区块，带上它用到的所有组件
pnpm velora add --category hero-sections         # 整个类别
pnpm velora add --all --force                    # 全量覆盖成上游最新版
```

脚本做的事：

1. 从 `https://velora.colorlib.com/r/<name>.json` 拉条目；
2. block 的依赖地址递归展开，缺失的 shadcn 基础件从 `ui.shadcn.com/r/styles/new-york` 补；
3. `@/lib/utils`、`@/components/ui/*`、`@/components/velora/*` 改写成包内相对路径；
4. registry 里的 `css`（`@keyframes`）与 `cssVars.theme`（`--animate-*`）去重后追加到 `velora-additions.css`；
5. 列出缺失的 npm 依赖，等人工确认后再装。

## 在页面里使用

```tsx
import { Button } from "@template/velora/ui/button";
import { BlurFade } from "@template/velora/velora/blur-fade";
import { HeroAurora } from "@template/velora/blocks/hero-aurora";
```

桌面端（根 `src/`）与官网（`website/src/`）写法完全一样。

## 官网（Astro）

`website/` 是 Astro 静态站，用于产品展示。选择 Astro 而非 Vite SPA 的原因：SPA 首屏 HTML 是空 `div`，搜索引擎与社交平台抓不到内容；Astro 先把 React 区块预渲染成完整 HTML，滚到视口才注水。

| 关注点 | 做法 |
|---|---|
| 页面骨架 | `website/src/pages/index.astro`，纯 HTML + `.astro` 语法 |
| 内容区块 | `website/src/sections/*.tsx`（React），直接用共享包组件 |
| 直接复用成品区块 | `import { FaqAccordion } from "@template/velora/blocks/faq-accordion"` |
| 注水时机 | 首屏 `client:load`，其余 `client:visible`；纯静态内容不加指令，不送 JS |
| 样式 | `website/src/styles/global.css` 引入共享包的 `tokens.css` + `theme.css` |
| 主题 | 跟随系统，布局里的内联脚本写 `data-theme` |

新建页面的动作：`website/src/pages/<name>.astro` + 在 `sections/` 里拆 React 区块。

> block 自带英文 SaaS 演示文案。正式使用前必须改成本产品的内容（参考 `faq-accordion.tsx` 的改法）。

## 已知差异与约定

| 项 | 说明 |
|---|---|
| 只有一套按钮实现 | `src/components/ui/Button.tsx` 是对 `@template/velora/ui/button` 的**薄封装**：业务只写 `variant="primary" \| "secondary" \| "ghost" \| "danger"`，内部映射到 shadcn 的 `default/outline/ghost/ghost`，再用 className 把圆角与尺寸收回本项目风格。因此 `asChild`、`link`、`icon` 这些 shadcn 能力对业务也可用，不存在两套实现 |
| `next/link`、`next/image` | 共享包内**没有**任何组件依赖 Next.js（已全量校验）；若未来上游引入，需手工换成 `<a>` / `react-router` 的 `Link` |
| 硬编码英文文案 | block 自带演示文案。正式使用前抽到 `src/locales/*.json`，中英各一份 |
| 深色模式 | 共享包用 `[data-theme="dark"]`（`@custom-variant dark`），与上游的 `.dark` 类不同，已在 `theme.css` 处理，组件源码零改动 |
| 改组件源码 | 原则上不改；确需改（如加 i18n prop）在 `docs/tech-notes.md` 记一笔，`--force` 升级时按记录补回 |

## 与 UI/UX 技能的边界

`.agents/skills/` 里的设计技能（`ui-ux-pro-max`、`ui-styling`、`design-system`、`design` 等）会教 `npx shadcn@latest add` 与自建令牌体系，**本项目不采用**：

| 技能建议 | 本项目做法 | 原因 |
|---|---|---|
| `npx shadcn@latest add button` | `pnpm velora add <name>` | CLI 写 `src/components/ui/button.tsx`，在 macOS 上会覆盖自写 `Button.tsx`；且会改写全局 CSS |
| 自建 `design-system/` 令牌 | 用 `packages/velora/styles/tokens.css` | 设计决策只落 `docs/design.md`，避免两套令牌漂移 |
| 推荐的新色板 / 字体 | 只当候选 | 令牌是唯一色源，改动需走 `docs/ui.md` 的门禁 |

## 装完必做

```bash
pnpm install         # 有新依赖时
pnpm check           # 桌面端 typecheck + lint + test
pnpm website:check   # 官网类型检查
pnpm website:build   # 官网构建
```

## 升级上游

```bash
pnpm velora add --all --force   # 全量覆盖成上游最新版
pnpm check && pnpm website:build
```

之前对组件做过的改动（如给 `animated-sidebar` 加 i18n prop）会被覆盖，先查 `docs/tech-notes.md` 的“例外”小节并按记录补回。
