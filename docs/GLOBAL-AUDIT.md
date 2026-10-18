# 全局复查 — 2026-10-17 / F10

范围为根目录作品集的三个项目、12个双语页面、生成脚本与本地预览。未修改其他项目、未提交或部署。

## 确认的问题与修正

1. Tiny Image 卡片标为项目介绍，详情却仍用已发布标识，且官网异常提示靠后。详情统一使用项目介绍，首屏及概览直接显示官网暂不可达。
2. production `_headers` 只包含根404的noindex项。补充 `/zh/404.html` 及产物断言；中文404 HTML本来已有noindex，本次补齐响应头一致性，不声称曾被搜索收录。
3. Sitemap统一硬编码一个日期，后续项目更新易与dateModified不一致。改为固定页面的显式编辑日期与项目contentUpdated各自驱动；未记录的日期不捏造。加入跨语言与缺失日期回归测试。
4. 浏览器路由用手写清单，新增项目有漏测风险。改为从公开项目注册表生成，补中文404语言与无结构化数据断言。
5. README旧站名、部署文档四页数量、二维码不稳定状态的英中文案不一致。同步当前名称、12页范围及状态表述。

JSON-LD特殊字符转义曾被怀疑，但测试确认原行为正确，不计为缺陷。提取序列化函数，补充script闭合字符不进入HTML且JSON解析还原原文的回归测试。

## 验证证据

- Node22.22.3、Yarn4.5.0：类型/lint/13项测试通过，docs/f10-{typecheck,lint,test}.log。
- production与Preview分别构建并通过12页HTML/canonical/hreflang/JSON-LD/Sitemap/robots/headers/草稿隔离检查；最终产物保留Preview noindex。docs/f10-production.log、docs/f10-preview.log、docs/f10-final-generate.log。
- 实际展示的46个外链HTTP检查通过，docs/evidence/external-links.json。
- Chrome48组页面/视口检查通过，零横向溢出、axe违规、控制台错误与第三方请求。12页无JS正文、6组中英文切换、三个项目导航、功能链接及禁用状态、301/404通过。docs/f10-browser.log、docs/evidence/browser.json。
- 开发环境中文不存在项目返回404、zh-Hans、无canonical且noindex；随后中英文正常详情返回200并具有正确canonical，无404 robots残留。
- 最后只提取了JSON-LD序列化函数，13项测试及最终生成再次通过；当前普通内容序列化结果不变，未重复全套浏览器检查。

## 尚未通过的外部事项

本次复查Tiny Image官网仍为TLS连接失败；二维码生成、美化、批量、优化4页均HTTP500。详见docs/evidence/f10-unavailable-links.json。保持不可用提示和按钮隐藏，未声称这些项目生产可用。

生产Cloudflare域名、实际CDN响应/重定向、真实索引与远端CI未在本地验收中证明；保留F04待办。本轮没有发现阻断本地作品集浏览的问题，但不作“零缺陷”或搜索排名承诺。3002开发服务交付时保持运行。
