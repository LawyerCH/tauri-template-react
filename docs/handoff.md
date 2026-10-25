# 规格与实现的交接契约

> **为什么要这份文件**：`docs/openspec.md` 管"写什么"，`docs/superpowers.md` 管"做得对不对"，但两者之间原来没有明确交接点。实测发现三处断点——TDD 不知道测哪条 Requirement、reviewer 模板指向已删的 `docs/superpowers/plans/`、验证清单不知道从哪读。这份文件把这些接口定死。

## 唯一事实来源

| 内容 | 位置 | 谁写 | 谁读 |
|---|---|---|---|
| 需求与验收场景 | `openspec/changes/<name>/specs/*.md` | OpenSpec `/opsx-propose` | TDD、reviewer、验证 |
| 技术方案 | `openspec/changes/<name>/design.md` | 同上 | reviewer |
| 实现清单 | `openspec/changes/<name>/tasks.md` | 同上（可手工拆细） | `/opsx-apply`、验证 |
| 系统当前必须满足什么 | `openspec/specs/*/spec.md` | `/opsx-archive` 合并 | 所有人 |

**不存在第二处**。任何技能让你去读 `docs/superpowers/plans/` 或 `docs/superpowers/specs/`，一律忽略——那两个目录本项目不用。

## 三个交接点

### 1. TDD 的输入：测哪条 Requirement

写测试前先打开 `openspec/changes/<name>/specs/*.md`，找当前任务对应的 Requirement。

```
openspec/changes/add-dark-mode/specs/theme/spec.md

### Requirement: 主题切换与持久化
应用 SHALL 支持浅色、深色、跟随系统三种主题，选择结果在重启后仍然生效。

#### Scenario: 选择深色
- **WHEN** 用户在设置页选择"深色"
- **THEN** 根元素写入 data-theme="dark"，界面立即切换，刷新后仍为深色
```

**规则**：

- 每个 `Scenario` 至少一个测试。`WHEN` → 测试的前置与操作，`THEN` → 断言。
- 找不到对应 Requirement → **停下补规格**，不要凭空造验收标准。
- 一个 Scenario 拆成多个测试是允许的；反过来（多个 Scenario 共用一个模糊测试）不允许。

### 2. Review 的对照物：拿什么判断"做对了"

请求审查时，`PLAN_OR_REQUIREMENTS` 字段填写：

```
PLAN_OR_REQUIREMENTS: openspec/changes/<name>/（tasks.md + specs/）
```

reviewer 按这个顺序看：

1. `tasks.md` 里勾了几条、有没有漏
2. delta spec 里每条 `Scenario` 是否有代码或测试对应
3. `design.md` 里的决策有没有被违背
4. diff 里有没有规格之外的"顺手改"

**拒绝的审查意见**：只说"这样更好"但不对应任何 Requirement 或 Scenario 的，属于口味问题，可以不改。

### 3. 验证的清单来源：逐条勾什么

声称完成前，逐条核对 `openspec/changes/<name>/tasks.md`，**不要**凭记忆列清单。

```
✅ 打开 tasks.md → 逐条核对 → 报告"X/Y 完成，Z 未完成"
❌ "都做完了" / "测试过了"
```

遇到 `tasks.md` 与 spec 冲突（任务描述与 Scenario 矛盾）→ 以 spec 为准，并修正 tasks。

## 冲突裁决

| 冲突 | 听谁的 |
|---|---|
| spec 与 tasks 矛盾 | **spec**（Scenario 是验收标准，任务是手段） |
| design 与 spec 矛盾 | **spec**，同时改 design |
| 技能建议与项目规范矛盾 | **项目规范**（见 `AGENTS.md` 技能使用规则） |
| 旧 spec 与实际代码矛盾 | **代码**，同时补规格（规格腐烂是要修的 bug） |

## 对上游技能做的两处指针替换

只改指针，不改正文。升级技能时重新应用这两行：

| 文件 | 原内容 | 改为 |
|---|---|---|
| `.agents/skills/requesting-code-review/SKILL.md:60` | `PLAN_OR_REQUIREMENTS: Task 2 from docs/superpowers/plans/deployment-plan.md` | `PLAN_OR_REQUIREMENTS: openspec/changes/<name>/（tasks.md + specs/）` |
| `.agents/skills/verification-before-completion/SKILL.md:96` | `Re-read plan → Create checklist` | `Re-read openspec/changes/<name>/tasks.md → Create checklist` |

`test-driven-development` 不改文件：它的正文只说"先写失败测试"，没提规格来源；输入规则由上节第 1 条约束。
