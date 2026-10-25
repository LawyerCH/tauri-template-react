## Why

模板已积累 100 个动画组件 + 31 个成品区块，但没有任何地方能看到它们长什么样。评估模板的人只能翻源码或去上游官网，无法判断"这个模板到底能给我什么"。

需要一块可视化目录，像上游 Velora 官网的 `/components` 页面那样，按类型分组浏览。

## What Changes

在桌面应用新增「组件」页（`/#/showcase`）：

- 三个标签页：组件 / 模块 / 模板
- 组件页按功能类别分组（背景、文字、按钮、卡片、导航…），每项展示名称 + 分类 + 受控预览
- 模块页展示 31 个成品区块，标注类别
- 模板页展示桌面应用已组装好的页面，点击可跳转

纯展示，不改动共享包里的任何组件源码。

## Capabilities

### New Capabilities

- `showcase-gallery`: 桌面应用内的组件、区块与页面可视化目录，三类分组浏览

### Modified Capabilities

无。现有规格（app-shell / desktop-integration / window-state）的行为不变。

## Impact

- 新增 `src/features/showcase/`（`catalog.ts` / `previews.tsx` / `ShowcasePage.tsx`）
- 复用 `packages/velora` 的 `animated-tabs` 与按需挑选的预览组件
- `src/app/router.tsx` 注册 `showcase` 路由，`src/app/navigation.ts` 加入侧栏入口
- 两个语言包同步新增 `nav.showcase` 与 `showcase.*`
- 不改官网：官网已有自己的展示
