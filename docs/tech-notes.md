# 技术笔记

只记"踩过且会再踩"的坑。新增条目格式：现象 → 原因 → 做法。

## 文档与规范

**CLAUDE.md 不要做成软链**
现象：编辑 `CLAUDE.md` 时实际改的是 `AGENTS.md`，写入一行 `@AGENTS.md` 后两个文件都变成自引用，项目规范全丢。
原因：软链与目标文件是同一份内容，无法做"只写一行引用"。
做法：`CLAUDE.md` 是**普通文件**，内容只有 `@AGENTS.md`；规范正文只维护在 `AGENTS.md`。发现 `AGENTS.md` 行数骤减，用 `git show <上一个好提交>:AGENTS.md` 找回。

**新增目录后 ESLint 扫到生成物**
现象：`pnpm lint` 报 `site/.astro/types.d.ts` 里的 triple-slash 错误。
原因：ESLint 默认忽略规则不含 Astro 的生成目录。
做法：`eslint.config.js` 的 `ignores` 加 `**/.astro` 与 `**/dist`。

**拉了带 `@next/next` 注释的上游组件，lint 报「Definition for rule not found」**
现象：`registry` 组件里有 `eslint-disable @next/next/no-img-element`，本项目没装该插件。
原因：上游是 Next.js 项目，本项目是 Vite/Astro。
做法：在 `eslint.config.js` 针对 `packages/velora/src/**` 注册空的 `@next/next` 插件并把 `reportUnusedDisableDirectives` 设为 `off`；不要去改组件源码删注释。

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
做法：用 `@theme inline` 指向 `var(--*)` 语义变量，真实值放在 `tokens.css` 的 `:root` / `[data-theme="dark"]`。

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

## 桌面端（已在 `src-tauri/src/lib.rs` 实现）

**托盘文案只更新一次**
现象：中 → 英 → 中 来回切，托盘文案卡在第一次切换后的语言。
原因：用 `OnceLock` 存当前语言，`set` 只生效一次，后续调用被静默忽略。
做法：改用 `Mutex<&'static str>`，每次写入后再重建菜单。

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

## Velora UI（shadcn registry）

**组件装不上 / CLI 卡在交互提问**
现象：`npx shadcn@latest add ...` 会追问覆盖与配置路径，非交互环境直接挂住。
原因：CLI 面向人类交互，且会改写 `globals.css`。
做法：直接拉 `https://velora.colorlib.com/r/<name>.json`，把 `files[].content` 原样写进 `files[].path`（本仓库为 `src/components/velora/`），再手动登记 `dependencies`。全部组件只依赖 `@/lib/utils` 与 `motion`。

**深色模式对 Velora 组件不生效**
现象：切到深色，组件仍是浅色。
原因：Velora 用 `.dark` 类 + `dark:` 前缀，本项目用 `[data-theme="dark"]`。
做法：在 `src/styles/index.css` 声明 `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));`，组件源码零改动。

**组件颜色全是透明 / 默认蓝**
现象：装进来只有骨架，没有品牌色。
原因：Velora 读 shadcn 语义变量（`--background` `--primary` `--brand-*`），项目没定义。
做法：`tokens.css` 提供完整变量，`index.css` 用 `@theme inline` 映射成 `bg-card` / `text-muted-foreground` 等类；品牌斜坡是 `--brand-from/via/to` 三个变量。

**`cn` 覆盖不生效**
现象：传入的 `className` 压不住组件默认类（如 `rounded-2xl`）。
原因：只用 `clsx` 拼接，同属性类同时存在，后加载的样式说了算。
做法：`src/lib/utils.ts` 用 `clsx` + `tailwind-merge`，这是 shadcn 的约定入口。

**升级组件**
做法：重跑 registry 拉取覆盖 `src/components/velora/`；本仓库只允许修编译错误（如 `noUncheckedIndexedAccess` 下的数组下标），修完在这一节记一笔。

**例外：需要双语的硬编码文案**
现象：`animated-sidebar.tsx` 里 `Keep expanded` / `Open navigation` / `Close navigation` 是英文硬编码，页面无法覆盖。
做法：给组件加可选字符串 prop（`pinLabel` / `openLabel` / `closeLabel`），默认值保持原英文，由 `AppShell` 传 `t()` 进来的译文。新增 prop 属于"加接口"，不改默认行为，registry 升级时按同样方式补回即可。
