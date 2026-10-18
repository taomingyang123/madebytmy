# F08 内容与 SEO 改进

日期：2026-10-17。源码与命令均在项目根目录。未提交、未部署。

## 审查发现与实际修改

- 旧页面仅有概括性介绍，缺少具体功能、选择依据和任务入口。现按官网工具目录整理 Tiny’s Tool 的21项功能，分为JSON/API调试6项、代码格式化5项、编码/文本/开发辅助10项。英文和中文直接指向对应工具页面。
- 二维码官网介绍5类功能；多次请求中生成、美化、批量、优化页面在HTTP200与500间变化，错误包含 superCtor.prototype。解码页HTTP200，但官网中文显示未翻译键。作品集保留真实功能说明与访问状态，暂不将不稳定页面作为直达入口。未修改另一个项目的源码，也未声称完成其所有功能验收。
- 两个详情页各增加3个使用场景、3条常见问题，说明任务选择、操作步骤及限制；加入相关项目内链。首页增加任务导览，列表说明两个项目的适用任务。
- 旧标题“Small tools / Web project”无法充分说明主题；现首页、项目目录、具体项目按不同内容目的设置标题，首页和列表H1改为具体主题，双语目录保持一致。
- 项目详情增加与可见导航对应的BreadcrumbList，以及描述外部工具的WebApplication；列表使用CollectionPage/ItemList。去掉将“Independent developer”当作人名的Person标记，关于页改为AboutPage。
- 保留自引用canonical、中英文hreflang、x-default、SSR静态正文与错误页noindex；Sitemap使用本轮真实内容更新日期，不按每次构建刷新日期。
- 不虚构评分、用户量、价格、作者履历或搜索排名；FAQ是可见内容，不承诺搜索富结果。

## 内容依据

- [Tiny’s Tool 官方工具目录](https://tinystool.org/tools/)
- [Tiny QR Toolkit 官方首页](https://qr.tinystool.org/zh)
- 48个中英文功能入口与首页请求记录：`docs/evidence/f08-source-links.json`。该文件是一轮快照，二维码多次复查存在200/500变化。
- [Google：有帮助的内容](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google：标题链接](https://developers.google.com/search/docs/appearance/title-link)
- [Google：面包屑标记](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)

## 验收与边界

类型/lint/11项测试、10页静态SEO、46个公开外链、40组浏览器/可访问性场景均通过。浏览器覆盖21项中文工具链接、5项二维码功能、不可用入口隔离、相关项目跳转和双语切换。日志为 docs/f08-*.log，报告为 docs/evidence/browser.json。Preview保留noindex是环境隔离策略；生产发布需使用SITE_ENV=production重新生成并完成F04的真实域名/HTTP/索引验收。此次改善不能证明搜索排名或收录已提高。
