# showcase-gallery Specification

## Purpose
TBD - created by archiving change showcase-gallery. Update Purpose after archive.
## Requirements
### Requirement: 标签页分类浏览

展示页 SHALL 提供「组件 / 模块 / 模板」三个标签页，默认展示组件页，切换后内容随之替换。

#### Scenario: 默认进入组件页
- **WHEN** 用户访问 `/showcase`
- **THEN** 页面展示组件标签页内容，标签栏中「组件」处于选中态

#### Scenario: 切换到模块页
- **WHEN** 用户点击「模块」标签
- **THEN** 内容区替换为模块列表，组件列表不再渲染

#### Scenario: 键盘切换
- **WHEN** 焦点在标签栏上且用户按方向键
- **THEN** 选中项按方向移动，内容随之切换

### Requirement: 组件按功能分组

组件页 SHALL 按功能类别分组展示，每组有标题与条目数。

#### Scenario: 浏览背景类组件
- **WHEN** 用户查看组件页
- **THEN** 能看到「背景」分组，含 Aurora Background、Grid Pattern 等条目

#### Scenario: 条目信息完整
- **WHEN** 用户查看任一条目
- **THEN** 该条目显示组件名与类别标签，有预览的条目额外显示缩略实例

### Requirement: 模块与模板分类展示

模块页 SHALL 列出成品区块及其所属类别；模板页 SHALL 列出已可用的页面组合。

#### Scenario: 模块页标注类别
- **WHEN** 用户查看模块页
- **THEN** 每个区块显示名称与类别（如 `hero-sections`、`pricing-sections`）

#### Scenario: 模板页指向实际页面
- **WHEN** 用户查看模板页
- **THEN** 展示桌面应用内已组装的页面，并可点击跳转

### Requirement: 首屏可读且省 JS

展示页 SHALL 在静态 HTML 中包含全部条目的名称与分组标题；预览实例仅在对应标签页激活时挂载。

#### Scenario: 无 JS 时仍可读
- **WHEN** JavaScript 未执行
- **THEN** 页面上能看到全部分组标题与条目名称（预览不出现）

#### Scenario: 非激活标签不加载预览
- **WHEN** 用户停留在组件页
- **THEN** 模块页与模板页的预览实例未被挂载

### Requirement: 尊重减少动效偏好

当系统偏好为减少动效时，预览 SHALL 不播放动画。

#### Scenario: 开启减少动效
- **WHEN** 系统开启 `prefers-reduced-motion: reduce`
- **THEN** Marquee、Aurora、Shimmer 等循环动画停止，内容仍完整可见

### Requirement: 从侧栏可达

侧栏导航 SHALL 提供进入展示页的入口。

#### Scenario: 点击侧栏入口
- **WHEN** 用户点击侧栏「组件」
- **THEN** 路由跳转到 `/#/showcase`，侧栏该项为选中态

