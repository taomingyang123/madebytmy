# 01 · Gemini 方案审查及证据分级

## 来源说明

用户上传的 8 页 PDF `怎么判断必应是否收录站点.pdf` 记录了：Bing site 查询 → tinystool.org 搜到“50” → 用 madebytmy.com 展示站点并相互链接 → 选 Nuxt 3 → Gemini 输出了单页源码与所谓打包结果。以下【PDF】只表示原文建议，【官方】指公开官方文档，【本方案】指审查后的工程建议。**PDF 的意见不是事实证明**。

| PDF 出现位置 | 原结论或做法 | 审查结果 | 处理 |
|---|---|---|---|
| p1–p2 | `site:tinystool.org` 显示 50 就是“至少 50 个收录” | `site:` 返回数量与实际收录库不必然一致，且前台结果可能折叠或改变；也不能推断 Google 的索引 | 只作为快速线索，Bing URL Inspection + Site Explorer 为主 |
| p2–p3 | 个人站 → 工具站持续传递 SEO 权重、建立“蓄水池” | 页面间普通链接可以帮助发现内容及提供相关信号，但无权重/排名保证，甚至不值得用作唯一建站目的 | 改为独立作品集，链接首先服务真实访客 |
| p2 | 双向链接自动强化 E-E-A-T | E-E-A-T **不是单独的排名因素**；没有官方证据证明互链本身会自动“增加信任评分” | 可用真实署名与项目归属，但不能承诺 SEO 收益 |
| p3 | “至少 300～500 字”才能摆脱薄内容 | Google 不要求这个固定字数；质量由用途、完整性、真实价值衡量 | 不设硬字数下限，允许短而高信息密度的项目页 |
| p3–p4 | Person.makesOffer 包裹 Offer/WebApplication 就能声明归属 | `makesOffer` 表示提供报价的关系，语义不适合直接表示“个人开发过的项目”；也不保证搜索结果增强 | 首页 WebSite + Person + ItemList；`/about/` 再考虑 ProfilePage；项目详情仅按内容合理使用 SoftwareApplication 等 |
| p3 | 主页只要是真实开发者主页即可规避 PBN | “不是 PBN”不等于所有人为互链都有效；Google 明确将**过度交换链接**列入链接垃圾政策 | 真实、少量、情境明确的链接；禁止全站关键词型交叉互链 |
| p4–p7 | Nuxt 3 + Tailwind + `nuxt generate`，Cloudflare Pages | 静态预渲染思路正确；但 Nuxt 3 官方维护期已于 2026-07-31 结束，目录和部署须按当前版本验证 | 新仓库优先 Nuxt 4；保留 Nuxt 3 迁移说明 |
| p4,p7 | 虚构/预填 `/tools/json-viewer` 作为深层链接 | 本次能核实的真实页面是 `https://tinystool.org/zh/tools/json/large-json-viewer/`，PDF 已提醒路径只是占位 | 项目链接数据强制核验，不可照搬占位路由 |
| p7 | 双向互链几天内将 madebytmy 收录 | 官方未保证抓取、索引或具体时间 | 上线后用 Search Console 与 Bing Webmaster Tools 验证，7/14/30 天观察 |
| p8 | Gemini 表示已创建 `madebytmy-portfolio.zip` | PDF 只有对话/代码输出文本，不包含真正可恢复的压缩包 | 本包重新编写，从不声称恢复了旧文件 |

## 已支持 / 未证实 / 禁止承诺

**官方支持**：Google 可通过可抓取的 `<a href>` 发现链接；Sitemap 有助于发现 URL；URL Inspection 提供检查线索；Google 的抓取与收录不作保证；正常 JSON-LD 可帮助表达实体语义；Cloudflare Crawler Hints 通过缓存信号向 IndexNow 通知变化。

**不可据此直接推断**：新域名的“权重”数字；加一条链接会让目标页排名涨多少；特定页面会被几天内收录；ProfilePage 标记会产生特殊搜索展示；简单互链可以修复 tinystool.org 的 Google “已抓取未编入索引”。

**工程取舍**：先发布高质量作品集与已验证项目详情，随后根据 Google Search Console 的实际覆盖率调整内容、内链、作者证据和技术问题。

## 关键参考

- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/essentials/spam-policies
- https://developers.google.com/search/docs/fundamentals/how-search-works
- https://www.bing.com/webmasters/help/URL-Inspection-55a30305
- https://www.bing.com/webmasters/help/site-explorer-c680da37
- https://nuxt.com/docs/4.x/community/roadmap/
