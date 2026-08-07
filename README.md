# DataCollectionOps Operations Suite

老板演示静态界面包。

入口：`index.html`

包含：
- `web-console.html`：Web 管理中心
- `workstation-assistant.html`：现场工作站助手
- `database-schema.html`：数据库架构 / 表结构浏览
- `exports/DataCollectionOps-Database-Table-Interface.xlsx`：数据库表结构 Excel

数据库架构页面基于当前系统数据模型，覆盖 5 个 Schema、30 张表、542 个字段和 46 条外键关系。


## Menu synchronization
Web management navigation now matches the formal system: Overview / Organization / Master Data / Agents / Stations / Checklist Templates / Checklist Configuration / Alerts / Database Blueprint / Language / Settings. Added static showcase modules for the newly introduced management menus.


## 中文老板演示模式

- 演示包固定以简体中文打开，忽略浏览器历史语言设置，避免中英混排。
- Web 左侧导航按“运行态势 / 运维配置 / 平台管理”重新分组，并优化选中态、图标底板、悬停反馈和滚动条。
- 界面展示文案统一中文；数据库真实 Schema、表名、字段名、协议名及产品专有名保留原始技术标识。
