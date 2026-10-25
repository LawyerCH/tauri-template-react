# 设计说明

- 设计读法：为桌面工具类用户做模板应用外壳（侧栏导航 + 内容区 + 设置页），语气仪器感 + 暗色科技，倾向 shadcn registry（Velora UI）+ Motion 动效
- dial：VARIANCE 7 / MOTION 6 / DENSITY 6
- 技术路线：Tauri 2 + React 19 + Vite 8 + Tailwind CSS 4；组件来自 [Velora UI](https://github.com/ColorlibHQ/velora-ui) 的 shadcn registry，落在 workspace 共享包 `packages/velora`，不二次改造源码
- 强调色：品牌斜坡 `--brand-from → --brand-via → --brand-to`（oklch 蓝 → 青，浅色 `0.546/0.245/263` 起，深色 `0.623/0.214/260` 起）；语义色只保留 `--destructive`
- 圆角策略：`--radius: 0.625rem` 统一派生（卡片 `rounded-2xl`、控件 `rounded-lg`、胶囊 `rounded-full`）

## 关键决策

- 为什么这样布局：桌面应用窗口固定，左侧常驻图标栏 + 内容单列最省横向空间；图标栏默认收起、悬停或锁定后展开，兼顾窄窗与长时间使用。窄容器（< 42rem）自动降级为顶栏 + 抽屉，直接复用 Velora 的 `Sidebar` 行为，不自己写一套响应式。
- 为什么这样排信息层级：概览页先给"这是什么"（徽章 + 渐变标题 + 一句话），再给"怎么跑起来"（终端实录 + 运行信息），最后给"已经接了什么"（能力卡）与"用了什么技术"（marquee）。设置页项目少，直接按"外观 / 语言 / 系统集成 / 关于"四张卡片纵向排开，不做标签分组，也不加页面级说明文字。
- 为什么主题走 `[data-theme]` 而不是 Velora 默认的 `.dark`：桌面端只有一个主题来源（`src/lib/settings/store.ts`），官网则跟随 `prefers-color-scheme`；共享包用 `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))` 把 Velora 组件的 `dark:` 前缀接到同一个属性上，组件源码零改动。
- 为什么把 UI 抽成 workspace 包：桌面应用与官网站点要共用同一套组件，否则两边会逐渐漂移。上游 velora-ui 是 Next.js 16 全站，直接克隆会让仓库背上两套构建链；只取组件代码到 `packages/velora` 既保留了“跟着上游升级”的能力，又不引入 Next.js。
- 为什么官网用 Astro 而不是 Next.js：官网需要被搜索引擎抓到，又不想背上第二套构建链。Astro 底层仍是 Vite，把 React 区块预先渲染成 HTML、滚到视口才注水，于是既能整块复用 Velora 区块，又有完整的首屏内容。实测首屏 HTML 从 545 字节（空 `div`）变为 53 KB、含 1463 字符可抓取文本。代价是页面骨架用 `.astro`，组件仍需写成 React。
- 放弃了哪些方案：
  - 只换视觉皮不动结构：Velora 的价值一半在交互（hover 放大图标栏、标签胶囊滑动、卡片聚光），只换色等于没用上。
  - 直接跑 Next.js 模板站：`velora-ui` 的完整模板是落地页（hero 视差、定价、博客），与桌面工具的信息结构不匹配。
  - 克隆 velora-ui 到仓库旁边共用：两套 `tsconfig` / `eslint` / 依赖版本会互相干扰，且 CI 要额外拉取。
  - 引入 shadcn CLI 安装：CLI 需要交互确认、会改写 `globals.css`，且写入的 `ui/button.tsx` 在 macOS 大小写不敏感的文件系统上会覆盖自写的 `Button.tsx`。
  - 保留旧"公文风"2px 直角 + 公文红：与 Velora 的圆角、渐变、动效语言冲突，已按用户授权整体替换。

## 状态覆盖

- 空状态：任务页用点阵背景 + "怎么产生第一条数据"的说明，不留一片空白。
- 加载态：`NumberTicker`、`BlurFade`、`Terminal` 自带入场节奏；所有动画都尊重 `prefers-reduced-motion`（Velora 组件内置，另有全局 `@media` 兜底）。
- 错误态：通知与开机自启失败时在对应行内联提示（`role="status"`），不使用 `alert()`；通知结果用品牌色、失败用 `--destructive`。
- 不可用态：浏览器开发模式下系统集成区置灰并说明"仅桌面端可用"。

## 可访问性

- 焦点态：全局 `:focus-visible` 2px 品牌色描边；Velora 组件自带 `focus-visible:ring`。
- 对比度：深色下主按钮文字改用近黑（白字 3.6:1 不达标，近黑 5.3:1）；正文 `--muted-foreground` 深浅两套均 ≥ 4.5:1。
- 键盘：图标栏聚焦即展开；标签页遵循 WAI-ARIA tabs（方向键 / Home / End）；抽屉用原生 `<dialog>`。

## 截图

- 浅色概览：[home-light.png](./shots/home-light.png)
- 深色概览：[home-dark.png](./shots/home-dark.png)
- 深色设置：[settings-dark.png](./shots/settings-dark.png)
- 深色任务列表：[tasks-dark.png](./shots/tasks-dark.png)
- 窄屏（430px，顶栏 + 抽屉）：[home-narrow.png](./shots/home-narrow.png)
