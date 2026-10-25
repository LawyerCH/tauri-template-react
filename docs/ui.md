# UI 规范

任何视觉改动（页面、组件、样式、图表、图标排布）都走三道门，缺一道算没做完。

## 门 1：声明设计读法

动手写样式前，先输出一行：

> 设计读法：为 `<谁>` 做 `<什么界面>`，语气 `<克制 / 活泼 / 编辑感 / 仪器感>`，倾向 `<技术路线>`。
> dial：VARIANCE `x` / MOTION `x` / DENSITY `x`

| 场景 | VARIANCE | MOTION | DENSITY |
|---|---|---|---|
| 内部工具 / 数据台 | 2–4 | 1–3 | 6–8 |
| 桌面应用外壳 | 3–6 | 3–6 | 5–6 |
| 营销 / 引导页 | 7–9 | 5–8 | 3–5 |
| 阅读优先 | 3–5 | 1–3 | 2–4 |

没声明就写 CSS，视为返工。

## 门 2：加载设计方法

优先用全局技能：`design-taste-frontend` → `ui-ux-pro-max` → `frontend-design`。
组件取自 Velora UI 的 shadcn registry，项目已有令牌与组件时，以本文件为准，技能只补方法，不覆盖令牌。

## 门 3：交付前逐条自检

见文末清单，回复里逐条写 PASS / FAIL，不许只写"已检查"。任一 FAIL 修完再交付。

## 令牌（唯一色源）

值定义在 `src/styles/tokens.css`（`:root` / `[data-theme="dark"]`），通过 `src/styles/index.css` 的 `@theme inline` 映射成 Tailwind 语义类。品牌斜坡是三个变量一起用，不要单独取其中一段。

| 角色 | 浅色 | 深色 | Tailwind |
|---|---|---|---|
| 页面底 | `oklch(0.995 0 0)` | `oklch(0.145 0 0)` | `bg-background` |
| 正文 | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | `text-foreground` |
| 面板 | `oklch(1 0 0)` | `oklch(0.205 0 0)` | `bg-card` |
| 次级文字 | `oklch(0.552 0 0)` | `oklch(0.708 0 0)` | `text-muted-foreground` |
| 弱底 | `oklch(0.968 0 0)` | `oklch(0.269 0 0)` | `bg-muted` |
| 分隔线 | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | `border-border` |
| 主操作 | `oklch(0.546 0.245 263)` | `oklch(0.623 0.214 260)` | `bg-primary` |
| 品牌斜坡 | `0.546 / 0.623 / 0.685` | `0.623 / 0.707 / 0.746` | `from-brand-from via-brand-via to-brand-to` |
| 失败 | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` | `text-destructive` |

规则：

- 只有三组颜色：中性灰阶、品牌斜坡（蓝→青）、失败红。状态不靠颜色单独承载，配文字标签。
- 品牌斜坡只能出现在四处：hero 背景光晕、渐变标题、边框光束 / 卡片聚光、主按钮。正文、表格、图表填充不得用渐变。
- 渐变文字只能用于 ≥ 28px 的标题；正文一律 `text-foreground` / `text-muted-foreground`。
- 圆角由 `--radius: 0.625rem` 派生：卡片 `rounded-2xl`、控件 `rounded-lg`、胶囊 `rounded-full`，不手写任意值。
- 层级优先用 1px 线与留白表达；阴影只允许出现在浮层（dialog、下拉、终端窗口），卡片不加投影。
- 光晕 / 动效容器必须 `relative isolate` 且子内容 `relative`，确保不遮挡文字与焦点环。
- 主题只由 `[data-theme]` 驱动（`@custom-variant dark`），不额外加 `.dark` 类。
- 数字与版本号用 `font-mono tabular-nums`（或 `.tabular`）。

## 组件规则

- 页面优先复用 `src/components/ui/`（项目自有）与 `src/components/velora/`（registry 原样落地），不在页面里手搓同类。
- **不要改 `src/components/velora/` 下的源码**：升级靠重新拉 registry。需要变体就在 `ui/` 里包一层。
- 新增 Velora 组件走 registry JSON（见 `docs/tech-notes.md`），不跑交互式 CLI。
- 按钮文案单行不换行（`whitespace-nowrap`）；同一意图全站一个措辞。
- 所有交互元素键盘可达，焦点环可见；禁止 `outline: none` 无替代。
- 动画必须尊重 `prefers-reduced-motion`；自动循环内容（marquee、flip words）需可暂停或聚焦即停。
- 加载态用与最终布局同尺寸的骨架，不用转圈图标糊弄。
- 错误内联展示在出错位置，禁止 `alert()`。
- 空状态必须说明"怎么产生第一条数据"。

## 18 条自检

| # | 检查项 | 判定 |
|---|---|---|
| 1 | 设计读法 + dial | 已声明 |
| 2 | 字号层级 | ≥ 3 级，不靠加粗硬撑 |
| 3 | 字重 | 只用 400 / 500 |
| 4 | 行宽 | 正文 ≤ 72ch |
| 5 | 数字排版 | 等宽 + 右对齐 |
| 6 | 强调色 | 全站 1 组品牌斜坡 + 1 个失败色 |
| 7 | 对比度 | 正文 ≥ 4.5:1，大字号 ≥ 3:1 |
| 8 | 圆角一致 | 由 `--radius` 派生，不手写 |
| 9 | 渐变收敛 | 只在 hero / 标题 / 光束 / 主按钮 |
| 10 | 表格 | 表头吸顶、行高一致、hover 反馈 |
| 11 | 空状态 | 有，且说明产生方式 |
| 12 | 加载态 | 骨架尺寸与终态一致 |
| 13 | 错误态 | 内联展示 |
| 14 | 焦点态 | 键盘可达、环可见 |
| 15 | 双主题 | 浅/深都实际看过 |
| 16 | 响应式 | < 768px 单栏/折叠 |
| 17 | 文案 | 按钮单行、措辞统一 |
| 18 | `docs/design.md` | 已更新，截图归档 |

## 禁止项

- 未声明读法就写样式
- 渐变 / 光晕盖住正文或输入框
- 三等分等宽卡片堆一行
- emoji 当图标
- 纯黑 `#000` / 纯白 `#fff` 大面积铺底
- 数据台里用营销大字、超大标题
- 只做浅色不做深色
- 改动 `src/components/velora/` 源码（修 bug 除外，且需在 tech-notes 记一笔）
