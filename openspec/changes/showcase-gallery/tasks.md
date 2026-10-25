## 1. 数据层

- [x] 1.1 新建 `src/features/showcase/catalog.ts`：定义组件分组（背景 / 文字 / 按钮 / 卡片 / 导航 / 表单 / 载入 / 滚动 / 其他）、区块类别、页面清单
- [x] 1.2 每个组件条目含 `name`、`label`、`preview?`（预览实例标记）
- [x] 1.3 重型组件（globe、world-map、macbook-scroll、hero-parallax）只列名不预览

## 2. 展示组件

- [x] 2.1 `ShowcasePage.tsx`：用 `AnimatedTabs` 承载三个标签页
- [x] 2.2 分组标题 + 条目网格，条目统一高度
- [x] 2.3 预览容器固定高度 + `overflow-hidden`，避免撑破网格
- [x] 2.4 非激活标签页不渲染预览

## 3. 页面接入

- [x] 3.1 `src/app/router.tsx` 注册 `showcase` 路由
- [x] 3.2 `src/app/navigation.ts` 侧栏加入「组件」入口（`Boxes` 图标）
- [x] 3.3 `zh-CN.json` / `en.json` 同步加入 `nav.showcase` 与 `showcase.*` 文案

## 4. 验证

- [x] 4.1 `pnpm check` 通过（typecheck + lint + test）
- [x] 4.2 中英 key 结构一致（脚本比对无差异）
- [ ] 4.3 浅色 / 深色各看一眼（待人工确认）
- [ ] 4.4 窄屏（<768px）单列不横向滚动（待人工确认）
- [ ] 4.5 键盘 Tab 可达标签栏与链接，焦点环可见（待人工确认）
- [ ] 4.6 开启减少动效后动画停止（待人工确认）
