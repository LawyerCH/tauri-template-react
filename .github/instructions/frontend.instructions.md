---
applyTo: "src/**/*.{ts,tsx,css,json}"
description: React / TypeScript 前端改动约定
---
# 前端约定

## 分层（依赖只能向下）
`app → features → components → lib`

- `lib` 不依赖 `features` / `components`
- `components/ui` 不含业务逻辑，不 import `features`
- `features/A` 不 import `features/B`；要共享就上提到 `components` 或 `lib`

## 新东西放哪里
| 要加的东西 | 位置 | 判定 |
|---|---|---|
| 新页面 | `src/features/<域>/XxxPage.tsx` + 在 `app/router.tsx` 注册 | 一个业务域一个目录 |
| 页面内组件 | 同目录 `XxxList.tsx` | 只服务当前页 |
| 跨页复用组件 | `src/components/ui/` | 被 2 处以上使用才上提 |
| 通用函数 | `src/lib/<主题>.ts` | 按主题建文件，不建 `utils.ts` 垃圾桶 |
| 用户偏好 | `src/lib/settings/store.ts` 加字段 | 唯一入口 |
| 文案 | `src/locales/*.json` 同名 key | 中英必须同步 |

## 编码
- 组件文件 `PascalCase.tsx`，导出同名具名函数（不用 default）
- 目录 `kebab-case`；hook 用 `useXxx`；纯函数小驼峰
- 测试与被测文件同目录：`X.tsx` → `X.test.tsx`
- 状态：跨重启保留 → settings store；只活一个页面 → `useState`；不为"以后共享"提前上全局 store

## 样式
- 只用 `src/styles/tokens.css` 的变量与语义类，不写裸色值
- 不写渐变、阴影；圆角全站统一
- 正文对比度 ≥ 4.5:1，必须有可见 focus ring，禁止裸 `outline: none`
- 视觉改动必须覆盖空态 / 加载态 / 错误态，并检查浅色与深色

## 验证
`pnpm check`（typecheck + lint + test）必须通过；新增组件在同目录补测试。
