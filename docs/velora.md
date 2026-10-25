# Velora UI 使用指南

> 组件真源是 [ColorlibHQ/velora-ui](https://github.com/ColorlibHQ/velora-ui)（MIT）。本仓库不克隆它的仓库，而是把代码拉进 workspace 共享包 `packages/velora`，桌面应用与官网 `site/` 共用同一份。

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
    ├── ui/               shadcn 基础件（button/badge/input/label/accordion/avatar/tabs/sheet/dropdown-menu）
    ├── velora/           动画组件（100 个里按需拉）
    └── blocks/           成品区块（31 个里按需拉）
```

## 常用命令

| 命令 | 作用 |
|---|---|
| `pnpm velora list` | 列出**尚未安装**的组件与区块 |
| `pnpm velora list --all` | 列出全部 |
| `pnpm velora add <name...>` | 拉取组件/区块，自动递归依赖、改写导入、合并 CSS |
| `pnpm velora add <name> --force` | 覆盖已有文件（用于跟上游升级） |

示例：

```bash
pnpm velora add pricing-three-tiers      # 区块，自动带上它用到的所有组件
pnpm velora add marquee terminal         # 多个一起
pnpm velora add hero-globe --force       # 覆盖成上游最新版
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

桌面端（根 `src/`）与官网（`site/src/`）写法完全一样。

## 官网（Astro）

`site/` 是 Astro 静态站，用于产品展示。选择 Astro 而非 Vite SPA 的原因：SPA 首屏 HTML 是空 `div`，搜索引擎与社交平台抓不到内容；Astro 先把 React 区块预渲染成完整 HTML，滚到视口才注水。

| 关注点 | 做法 |
|---|---|
| 页面骨架 | `site/src/pages/index.astro`，纯 HTML + `.astro` 语法 |
| 内容区块 | `site/src/sections/*.tsx`（React），直接用共享包组件 |
| 直接复用成品区块 | `import { FaqAccordion } from "@template/velora/blocks/faq-accordion"` |
| 注水时机 | 首屏 `client:load`，其余 `client:visible`；纯静态内容不加指令，不送 JS |
| 样式 | `site/src/styles/global.css` 引入共享包的 `tokens.css` + `theme.css` |
| 主题 | 跟随系统，布局里的内联脚本写 `data-theme` |

新建页面的动作：`site/src/pages/<name>.astro` + 在 `sections/` 里拆 React 区块。

> block 自带英文 SaaS 演示文案。正式使用前必须改成本产品的内容（参考 `faq-accordion.tsx` 的改法）。

## 已知差异与约定

| 项 | 说明 |
|---|---|
| 只有一套按钮实现 | `src/components/ui/Button.tsx` 是对 `@template/velora/ui/button` 的**薄封装**：业务只写 `variant="primary" \| "secondary" \| "ghost" \| "danger"`，内部映射到 shadcn 的 `default/outline/ghost/ghost`，再用 className 把圆角与尺寸收回本项目风格。因此 `asChild`、`link`、`icon` 这些 shadcn 能力对业务也可用，不存在两套实现 |
| `next/link`、`next/image` | 组件里不会出现；出现则说明该 block 依赖 Next.js，需手工换成 `<a>` / `react-router` 的 `Link` |
| 硬编码英文文案 | block 自带演示文案。正式使用前抽到 `src/locales/*.json`，中英各一份 |
| 深色模式 | 共享包用 `[data-theme="dark"]`（`@custom-variant dark`），与上游的 `.dark` 类不同，已在 `theme.css` 处理，组件源码零改动 |
| 改组件源码 | 原则上不改；确需改（如加 i18n prop）在 `docs/tech-notes.md` 记一笔，`--force` 升级时按记录补回 |

## 装完必做

```bash
pnpm install      # 有新依赖时
pnpm check        # 桌面端 typecheck + lint + test
pnpm website:build   # 官网构建
```
