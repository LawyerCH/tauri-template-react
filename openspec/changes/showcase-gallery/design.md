## Context

官网当前只有一页（`website/src/pages/index.astro`），内容由 5 个 React 区块组成。共享包 `packages/velora` 里已有 100 个动画组件与 31 个区块，但官网只用了其中 10 个左右。

Astro 对 React 组件做 SSR 预渲染，滚到视口才注水（`client:visible`）。展示页需要同时呈现几十个组件的预览，若全部注水，首屏 JS 会失控。

## Goals / Non-Goals

**Goals:**

- 一个页面内用标签页切换「组件 / 模块 / 模板」三类
- 每类里按功能分组，便于扫读
- 每个条目给出：名称、分类、缩略预览
- 首屏 HTML 含全部标题与分类文本（SEO 与无 JS 可读）
- 预览动效尊重 `prefers-reduced-motion`

**Non-Goals:**

- 不做单个组件的详情页（不复制上游的 `/components/[slug]`）
- 不做在线改 props 的 playground
- 不做搜索与筛选
- 不引入新的 npm 依赖
- 不改共享包内任何组件源码

## Decisions

### 分组数据用静态常量，不扫文件系统

组件清单写在 `website/src/sections/showcase/catalog.ts`，按功能分组手写。

放弃的方案：构建时读 `packages/velora/src/velora/*.tsx` 自动生成清单。原因：文件名无法反映功能类别，且自动扫描会把未验证的组件也列上去，展示页需要"精选且确认能用"的物品。

### 预览用轻量实例，不是每个组件都上真身

每个条目渲染一个真实组件实例，但参数取最小可用值（如 `Marquee` 只给两三个标签）。重型组件（`globe`、`world-map`、`macbook-scroll`）不做预览，只列名称与分类。

放弃的方案：全部上真身。原因：`globe` 一类组件自带 canvas 与数百行逻辑，放进网格会让页面卡死。

### 标签页复用共享包的 `animated-tabs`

不新写标签页组件。`AnimatedTabs` 已有 WAI-ARIA tabs 语义、方向键支持与 `prefers-reduced-motion` 处理。

### 注水策略

- 标签栏与首屏可见的分组：`client:load`
- 其余标签页内容：`client:visible`
- 纯文本条目（无预览的组件名）：不加指令，零 JS

## Risks / Trade-offs

- **风险**：预览组件多，JS 体积上升。缓解：只在当前激活的标签页挂载预览，非激活页不渲染。
- **风险**：某些组件在窄屏溢出。缓解：每个预览容器固定高度 + `overflow-hidden`，条目本身不撑破网格。
- **取舍**：不做详情页意味着看不到完整 props 表。可接受——完整信息在上游官网，本页只解决"有没有、叫什么、长什么样"。
