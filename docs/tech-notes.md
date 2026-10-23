# 技术笔记

只记"踩过且会再踩"的坑。新增条目格式：现象 → 原因 → 做法。

## 工具链

**TS 6 报 `baseUrl` 已废弃**
现象：`tsc` 报 TS5101，构建失败。
原因：TypeScript 6 起 `baseUrl` 停止支持，7.0 移除。
做法：删掉 `baseUrl`，只保留 `paths: { "@/*": ["./src/*"] }`，paths 相对 tsconfig 解析。

**ESLint 10 报 `"plugins" key defined as an array of strings`**
现象：flat config 下 lint 直接崩。
原因：`eslint-plugin-react-hooks` 暴露了旧格式配置。
做法：用 `reactHooks.configs.flat["recommended-latest"]`，不要 `configs["recommended-latest"]`。

**Tailwind 4 主题变量在切换时不生效**
现象：改了 `data-theme`，颜色不变。
原因：`@theme` 会把变量值固化成字面量，运行时切换拿不到新值。
做法：用 `@theme inline` 指向 `var(--c-*)`，真实值放在 `tokens.css` 的 `:root` / `[data-theme="dark"]`。

## 前端

**路由在 Tauri 里刷新后 404**
现象：`pnpm dev` 正常，打包后切页再刷新白屏。
原因：桌面端从自定义协议加载，history 路由无法回落到 `index.html`。
做法：用 `createHashRouter`，地址形如 `#/settings`。

**主题闪白**
现象：深色用户启动瞬间白屏一闪。
原因：React 挂载后才应用主题。
做法：`main.tsx` 里在 `createRoot` 之前调用一次 `applyTheme(readSettings().theme)`。

**设置被旧数据污染**
现象：改了设置结构后，老用户读到非法值导致页面异常。
原因：`persist` 直接合并了 localStorage 里的旧对象。
做法：`version` + `merge` 里逐字段校验，非法值回落到默认；结构变更时升 version 并写 `migrate`。

**测试里 Tauri API 不存在**
现象：vitest 报 `window.__TAURI_INTERNALS__` 相关错误。
原因：jsdom 没有 Tauri 运行时。
做法：业务代码用 `isTauri()` 分支；测试只测不依赖 IPC 的纯逻辑与组件。

## 桌面端（M2 起适用）

**Rust 侧文案忘了多语言**
现象：托盘菜单、原生通知永远是中文。
原因：i18n 只做了前端。
做法：`locales/*.json` 作为唯一源，Rust 用 `include_str!` 读同一份；语言切换时重建托盘菜单。

**关闭窗口 = 退出**
现象：macOS 点红叉直接退出，托盘也没了。
原因：默认 `CloseRequested` 会销毁窗口。
做法：拦截 `CloseRequested` → `prevent_close()` + `hide()`；macOS 另接 `RunEvent::Reopen` 重新显示。

**托盘图标在深色菜单栏看不见**
现象：深色菜单栏下图标发黑。
原因：用了彩色位图。
做法：macOS 用 template image（`icon_as_template(true)`），系统会自动反色。

**auto-updater 不起作用**
现象：能检查到新版本，下载/安装失败。
原因：包未签名或 macOS 未公证，Gatekeeper 拦截。
做法：第一次发版前就把签名密钥与公证流程配好，别留到最后补。

**新插件一加就报权限错误**
现象：调用插件 API 报 not allowed。
原因：`capabilities/` 没放行。
做法：一个场景一个 capability 文件，只加该插件该命令的权限，不整体放开。
