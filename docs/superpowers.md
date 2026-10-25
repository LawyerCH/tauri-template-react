# superpowers 使用说明

> 来源：[obra/superpowers](https://github.com/obra/superpowers)（MIT）。它是**开发方法论**——15 个技能覆盖从逼需求到验证的完整流程，不是规格管理工具。

## 装了什么

装进 `.agents/skills/` 的 13 个：

| 技能 | 触发的说法 | 作用 |
|---|---|---|
| `brainstorming` | "我想做个…"、"还不确定怎么做" | 逼需求、摆选项、收敛方案，不写代码 |
| `writing-plans` | "定个计划"、"拆任务" | 把规格写成可执行的 bite-sized 任务清单 |
| `executing-plans` | "按计划实现" | 逐任务执行并勾选 |
| `subagent-driven-development` | 大改动 | 派子代理逐任务做，主代理审查 |
| `dispatching-parallel-agents` | 多个独立子任务 | 并行派发 |
| `systematic-debugging` | "报错了""不生效" | 先复现、再定位、最后修 |
| `test-driven-development` | 写新逻辑 | 红-绿-重构 |
| `verification-before-completion` | "做完了" | 交付前逐条验证，不许说"应该没问题" |
| `requesting-code-review` | "审查一下" | 主动请求审查 |
| `receiving-code-review` | 收到审查意见 | 按意见改，不辩解 |
| `finishing-a-development-branch` | "收尾""合并" | 清理、验证、合并 |
| `using-git-worktrees` | 需要隔离开发 | 开 worktree，不动主工作区 |
| `using-superpowers` | 每次对话开始 | 提醒"有技能就先调技能" |

**未装**：`writing-skills`（写技能的方法论，本项目不写技能）、`diagnosing-superpowers`（诊断技能自身故障）。

## 与 OpenSpec 的分工（重要）

两者**不重复**，各管一段：

| 环节 | 谁管 | 产物 |
|---|---|---|
| 想清楚要做什么 | `superpowers:brainstorming` | 对话结论 |
| 把需求写成规格 | **OpenSpec** `/opsx-propose` | `openspec/changes/<name>/` |
| 把规格拆成任务 | `superpowers:writing-plans` | 任务清单（可并入 OpenSpec 的 `tasks.md`） |
| 实现 | `superpowers:executing-plans` 或 `/opsx-apply` | 代码 |
| 验证 | `superpowers:verification-before-completion` | 验证结果 |
| 归档 | **OpenSpec** `/opsx-archive` | `openspec/specs/` 更新 |

一句话：**OpenSpec 管"规格的存档与累积"，superpowers 管"怎么把规格变成代码"**。

冲突处理：superpowers 的 `writing-plans` 默认把计划存到 `docs/superpowers/plans/`。**本项目改为写进 OpenSpec 的 `tasks.md`**，避免两套计划目录。

## 与项目既有规范的冲突点

| superpowers 建议 | 本项目做法 |
|---|---|
| 计划存 `docs/superpowers/plans/` | 写进 `openspec/changes/<name>/tasks.md` |
| 强推 TDD（先写失败测试） | 新逻辑建议 TDD；UI 调整与配置改动不强制 |
| `using-superpowers` 要求"任何情况都先调技能" | 保留，但纯问答与小修不启动流程 |
| 大量英文模板 | 输出用中文；模板结构可参考，措辞本地化 |

## 触发方式

不需要斜杠命令，靠 `description` 自动触发。也可以主动点名：

```
用 brainstorming 帮我想清楚这个功能
用 systematic-debugging 查这个报错
```

`using-superpowers` 里有一条硬规则："只要有 1% 可能适用，就必须调用技能"。本项目不完全采纳这条——见 `docs/workflow.md` 的「什么时候必须走流程」。
