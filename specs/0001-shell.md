# 0001 应用外壳与工程底座

- 状态：已完成
- 日期：2026-10-22
- 涉及层：前端 / 工程配置

> 回溯记录。用来示范规格该写到什么颗粒度，不是待办。

## 背景与用户故事

作为用 AI 开发桌面应用的人，我希望项目一开始就有可运行的外壳、主题、多语言与统一设置，
以便不用每个新项目都重搭一遍底座。

## 验收标准

- [x] `pnpm dev` 可打开概览 / 任务 / 设置三个页面，侧栏当前项高亮
- [x] 主题切浅色 / 深色 / 跟随系统，刷新后保持
- [x] 语言切中文 / 英文，导航、标题、表单文案全部跟随，刷新后保持
- [x] 任务页可新增、勾选、删除；无数据时显示空状态与创建说明
- [x] 窗口宽度 < 768px 时侧栏折叠为图标列
- [x] `pnpm check` 与 `pnpm build` 通过
- [x] 非法设置值不会让页面崩溃，回落到默认

## 非目标

- 不做托盘、通知、自动更新（M2）
- 不做任务持久化（示例页只演示交互模式）
- 不做 Web 端同构

## 方案

- 路由用 HashRouter：桌面端自定义协议下 history 路由刷新会 404
- 主题用单一 `data-theme` 属性 + CSS 变量，`@theme inline` 保证运行时切换生效
- 设置用 zustand persist，带 `version` 与 `merge` 校验，避免旧数据污染

## 涉及改动

| 层 | 文件 | 动作 |
|---|---|---|
| 工程 | `mise.toml`、`package.json`、`eslint.config.js`、`vitest.config.ts` | 新增 |
| 样式 | `src/styles/tokens.css`、`src/styles/index.css` | 新增 |
| 骨架 | `src/app/*`、`src/components/layout/AppShell.tsx` | 新增 |
| 页面 | `src/features/home|tasks|settings/*` | 新增 |
| 基础 | `src/lib/settings/store.ts`、`src/lib/theme.ts`、`src/lib/i18n.ts` | 新增 |

## 风险与回滚

- 风险：主题与语言状态分散会导致刷新丢状态。已用单一 store 收口。
- 回滚：外壳为独立新增文件，删除 `features/` 即可回到空白模板。
