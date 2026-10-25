## Why

模板已积累 100 个动画组件 + 31 个成品区块，但没有任何地方能看到它们长什么样。评估模板的人只能翻源码或去上游官网，无法判断"这个模板到底能给我什么"。

需要一块可视化目录，像上游 Velora 官网的 `/components` 页面那样，按类型分组浏览。

## What Changes

在官网站点新增 `/showcase` 页面：

- 三个标签页：组件 / 模块 / 模板
- 组件页按功能类别分组（背景、文字、按钮、卡片、导航…），每项展示名称 + 分类 + 受控预览
- 模块页展示 31 个成品区块，标注类别
- 模板页展示当前可用的页面组合（官网自身 + 桌面端页面）

纯展示，不改动共享包里的任何组件源码。

## Capabilities

### New Capabilities

- `showcase-gallery`: 官网站点上的组件与区块可视化目录，三类分组浏览

### Modified Capabilities

无。现有规格（app-shell / desktop-integration / window-state）的行为不变。

## Impact

- 新增 `website/src/pages/showcase.astro` 与 `website/src/sections/showcase/*`
- 复用 `packages/velora` 的 `animated-tabs` 与按需挑选的预览组件
- 需在 `website/src/pages/index.astro` 加一个入口链接
- 不影响桌面端
