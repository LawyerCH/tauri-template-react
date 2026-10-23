---
applyTo: "src-tauri/**/*.{rs,toml,json}"
description: Tauri Rust 侧改动约定
---
# Rust 侧约定

## 结构
- `src/lib.rs` 只做 Builder 装配与命令注册
- 命令按域拆到 `src-tauri/src/commands/<域>.rs`
- `capabilities/` 一个场景一个 json，最小权限；不往 `default.json` 堆

## 改动顺序
1. 先定类型（`serde` 结构）
2. 再写实现
3. 最后在 `lib.rs` 注册
4. 前端调用一律经 `src/lib/ipc/`，组件禁止直接 `invoke`

## 边界
- 新增 Tauri 插件必须在 `capabilities/` 单独开权限文件，且先说明理由与代价
- 绝不提交 `src-tauri/target`

## 验证
`pnpm check:rust` 必须通过：

```
cd src-tauri && cargo fmt --check && cargo clippy --all-targets -- -D warnings
```
