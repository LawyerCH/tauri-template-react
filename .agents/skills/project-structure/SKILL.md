---
name: project-structure
description: 决定新文件放哪、新模块怎么拆、目录要不要重构。当用户说"加个模块""目录怎么放""重构一下结构"，或改动跨了 app/features/components/lib 多层时使用。
---

# 目录架构决策

依据 `docs/architecture.md`。本技能只负责"落位与依赖方向"的判断。

## 步骤

### 1. 判断归属域

- 只服务一个页面 → 留在 `features/<域>/`
- 被两个以上页面使用 → 上提到 `components/ui/` 或 `lib/`
- 与 UI 无关的纯逻辑 → `lib/<主题>.ts`
- 用户偏好类状态 → `lib/settings/store.ts` 加字段

拿不准时先留在最近的使用点，被第二次用到再上提。

### 2. 检查依赖方向

```
app ──▶ features ──▶ components ──▶ lib
```

出现以下任一情况，说明落位错了，重放：

- `lib` import 了 `features` 或 `components`
- `components/ui` import 了 `features`
- `features/A` import 了 `features/B`

### 3. 命名

| 对象 | 约定 | 例子 |
|---|---|---|
| 组件文件 | PascalCase，具名导出 | `TaskList.tsx` → `export function TaskList` |
| 目录 | kebab-case | `features/settings` |
| hook | `useXxx` | `useThemeEffect` |
| 测试 | 与源文件同目录同名 | `EmptyState.test.tsx` |
| Rust 命令 | 按域一文件 | `commands/window.rs` |

### 4. 补注册点

新增页面要同步三处：文案（中英）、`app/navigation.ts`（如需进侧栏）、`app/router.tsx`。

### 5. 判断是否该抽象

只有同时满足才提取：

- 已存在两处以上重复
- 两处的变化方向一致

不满足就用三行重复代码，别造抽象。

## 输出

给一个清单：

```
新增：src/features/xxx/XxxPage.tsx（域内页面）
修改：src/app/router.tsx（注册路由）、src/locales/*.json（文案）
理由：只服务单一页面，不上提到 components
```

## 禁止

- `utils/`、`helpers/`、`common/` 这类无主题目录
- 无必要的 `index.ts` 桶文件
- 在 `components/ui` 里写业务判断
- 为了"以后复用"提前拆包、提前分层
- 一上来就大范围移动文件；结构问题先局部修，整目录重构单独提交
