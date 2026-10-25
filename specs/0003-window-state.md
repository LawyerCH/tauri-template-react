# 0003 窗口位置记忆

- 状态：进行中
- 日期：2026-10-25
- 涉及层：Rust / 权限 / 前端

## 背景与用户故事

作为桌面应用用户，我希望关闭并重新打开应用时窗口恢复到上次的位置与大小，以便不每次手动调整。

## 验收标准

- [ ] 启动应用后移动/缩放窗口，关闭应用，重新启动，窗口位置与大小与关闭前一致
- [ ] 首次启动（无状态文件）时窗口使用默认尺寸居中显示，不报错
- [ ] `pnpm check` 全绿
- [ ] `pnpm check:rust` 全绿

## 非目标

- 本次不做：多显示器记忆、全屏状态记忆、窗口最小化状态

## 方案

`tauri_plugin_window_state` 已注册，capability 已放行 `window-state:default`。插件默认在 `setup` 时自动 restore，`on_window_event` 中自动 save（CloseRequested 之前）。无需额外前端调用；但为可验证性，在 Rust 侧显式调用 `app.restore_state` 与 `window.save_window_state`，并记录日志。

## 涉及改动

| 层 | 文件 | 动作 |
|---|---|---|
| Rust | `src-tauri/src/lib.rs` | setup 中 restore_state；CloseRequested 前 save_window_state |
| 权限 | `src-tauri/capabilities/default.json` | 已放行 window-state:default |

## 风险与回滚

- 风险：状态文件损坏导致启动失败 → 插件内部 catch，回退默认
- 回滚：移除 restore/save 调用，保留插件自动行为