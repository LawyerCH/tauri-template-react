# 应用外壳与工程底座

## Purpose

给桌面应用提供可运行的外壳、主题、多语言与统一设置，使新项目删掉示例页即可开工。
本规格描述的是**当前必须成立的行为**，不是任务清单。

## Requirements

### Requirement: 三页导航外壳

应用 SHALL 提供概览、任务、设置三个页面，通过侧栏在页间切换，并高亮当前页。

#### Scenario: 切换到设置页
- **WHEN** 用户点击侧栏的"设置"
- **THEN** 内容区渲染设置页，侧栏对应项标记为当前页（`aria-current="page"`）

#### Scenario: 窄窗降级
- **WHEN** 容器宽度小于 42rem
- **THEN** 侧栏折叠为图标列，内容区改为单栏

### Requirement: 主题切换与持久化

应用 SHALL 支持浅色、深色、跟随系统三种主题，选择结果在重启后仍然生效。

#### Scenario: 选择深色
- **WHEN** 用户在设置页选择"深色"
- **THEN** 根元素写入 `data-theme="dark"`，界面立即切换，刷新后仍为深色

#### Scenario: 跟随系统
- **WHEN** 主题为"跟随系统"且操作系统切换到深色
- **THEN** 界面跟随变为深色，无需用户操作

### Requirement: 中英双语

应用 SHALL 提供简体中文与英文两套文案，切换后所有界面文案同步更新并持久化。

#### Scenario: 切到英文
- **WHEN** 用户在设置页选择 English
- **THEN** 导航、标题、表单占位、按钮文案全部变为英文，刷新后仍为英文

#### Scenario: 缺失翻译
- **WHEN** 某个 key 在英文语言包中缺失
- **THEN** 回落到中文，不显示原始 key

### Requirement: 设置单一来源

所有用户偏好 SHALL 只存放在 `src/lib/settings/store.ts`，组件不得直接读写 `localStorage`。

#### Scenario: 旧数据格式
- **WHEN** 本地存储里的设置结构与当前版本不符
- **THEN** 非法字段回落到默认值，页面不崩溃

### Requirement: 任务页交互演示

任务页 SHALL 支持新增、勾选完成、删除，且无数据时显示空状态与创建说明。

#### Scenario: 首次进入
- **WHEN** 任务列表为空
- **THEN** 显示空状态，说明"在上方输入框写一条任务，回车即可创建第一条"

#### Scenario: 新增任务
- **WHEN** 用户在输入框输入文字并回车
- **THEN** 新任务出现在列表顶部，输入框清空

### Requirement: 工程验收命令

仓库 SHALL 提供一条命令完成类型检查、静态检查与单元测试。

#### Scenario: 提交前自检
- **WHEN** 执行 `pnpm check`
- **THEN** 依次运行 typecheck、eslint、vitest，任一失败则整体失败
