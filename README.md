# Tauri Template

可直接开工的桌面应用模板：Tauri 2 + React 19 + Vite 8 + Tailwind CSS 4，内置多语言、深浅色主题、统一设置存储与一键校验。

## 快速开始

```bash
pnpm install
pnpm tauri dev     # 桌面应用
pnpm dev           # 只跑前端，浏览器调试
pnpm website:dev  # 官网站点（localhost:1421）
```

## 仓库结构

```
仓库根         桌面应用（Tauri + Vite）
packages/velora  共享 UI 包 @template/velora（令牌 + 组件 + 区块）
website/         官网站点 @template/website（Astro，静态预渲染）
scripts/         velora.mjs 组件拉取脚本
```

桌面应用与官网共用一份 UI 组件；新增组件用 `pnpm velora add <name>`，细则见 [`docs/velora.md`](./docs/velora.md)。

## 命令

| 命令 | 作用 |
|---|---|
| `pnpm check` | typecheck + lint + test，提交前必须全绿 |
| `pnpm check:rust` | Rust 侧 fmt + clippy 门禁 |
| `pnpm website:build` | 官网构建（Astro 静态输出） |
| `pnpm website:check` | 官网类型检查 |
| `pnpm velora list` | 看还没装哪些 Velora 组件 |
| `pnpm velora add <name>` | 拉取组件或区块 |
| `pnpm build` | 类型检查 + 前端构建 |
| `pnpm tauri build` | 打包安装包 |
| `pnpm format` | Prettier 格式化 |

## 已具备

- 路由外壳：概览 / 任务 / 设置，侧栏窄屏自动折叠
- 多语言：中英双语，`src/locales/*.json`
- 主题：浅色 / 深色 / 跟随系统，`data-theme` + CSS 变量
- 设置：单一 store、带版本号，localStorage 持久化（迁移至本地文件为规划项）
- 工具链：TS strict、ESLint、Prettier、Vitest、路径别名 `@/`
- 桌面能力：托盘菜单（中英同步）、关闭到托盘、单实例、系统通知、开机自启
- 桌面能力（部分）：窗口位置记忆（插件已注册，capability 已放行）、日志落盘（插件已注册，capability 已放行）
- IPC：Rust 命令收敛到 `src/lib/ipc/`（当前仅 `setLocale`）

## 规划

自动更新与签名发布、后台任务引擎与进度推送、设置迁移到本地文件、Tasks 持久化。详见 `AGENTS.md`。

## 文档

面向 AI 协作的结构：

| 路径 | 内容 |
|---|---|
| `AGENTS.md` | 唯一入口：铁律、命令、六步工作流、任务路由、边界 |
| `CLAUDE.md` | 软链到 `AGENTS.md`，避免多份漂移 |
| `.agents/skills/` | 五个项目技能：意图→规格、目录架构、UI 门禁、质量审查、交付门禁 |
| `.trae/mcp.json` | 项目级 MCP（默认只开 context7） |
| `docs/workflow.md` | 六阶段流程与退出条件 |
| `docs/architecture.md` | 分层、依赖方向、落位决策 |
| `docs/ui.md` | 设计三道门、令牌、18 条自检 |
| `docs/quality.md` | 审查五轴、提交与发版规范 |
| `docs/tech-notes.md` | 踩过的坑与做法 |
| `docs/design.md` | 当前视觉决策与截图 |
| `docs/adr/` | 架构决策记录 |
| `openspec/specs/` | 能力累积态：系统当前必须满足什么 |
| `openspec/changes/` | 进行中的变更（proposal / specs / design / tasks） |

用法：让 AI 直接读 `AGENTS.md`，按任务路由表进入对应技能；一句话咨询不会启动完整流程。

