# superpowers 技能（子集）

> 来源：[obra/superpowers](https://github.com/obra/superpowers)（MIT）。本项目只装了其中 **8 个不产出文档的技能**，用于提升实现质量。规格与计划由 OpenSpec 管，见 `docs/openspec.md`。

## 为什么只装一部分

superpowers 全套 15 个技能里有 5 个会**写自己的文档目录**，与 OpenSpec 直接冲突：

| 技能 | 写到哪里 | 冲突 |
|---|---|---|
| `brainstorming` | `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` | 与 `openspec/changes/<name>/design.md` 重叠 |
| `writing-plans` | `docs/superpowers/plans/YYYY-MM-DD-<feature>.md` | 与 `openspec/changes/<name>/tasks.md` 重叠 |
| `subagent-driven-development` | 按 plans 里的任务执行 | 与 `/opsx-apply` 重叠 |
| `executing-plans` | 按 plans 里的任务执行 | 同上 |
| `finishing-a-development-branch` | 收尾并合并 | 与 `/opsx-archive` + `release-check` 重叠 |

而且它们的文档内容与 OpenSpec 的 `proposal.md` / `design.md` / `tasks.md` **几乎一一对应**（goals / non-goals / decisions / tasks）。两套并存的结果是同一个需求有两份设计文档，一段时间后必然漂移。

**所以这 5 个已删除**。需要走需求流程时用 OpenSpec。

## 装了哪 8 个

| 技能 | 触发时机 | 作用 |
|---|---|---|
| `systematic-debugging` | 报错、测试失败、行为异常 | 先复现 → 定位根因 → 再修；不许直接猜着改 |
| `test-driven-development` | 写新逻辑或修 bug | 红-绿-重构 |
| `verification-before-completion` | 声称"做完了"之前 | 必须跑命令并贴输出，不许说"应该没问题" |
| `requesting-code-review` | 任务完成、重大功能、合并前 | 主动请求审查，给出 diff 范围与预期 |
| `receiving-code-review` | 收到审查意见 | 逐条核实后再改，不表演式答应 |
| `dispatching-parallel-agents` | 2 个以上互不依赖的任务 | 并行派发子代理 |
| `using-git-worktrees` | 需要隔离开发 | 开 worktree，不动主工作区 |
| `using-superpowers` | 每次对话开始 | 提醒"有技能就先调技能" |

## 与 OpenSpec 的边界

| 环节 | 谁管 | 产物 |
|---|---|---|
| 想清楚 / 摆方案 | **OpenSpec** `/opsx-explore` | 对话结论 |
| 写规格 | **OpenSpec** `/opsx-propose` | `openspec/changes/<name>/` |
| 实现 | **OpenSpec** `/opsx-apply` | 代码（可用 `test-driven-development` 辅助） |
| 排查问题 | `systematic-debugging` | 根因与修复 |
| 验证 | `verification-before-completion` | 命令输出 |
| 审查 | `requesting-code-review` / `receiving-code-review` / `quality-review` | 审查结论 |
| 归档 | **OpenSpec** `/opsx-archive` | `openspec/specs/` 更新 |
| 提交发版 | `release-check` | 提交记录 |

一句话：**OpenSpec 管"写什么、拆成什么"，superpowers 只管"做得对不对"**。

两者之间的接口（TDD 测哪条 Requirement、review 对照什么、验证勾什么）见 **`docs/handoff.md`**。不看那份文件，"做得对不对"就没有标尺。

## 改过的技能文件

对上游技能只做**指针替换**，不改正文：

| 文件 | 改动 |
|---|---|
| `using-superpowers/SKILL.md` | 原文“进 plan mode 前先调 `brainstorming`” → 指向 OpenSpec explore/propose |
| `requesting-code-review/SKILL.md` | 示例路径 `docs/superpowers/plans/...` → `openspec/changes/<name>/` |
| `verification-before-completion/SKILL.md` | `Re-read plan` → `Re-read openspec/changes/<name>/tasks.md` |

升级技能时需重新应用这三处，清单也记在 `docs/handoff.md`。

## 触发方式

不需要斜杠命令，靠 `description` 自动触发；也可以主动点名：

```
用 systematic-debugging 查这个报错
用 verification-before-completion 确认这次改动
```

注意 `using-superpowers` 里有条硬规则："只要有 1% 可能适用就必须调技能"。本项目**不完全采纳**——见 `docs/workflow.md` 的「什么时候必须走流程」，纯问答与小修不启动流程。
