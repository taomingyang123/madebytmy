# 方案审查与执行计划

审查日期：2026-10-17（Asia/Shanghai）。输入：`madebytmy-seo-plan/README.md`、docs/01–11、examples 两份 JSON、SEO checklist、OWNER-DECISIONS；原始 PDF 不在本次输入中，不宣称重新审查 PDF 原文。

结论：通过，按以下修正实施。用户已授权审查后直接开发；范围为本地工程及验收，不包含创建远端仓库、提交、发布、DNS 或搜索引擎操作。

## 发现与处理

| 级别 | 发现 | 实施决策 |
|---|---|---|
| P1 | 根目录仍是 Nuxt 3 模板、双语、Worker 和可选统计，不能照搬为新站 | 新建 `madebytmy-portfolio/` 独立工程，旧业务文件保留；未来可独立建仓库 |
| P1 | 仅在 UI 过滤草稿仍可能把全部 registry 打包进 JS | 原始 registry 仅供构建；生成 app/data/published.json；产物扫描 HTML/JS/JSON/XML/map |
| P1 | Nuxt 默认 SPA fallback 可能掩盖缺失路径 | 输出完整静态 404.html，移除 200.html；错误页 noindex、无 canonical；Pages 真实状态需线上验收 |
| P1 | Preview 与生产索引要求不同 | SITE_ENV 默认 preview：robots 禁止抓取、全站 X-Robots-Tag；仅生产环境显式设 production；另配 Cloudflare Access |
| P1 | “Node 22”不足以表达新 Nuxt 引擎要求 | Nuxt 4.6.1 要求 ^22.22.3 / ^24.15.0 / >=26；本地旧 Node 22.17.0 不满足，独立临时运行时验证，.nvmrc 锁定 22.22.3 |
| P2 | 日期/技术栈/个人资料未知，示例文案可能被当事实 | 不公开姓名、邮箱、GitHub、上线日期、项目技术栈、指标或截图；显示 TMY；仅英文 |
| P2 | 详情要求作者取舍，但没有原开发记录 | 只写已提供的目标、可核验功能、范围边界；不编造实现经历或性能结论；深入技术记录待作者补充 |
| P2 | 方案对 404 也要求自引用 canonical，与错误页规则冲突 | 公开页面独立 title/description/H1/canonical；404 独立标题、描述、H1，但无 canonical 且 noindex |
| P2 | 301 主域与 HTTPS 不能仅靠 Nuxt 静态配置承诺 | 提供 www _redirects；HTTPS、DNS、pages.dev、证书、线上状态作为发布清单，不能在本地宣布通过 |
| P2 | Seed 的 verified=true 只是历史事实 | 每次 generate 对公开 URL 发实际 HTTPS GET；失败即停止；记录最终地址/状态，不自动公开其他项目 |

## 核实依据

- [Nuxt roadmap](https://nuxt.com/docs/4.x/community/roadmap/) 与 [Nuxt 维护讨论](https://github.com/nuxt/nuxt/discussions/33918)：Nuxt 3 维护截止 2026-07-31；新工程使用 Nuxt 4。
- [Nuxt 静态部署](https://nuxt.com/docs/4.x/getting-started/deployment)：generate 预渲染 HTML，核对实际 `.output/public`。
- [Tailwind 官方 Nuxt 集成](https://tailwindcss.com/docs/installation/framework-guides/nuxt)：采用 @tailwindcss/vite 和 CSS import。
- [Cloudflare Pages 静态路径与 404](https://developers.cloudflare.com/pages/configuration/serving-pages/)：目录 index.html 对应尾斜杠 URL；顶层 404.html 阻止默认 SPA 路由 fallback。
- npm 实际查询：Nuxt 4.6.1、Vue 3.5.44、Vue Router 5.4.0；版本和引擎以 package.json/yarn.lock 为准。
- Tiny’s Tool 首页、工具列表、中文大 JSON 页重新读取成功，HTTP 证据见 evidence/external-links.json。可访问不等于对工具安全性作全量审计。

## 开发顺序与文件

1. 工程与发布门禁：package.json/yarn.lock/.nvmrc、types/project.ts、data/projects.json、shared/site.ts、scripts/registry.ts、scripts/prepare.ts、registry tests。
2. 页面：app/app.vue、components 导航/页脚/项目卡片/插画、pages 首页/projects/动态详情/about、error.vue、响应式 CSS。
3. SEO：useSeo、显式预渲染白名单、生成 robots/sitemap/OG、静态 404、产物检查、外链检查。
4. 验收：类型、lint、单测、generate、浏览器导航/键盘/响应式、HTTP、无 JS；保存命令和真实结果。
5. 交付：README、部署/回滚说明、作者 TODO、文件树、验收报告。线上验收独立记录为未执行。

公开路由：`/`、`/projects/`、`/projects/tinys-tool/`、`/about/`；404 为静态错误文件。Tiny’s Tool published；其余 seed 项目 draft。未列出的小游戏不编造名称或 URL。

## 设计

暖白、蓝色文字强调、浅绿工具主题插画、大字号标题。插画为装饰性的代码纸张，不作为产品真实截图；不增加头像、合作品牌或业绩数字。系统字体，无远程字体请求、分析脚本、CMS、账号或后端 API。

## 执行偏差记录

临时 npm 工具安装曾自动升级其 Node/Yarn；最终将其精确固定为 22.22.3/4.5.0，并重跑 immutable 安装和全部适用验证。排查时有一次 Yarn install 误在父目录执行：旧模板 package.json、yarn.lock、.yarnrc.yml 的修改时间保持原样，未编辑旧业务源文件；其依赖构建缓存/.nuxt 和 install-state 可能刷新。原始输出见 evidence/root-install-invocation.log；不据此宣称 F02 基线通过。
