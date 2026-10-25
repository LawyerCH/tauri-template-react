# 目录架构

## workspace 布局

```
仓库根（桌面应用）       Tauri 2 + React 19 + Vite
├── src/               桌面端页面与组件
├── src-tauri/         Rust 侧
├── packages/velora/   共享 UI 包 @template/velora
├── website/           官网站点 @template/website（Astro）
└── scripts/           工具脚本（velora.mjs）
```

三个 workspace 项目：根目录（桌面应用）、`packages/velora`（UI 包）、`site`（官网）。

## 分层与依赖方向

```
src/
├── app/          路由、导航表、全局 Provider 装配
├── components/
│   ├── layout/   外壳（侧栏、页头），只依赖 lib
│   └── ui/       业务通用组件：Button、Section、EmptyState、RadioGroup、Toggle
├── features/     按业务域分目录：home / tasks / settings
├── lib/          基础设施：settings、i18n、theme、env
├── locales/      zh-CN.json / en.json
├── styles/       index.css（只做 @import 聚合）
└── test/         测试装配
```

依赖只能向下，不能反向：

```
app ──▶ features ──▶ components ──▶ lib
                └────────▶ lib
```

- `lib` 不依赖 `features` / `components`
- `components/ui` 不含业务逻辑，不 import `features`
- `features/A` 不 import `features/B`；要共享就上提到 `components` 或 `lib`
- **UI 组件与主题令牌一律走 `@template/velora`**，不在 `src/` 里重建一份

## 新东西放哪里

| 你要加的东西 | 位置 | 判定 |
|---|---|---|
| 新页面 | `src/features/<域>/XxxPage.tsx` + 在 `app/router.tsx` 注册 | 一个业务域一个目录 |
| 页面内组件 | 同目录 `XxxList.tsx` | 只服务当前页 |
| 跨页复用组件 | `src/components/ui/` | 被 2 处以上使用才上提 |
| 动画组件 / 成品区块 | `pnpm velora add <name>` → `packages/velora` | 见 `docs/velora.md` |
| 官网区块 | `website/src/sections/*.tsx`，页面在 `website/src/pages/*.astro` | 与桌面端共用一份组件 |
| 通用函数 | `src/lib/<主题>.ts` | 按主题建文件，不建 `utils.ts` 垃圾桶 |
| 用户偏好 | `src/lib/settings/store.ts` 加字段 | 唯一入口 |
| 文案 | `src/locales/*.json` 同名 key | 必须双语 |
| Rust 命令 | `src-tauri/src/commands/<域>.rs` | 按域拆，`lib.rs` 只做注册 |

## 命名约定

- 组件文件 `PascalCase.tsx`，导出同名具名函数（不用 default）
- 目录 `kebab-case`（`features/settings`）
- hook 用 `useXxx`，纯函数用小驼峰
- 测试与被测文件同目录：`Button.tsx` → `EmptyState.test.tsx`
- 中英 json 的 key 结构必须完全一致

## 状态放在哪

| 状态类型 | 放哪 | 例子 |
|---|---|---|
| 用户偏好、跨会话 | `settings` store（持久化） | 主题、语言 |
| 页面内交互 | 组件 `useState` | 输入框、勾选 |
| 跨页共享的临时状态 | 新建专用 store | 后台任务队列 |
| 服务端/异步数据 | 后续接 TanStack Query | 列表、详情 |

判断标准：会跨重启保留吗？会 → settings；只活一个页面 → `useState`。不要为了"以后共享"提前上全局 store。

## Rust 侧

```
src-tauri/
├── src/
│   ├── lib.rs        只做 Builder 装配与命令注册
│   ├── commands/     按域拆，一个域一个文件
│   └── ...
├── capabilities/     一个场景一个 json，最小权限
└── tauri.conf.json   窗口、打包、插件配置
```

- 新增命令：先定类型（`serde` 结构），再写实现，最后注册
- 前端调用一律经 `src/lib/ipc/`（M2 引入），组件禁止直接 `invoke`
- 新增插件必须在 `capabilities/` 单独开权限文件，不往 `default.json` 堆

## 加一个页面的标准动作

1. `src/features/<域>/XxxPage.tsx`
2. 文案加进两个 json
3. `src/app/navigation.ts` 加导航项（如需出现在侧栏）
4. `src/app/router.tsx` 注册路由
5. 一眼浅色、一眼深色、一眼窄屏

## 不要做

- 不为单个页面建 `components/` 子目录
- 不建 `utils/`、`helpers/`、`common/` 这类无主题目录
- 不建 `index.ts` 桶文件（除非确实要收敛 API）
- 不在 `ui/` 里写业务判断
