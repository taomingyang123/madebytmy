# 11 · 信息来源、核实范围与待验证事实

**审查日期**：2026-10-16。

## 用户提供的原始材料

- `怎么判断必应是否收录站点.pdf`，8 页，记录与 Gemini 的对话。
  - p1–p2：Bing 是否收录、site:50 的解释。
  - p2–p3：madebytmy.com 作品集、互链、“权重”与内容建议。
  - p3–p4：JSON-LD、空域名冷启动、框架取舍。
  - p4–p7：Nuxt 3/Tailwind 示例与 Cloudflare Pages 预渲染配置。
  - p8：声称已生成 ZIP 的回复；PDF 内没有该 ZIP 的实际可用字节。

## 官方资料（可独立检索验证）

| 主题 | 参考 URL | 相关结论 |
|---|---|---|
| Google 内容质量 / E-E-A-T | https://developers.google.com/search/docs/fundamentals/creating-helpful-content | E-E-A-T 本身不是特定排名因素；以用户价值优先 |
| Google 站点抓取与收录 | https://developers.google.com/search/docs/fundamentals/how-search-works | 抓取、收录均不保证 |
| Google 重新抓取 | https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl | 请求抓取≠保证收录 |
| Google Sitemap | https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview | 帮助发现 URL，不保证索引 |
| Google 可抓取链接 | https://developers.google.com/search/docs/crawling-indexing/links-crawlable | `<a href>` 有助于发现页面 |
| Google 垃圾链接政策 | https://developers.google.com/search/docs/essentials/spam-policies | 过度链接交换属于违规模式 |
| Google 规范网址 | https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls | canonical 是首选信号，不是绝对命令 |
| Google 个人资料页面结构化数据 | https://developers.google.com/search/docs/appearance/structured-data/profile-page | ProfilePage 适合真正的单人资料页面；不保证富结果 |
| Bing URL Inspection | https://www.bing.com/webmasters/help/URL-Inspection-55a30305 | 按网址检查索引、SEO 和 markup |
| Bing Site Explorer | https://www.bing.com/webmasters/help/site-explorer-c680da37 | 按站点结构观察 Bing 已发现 URL 的状态 |
| Bing IndexNow | https://www.bing.com/webmasters/help/indexnow-0z209wby | 通知变化，不保证入库 |
| Cloudflare Crawler Hints | https://developers.cloudflare.com/cache/advanced-configuration/crawler-hints/ | 缓存变化提示和 IndexNow 通知 |
| Cloudflare Nuxt Pages 指南 | https://developers.cloudflare.com/pages/framework-guides/deploy-a-nuxt-site/ | 官方模板部署指引；须与 SSG 自己的构建产物区分 |
| Nuxt 4 roadmap | https://nuxt.com/docs/4.x/community/roadmap/ | 官方记录 Nuxt 3 维护到 2026-07-31 |
| Nuxt GitHub 官方维护讨论 | https://github.com/nuxt/nuxt/discussions/33918 | 确认 Nuxt 3 EOL 延至 2026-07-31 |

## 网站实际检查得到的事实

- 本次可以通过公开页面查阅 `https://tinystool.org/` 的工具导航、介绍内容。
- 公开的工具集合页：`https://tinystool.org/tools/`。
- 公开的中文大型 JSON 工具页：`https://tinystool.org/zh/tools/json/large-json-viewer/`。
- 公开 About 页：`https://tinystool.org/about/`。
- 对 `madebytmy.com` / `qr.tinystool.org` / `ip.tinystool.org` 的网页读取无法完成，本次**未能验证现状**；不能据此断言域名已停用。

## 数据与结论的边界

- 不拥有任何 Search Console / Bing Webmaster Tools 后台数据，所以无法判断实际索引页面的精确数量、未索引原因或实际权重。
- 没有用户本人确认公开姓名、Github、个人邮箱、QR / OurTable 实际线上状态，故所有未证实信息不得自动展示。
- 本套方案为工程设计，不是对网站现有源码、DNS 设置或生产运行状态的审计；真正部署前必须基于生产环境重新验证。
