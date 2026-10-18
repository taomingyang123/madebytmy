# 中文版本（F06）

中文入口：http://127.0.0.1:3002/zh/ 。根目录 `yarn dev` 的启动方式不变。

| 页面 | English | 简体中文 |
|---|---|---|
| 首页 | / | /zh/ |
| 项目列表 | /projects/ | /zh/projects/ |
| Tiny’s Tool | /projects/tinys-tool/ | /zh/projects/tinys-tool/ |
| 关于 | /about/ | /zh/about/ |

使用共用页面模板和 app/locales/en.json、zh.json 文案；项目名称保留品牌原文，介绍、导航、按钮、无障碍提示和错误页均有中文。仅公开 Tiny’s Tool，其余项目仍为草稿。英文分享图片仍作为共用品牌图，标题与描述按语言设置。

页头 中文 / EN 链接切换到当前页面的对应语言版本。中英文为独立路由记录（同一页面文件），避免把语言切换当作重复导航；不根据浏览器偏好强制重定向。NuxtPage 使用路径 key，保证切换后重新设置页面 SEO。

8 个公开路由均预渲染，中文 html lang=zh-Hans；各自 canonical，互相对应 en / zh-Hans / x-default alternate；sitemap 包含两种语言。结构化数据的页面链接与文字随语言调整；作者实体标识保持相同。根目录和 zh/ 分别提供静态 404，均 noindex、无 canonical/hreflang。Preview 继续默认禁止索引。

## 验证

- 类型检查、lint：PASS（zh-typecheck.log、zh-lint.log）。
- 单测：10/10 PASS（zh-test.log），包括路径往返、语言目录一致性及已有发布门禁。
- 静态生成：8 页 PASS（zh-generate.log）；逐页检查正文、标题/描述、lang、canonical、hreflang、JSON-LD、sitemap、草稿不泄漏。
- 浏览器：32/32 PASS（zh-browser.log 与 evidence/browser.json）；覆盖8页×4个宽度、四组语言往返、键盘、无JS、301/404与无控制台错误。
- 已人工查看中文首页320/1280截图：evidence/zh-home-320.png、zh-home-1280.png。

本轮修复了最初别名路由导致语言切换被当作重复导航的问题，改为独立路由；修复了EN按钮的可访问名称不包含完整可见单词的问题。所有功能在本地验证，未部署；3002开发服务保留运行，4180仅用于临时验收。
