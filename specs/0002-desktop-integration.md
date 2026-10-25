# 0002 桌面系统集成（托盘 / 通知 / 单实例）

- 状态：已完成（部分行为待人工点验）
- 日期：2026-10-22
- 涉及层：前端 / Rust / 权限 / 打包

## 背景与用户故事

作为桌面应用用户，我希望关掉窗口后应用仍在后台待命、能收到系统通知、开机自动启动，
并且重复点击图标不会开出第二个实例。作为开发者，我希望这些能力在模板里就是接好的。

## 验收标准

- [ ] 点窗口关闭按钮：窗口隐藏，应用仍在托盘运行；再点托盘图标恢复窗口（待人工点验）
- [x] 应用已在运行时再次启动：不产生新实例，唤回已有窗口
- [ ] 托盘菜单含「显示主窗口 / 设置 / 退出」，语言跟随设置中英切换（菜单已创建，切语言待人工点验）
- [ ] 托盘菜单「设置」能打开主窗口并跳到设置页（待人工点验）
- [ ] 重启应用后窗口位置与尺寸恢复（插件已装，待人工点验）
- [ ] 设置页可开关「桌面通知」，点「发送测试通知」出现系统通知；被拒绝时内联提示原因（待打包后点验）
- [ ] 设置页可开关「开机自启」，失败时回滚开关并内联提示（待人工点验）
- [x] 日志写入应用日志目录
- [x] 浏览器开发模式下，桌面能力显示为不可用而不是报错
- [x] `pnpm check` 与 `pnpm check:rust` 通过（含 2 个 Rust 单测）

## 非目标

- 自动更新与签名发布（M3）
- 设置从 localStorage 迁移到磁盘（当前靠前端启动时同步语言给 Rust）
- 多窗口、deep-link、全局快捷键

## 方案

- 插件最小集：`single-instance`、`notification`、`autostart`、`window-state`、`log`；托盘用 Tauri 内置 `tray-icon` feature，不引第三方托盘库。
- 关闭到托盘在 Rust 侧统一处理（`CloseRequested` → `prevent_close` + `hide`），不做开关，避免行为分叉。
- 托盘文案与前端共用 `src/locales/*.json`：Rust 用 `include_str!` 读同一份文件，前端语言变更时调用 `set_locale` 重建菜单。这样只有一处文案源。
- 前端所有 `invoke` 收敛到 `src/lib/ipc/`，组件不直接调用。

## 涉及改动

| 层 | 文件 | 动作 |
|---|---|---|
| 规格 | `specs/0002-desktop-integration.md` | 新增 |
| Rust | `src-tauri/src/lib.rs` | 重写：托盘、关闭拦截、单实例、Reopen |
| Rust | `src-tauri/Cargo.toml` | 加 5 个插件 + tray-icon feature |
| 权限 | `src-tauri/capabilities/default.json` | 加 notification / autostart |
| 前端 | `src/lib/ipc/index.ts` | 新增，统一 invoke |
| 前端 | `src/lib/settings/store.ts` | 加 notifications / autoStart |
| 前端 | `src/features/settings/*` | 加系统集成区 |
| 前端 | `src/components/ui/Toggle.tsx` | 新增开关组件 |
| 文案 | `src/locales/*.json` | 加 tray / settings 键 |

## 风险与回滚

- 风险：macOS 通知需应用打包后才能正常请求权限，`tauri dev` 下可能被拒。已做失败内联提示。
- 风险：`set_icon_as_template(true)` 会让托盘图标只用 alpha，彩色图标会变纯黑，属预期。
- 回滚：删除新增插件依赖与 `lib.rs` 托盘段即可，前端保留的开关会退回"仅桌面端可用"提示。

## 验证记录

| 项 | 方式 | 结果 |
|---|---|---|
| Rust 编译 | `cargo build` | 通过 |
| 托盘创建 | `pnpm tauri dev` 日志 | `app started, tray ready` |
| 单实例 | 二次启动二进制，`pgrep` 计数 | 两次均为 1，二次启动退出码 0 |
| 日志落盘 | `~/Library/Logs/com.bluer.tauri-template-react/Tauri Template.log` | 存在 |
| 文案共用 | `cargo test --lib` | 2 个测试通过（中英取值 + 缺失回落） |
| 浏览器降级 | 内置浏览器打开设置页 | 开关禁用，显示"仅桌面端可用"，无 console 报错 |
| 类型/单测/构建 | `pnpm check`、`pnpm build` | 通过 |
| 关闭到托盘 / 托盘菜单 / 窗口记忆 / 通知 / 自启 | 需真实点击托盘与系统弹窗 | 待人工点验 |

## 实现中发现的坑

`OnceLock` 只能 set 一次，语言来回切换时第二次 set 会被静默忽略，导致托盘文案卡在第一次的语言。
已改为 `Mutex<&'static str>`，并在 `docs/tech-notes.md` 补记。
