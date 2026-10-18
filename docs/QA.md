# 验收记录

日期：2026-10-17（Asia/Shanghai）；JSON 原始时间为 UTC，16 日 16 时对应北京时间 17 日 00 时。

结论：本地开发交付通过；未部署，线上验收未执行。最终保留 `.output/public` 为 **Preview/noindex** 构建。正式发布必须用 `SITE_ENV=production yarn generate` 重新生成。

## 环境与范围

- macOS arm64；系统 Node 22.17.0 不满足新工程；最终命令使用 `/tmp/madebytmy-runtime/node_modules/node/bin/node` 22.22.3 和 Yarn 4.5.0。临时路径不属于交付运行要求，其他机器按 .nvmrc 安装即可。
- Nuxt 4.6.1、Vue 3.5.44、Vue Router 5.4.0、Tailwind 4.3.3、TypeScript 5.9.3。
- 浏览器：系统 Chrome 155，Playwright 1.64.1，axe-core/playwright 4.14.0；Lighthouse 12.8.2。
- 网络：npm 安装与 3 个公开 HTTPS 外链已实际访问。沙箱默认 DNS / tsx IPC / 本地监听受限，使用获准的沙箱外命令完成验证。
- Commit SHA：N/A，未提交、未创建远端仓库。旧模板源码保持；误执行父目录 install 的缓存刷新见 REVIEW.md 执行偏差记录。

## 第 1 层：静态 / 构建

| 命令 | 结果 | 证据 |
|---|---|---|
| yarn install --immutable | PASS，Yarn 4.5.0 锁文件可复用 | install-immutable.log |
| yarn typecheck | PASS，退出 0 | typecheck.log |
| yarn lint | PASS，退出 0，无诊断 | lint.log |
| yarn test | PASS，7/7 | test.log |
| SITE_ENV=production yarn generate | PASS，4 个公开路由 + 404 | generate.log |
| SITE_ENV=preview yarn generate | PASS，独立防索引规则 | generate-preview.log |
| check:seo（两种 generate 内部执行） | PASS | 上述构建日志末尾 |

产物检查逐页读取 HTML：唯一标题与描述、一个 H1、生产 canonical、正文、可抓取内链、外链 rel、OG/Twitter、JSON-LD、lang。核对 sitemap、robots、404 无 canonical/noindex、真实 PNG 分享图；递归扫描 HTML/JS/JSON/XML/map，未发现草稿 slug/URL。公开项目数 1。公开路由 `/`、`/projects/`、`/about/`、`/projects/tinys-tool/`；无 200.html SPA fallback。

Yarn 仍有 6 个上游包内部 peer 声明警告，详见 peer-requirements.log（Nuxt/devtools/ESLint 包内部的 Vue、TypeScript、Vite 声明）。根工程依赖已满足，devtools 禁用；类型/lint/构建/浏览器均实际通过，不等于声称依赖零警告。

## 第 2 层：运行时

- `yarn dev --host 127.0.0.1 --port 3001` 启动成功；curl 首页 HTTP 200，`/projects/not-published/` HTTP 404。dev.log 的 Project not found 是该主动错误路径测试；已停止开发服务器。
- `yarn preview` 静态服务器正常；首页 HTTP 200。该本地服务器固定返回 X-Robots-Tag noindex，避免预览被索引。
- 外链检查 3/3 HTTP 200，最终地址保持原尾斜杠路径；见 evidence/external-links.json。每次 generate 自动重检。
- 生产公开 `_headers` 不带全站 noindex，404 独立 noindex；Preview `_headers` 全站 noindex，robots Disallow；两种模式均通过产物断言。生产 CDN 响应头仍需线上核实。

## 第 3 层：本地代表场景

`yarn test:browser` PASS（browser.log、evidence/browser.json）：

- 四个页面 × 320/375/768/1280px，共 16 组；无横向溢出。
- axe WCAG 2 A/AA、2.1 A/AA 自动检查均为零违规。它不能替代人工/真机/屏幕阅读器审计。
- 键盘 Tab 首次聚焦跳转链接，Enter 将焦点移到正文。
- 首页 → 项目列表 → 详情 → About 实际点击，SPA canonical 跟随页面更新。
- 无控制台错误、无 hydration 警告、无第三方请求。
- 禁用 JS 后四页都有正文与 H1，首页到项目列表链接实际可用。
- 未知路径、未知 slug、草稿 slug 实际返回 404，无 canonical，带 noindex。
- 三个无尾斜杠路径返回 301 到尾斜杠路径（本地服务器行为；不代表 CDN 已验收）。

已人工查看桌面/手机首页及项目详情截图：evidence/home-1280.png、home-375.png、project-1280.png。文字、卡片和页面层级无重叠或截断。

Lighthouse 移动模拟最终首页：Performance **97**、Accessibility **100**、Best Practices **100**、SEO **66**（evidence/lighthouse.report.html/json）。SEO 低分来自本地服务器主动返回的 noindex，不以此宣称线上 SEO 分数通过。早一轮性能为 96，修复后最终为 97；属于本地实验室采样，不是实际用户 Web Vitals。静态 SEO 内容断言通过，生产 Lighthouse/HTTPS/索引验收仍待执行。

## 修复记录

初次安装遇到新 Nuxt 要求的 Vue Router 5 插件不兼容、SSR shared 相对导入路径错误，分别固定 Router 5.4.0、采用 #shared 别名和显式 .nuxt 构建目录解决。浏览器发现浅色辅助文字对比度不足及带装饰文本的链接可访问名称不一致，均已修复并复测。临时工具版本漂移已纠正，最终安装/构建使用声明环境。

## 未执行

Cloudflare Pages Preview / 正式部署、GitHub Actions 远端运行、域名与证书、真实 www/http/pages.dev 重定向、CDN 缓存与响应头、真实手机/屏幕阅读器、生产 Lighthouse/Web Vitals、搜索引擎后台/提交/索引情况。它们不是 PASS。后续见 DEPLOY.md 与 OWNER-TODO.md。

不提供不存在的联系方式、真实姓名、发布日期、技术栈、项目截图或使用指标。未公开 QR/OurTable/IP/图压缩项目。未修改工具站、未提交、未部署、未推送搜索通知。
