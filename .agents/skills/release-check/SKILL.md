---
name: release-check
description: 提交、推送、打包、发版的唯一通道。当用户说"提交""推一下""打包""发个版本"，或一个任务已完成需要落地时使用。提交前必须实际跑过校验命令。
---

# 交付门禁

依据 `docs/quality.md` §交付与发布。

## 提交前

### 1. 看范围

```bash
git status --short
git diff --stat
```

确认只包含本次任务相关文件。出现 `.env`、密钥、`src-tauri/target`、临时截图，立刻停下并说明。

### 2. 跑校验

```bash
pnpm check          # 必须绿
pnpm check:rust     # 改动涉及 src-tauri/ 时
```

贴真实输出。没跑过不许说"应该没问题"。

### 3. 生成提交信息

格式 `<type>(<scope>): <祈使句>`

| type | 用于 |
|---|---|
| feat | 新功能 |
| fix | 修缺陷 |
| refactor | 不改行为的重构 |
| style | 只动样式 |
| docs | 文档 |
| test | 测试 |
| chore | 工程配置、依赖 |
| build / ci | 构建与流水线 |

好的写法：`fix(settings): 主题切换后立即同步原生窗口样式`
不好的写法：`update code`、`修复bug`、`feat: 改了很多东西`

一次提交只做一件事；重构与功能分开提交。

### 4. 提交

只 add 明确文件，不用 `git add -A`：

```bash
git add <file1> <file2>
git commit -m "<type>(<scope>): <描述>"
```

## 推送

- 先确认当前分支：`git branch --show-current`
- 不直推 `main`，走 `feat/<短名>` 或 `fix/<短名>`
- 双托管：`git push origin <branch>`，需要时再 `git push cnb <branch>`
- 远程有更新时用 `git pull --rebase`，不用 force

## 发版

1. 三处版本号同步：`package.json`、`src-tauri/Cargo.toml`、`src-tauri/tauri.conf.json`
2. `pnpm tauri build` 实跑一次
3. 打 tag：`v<版本>`，与上面三处一致
4. 签名密钥与公证材料不进仓库

## 输出

```
提交：<hash> <提交信息>
校验：pnpm check ✓ / check:rust ✓
推送：origin/feat/xxx ✓
```

## 禁止

- `git add -A` / `git add .`
- `git push --force`（除非用户明确要求且非 main）
- 直推 `main`
- 提交密钥、`.env`、构建产物
- 未跑校验就声称完成
