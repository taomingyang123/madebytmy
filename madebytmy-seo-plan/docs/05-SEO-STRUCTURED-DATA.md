# 05 · SEO、自然链接与结构化数据的正确实施

## 目标：能被理解、发现和验证；不是“刷权重”

**最重要的先后顺序**：有用且真实的作品内容 → 可抓取的静态 HTML → 清晰导航/自然锚文本 → Sitemap / 站长平台 → 观察效果 → 持续改进。

## 页面基本规则

| 项目 | 规则 |
|---|---|
| Title | 首页、项目页、About 各不相同，准确写清页意图，品牌后置或自然出现 |
| Meta description | 每页独立，概括用户实际能找到什么；它是摘要候选而非直接排名按钮 |
| H1 | 每页一个明确主题，其他层级依次 H2/H3 |
| Canonical | 每个公开网页绝对 HTTPS 自引用；与实际重定向/站点地图一致 |
| Robots | 公开路由可抓取；草稿不输出，预览子域要避免被索引（优先访问保护） |
| Sitemap | 列出**唯一**规范 URL，过滤 draft/archived/404/无价值参数路由 |
| HTML 链接 | 使用真实 `<a href="...">`，有可理解的锚文本，不用只有 click 事件的伪链接 |
| 语言 | `<html lang="en">` 与真实正文一致；未来有语言版本时才加可信 hreflang |
| OG | 每页对应标题/描述/可访问图片；无图时统一有效 fallback |
| 页面速度 | 用轻量静态 HTML、优化图片，非必要 JS 不阻碍爬虫看到正文 |

## JSON-LD：哪些类型适合哪里

**首页 `/`**：推荐 `WebSite` + `Person`（`creator` 关联） + 可选 `ItemList`（真实已发布作品的目录）。结构化数据对应**页面里真正展示的内容**，不宣称首页自然获得富媒体结果。

**`/about/`**：如果页面重点介绍一个作者，可使用 `ProfilePage`，且 `mainEntity` 为 `Person`；真实已验证 GitHub、其他作者账号才可放入 `sameAs`。Google 的 ProfilePage 指南明确提到站内“关于我”可作为合适用例，但内容仍必须符合其指南。

**`/projects/[slug]/`**：一般 `WebPage` + 项目主体（视内容使用 `SoftwareApplication` / `WebApplication` / `CreativeWork`），`creator` 指向相同 Person `@id`，但仅对适合的数据类型声明实际属性。**不要为追求搜索富结果乱填价格、评分、安装次数**。

**移除 PDF 的写法**：`Person.makesOffer → Offer → itemOffered → WebApplication` 不应仅为了表达“我开发了一个网站”而默认存在；作者关系优先由 `creator`、可验证正文及页面直接链接表达。

示意可参考 `../examples/jsonld-home.example.json`。其中网址、笔名都要与页面真实资料一致。

## 链接策略：站群风险边界

- `madebytmy.com` 项目目录 / 介绍页 → 各项目：合理、默认普通链接，不自动添加 `nofollow`；这是作品导航而非“SEO 注水”。
- `tinystool.org/about/` → 作者主页：**可选**一条真实署名链接；不用每个工具页都加关键词锚文本。
- `qr.tinystool.org` 等独立站 → 作者主页：只有归属关系属实且自然服务用户时再放，避免强制全站互换。
- GitHub 个人介绍 → 作者主页：可以作为用户发现入口；**不保证** GitHub 链接有特别高的权重或传递效率。
- 不买卖权重链接，不做数十个站点构成的同词锚文本链轮、不批量隐藏站点互链、不虚构反向链接来源。

Google Search Central 将“过度交换链接”和仅为交叉链接而制作合作伙伴页面列为链接垃圾实例。对真实个人作品的合理引用与人为制造排名信号之间应有清楚边界。

## Bing / Google 搜索引擎处理

1. 上线后创建 `madebytmy.com` 的 Google Search Console 域名资产和 Bing Webmaster Tools 资产；DNS 验证在 Cloudflare 上完成。
2. 检查首页 + 1 个详情页的 live URL / 获取的 HTML / canonical / robots / response status。
3. 在两处提交 `https://madebytmy.com/sitemap.xml`。
4. Bing 如果支持且有必要，启用 IndexNow（Cloudflare Crawler Hints 可选）；不要为了这件事重复造一个主动推送服务。
5. Bing “site: 返回 50”只作为趋势信号。Bing Webmaster Tools 的 URL Inspection 和 Site Explorer 可以协助诊断发现、抓取与索引；Google GSC 则独立判断 Google 收录，**不能互相替代**。
6. 站长平台状态变化、首页曝光、项目外链点击可作为后续评估指标；任何点击或曝光都不保证。

## Cloudflare Crawler Hints 的边界

官方说明它基于 Cloudflare 缓存信号（如 MISS）通知搜索引擎、支持 IndexNow；这不意味着所有新的静态构建**都会立即**发出通知，不代表 Google 使用 IndexNow，也不保证必应收录。若已打开则先观察日志与效果，**不要**盲目叠加重复推送。

## 防止“优化 SEO”反而削弱现有站点

现有 `tinystool.org` 的问题要单独分析：站点已抓取却未编入 Google 索引时，优先排查可索引性、内容价值、规范化、重复页面、路由、内部导航、服务器状态、robots / noindex，不能把个人站互链当作万能修复手段。

## 官方参考

- Google 内容与 E-E-A-T：https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Spam Policy：https://developers.google.com/search/docs/essentials/spam-policies
- Google URL 发现与索引：https://developers.google.com/search/docs/fundamentals/how-search-works
- Google 链接可抓取：https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Google Canonical：https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google ProfilePage：https://developers.google.com/search/docs/appearance/structured-data/profile-page
- Bing URL Inspection：https://www.bing.com/webmasters/help/URL-Inspection-55a30305
- Bing Site Explorer：https://www.bing.com/webmasters/help/site-explorer-c680da37
- Cloudflare Crawler Hints：https://developers.cloudflare.com/cache/advanced-configuration/crawler-hints/
