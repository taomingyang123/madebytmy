# F12 · Cloudflare Workers 部署修复

## 问题与修复

用户的 2026-10-18 日志显示：`npx wrangler deploy` 在缺少根配置时自动初始化 Nuxt SSR，执行 `yarn nuxt build`，随后上传版本失败，API 100324：`Invalid _redirects configuration: Line 1: Only relative URLs are allowed.` 对应原 public/_redirects 中的绝对来源域名规则。

- 新增根目录 wrangler.jsonc，Worker 名保持 madebytmy，入口 workers/site.ts，资源为 .output/public；build.command 使用完整 `yarn generate`。
- generate 显式使用 `nuxt generate --preset static`，保留外链检查、数据准备、双语 404、SPA fallback 移除和生成后 SEO 检查。
- 移除 public/_redirects。Worker 实现 www → 主域名、公开页面尾斜杠/index.html 301，保留查询参数；异常编码返回 400，不存在或草稿路径返回真实双语 404。
- 生产主域名遵守生成的索引策略，其他访问来源增加 noindex，防止生产 workers.dev 副本被索引；Preview 产物在主域名也保持 noindex。
- Worker 通过独立 tsconfig.workers.json 纳入 typecheck；新增真实本地 HTTP 验收命令 yarn test:workers。未新增依赖，未修改 yarn.lock。
- 更新 README、部署说明、所有者待办和协作记录；Pages 作为静态部署替代方案保留，www 跳转需在 Cloudflare 配置。

## 验证环境

2026-10-19 Asia/Shanghai；macOS arm64，Node 24.16.0（满足 engines），Yarn 4.5.0，本机已缓存 Wrangler 4.96.0 / workerd，已安装 Chrome。Worker 使用兼容日期 2026-06-05，与本机运行时支持范围一致；Nuxt 自身的 compatibilityDate 未改。

用户云端日志的工具为 Node 22.22.3 / Wrangler 4.151.1；未冒充为本次本地版本。此次没有安装依赖、联网查文档、批量抓取外链、上传或部署。

## 三层结果

### 1. 静态

- `yarn typecheck`：通过，包含 Nuxt 和新 Worker 的独立 TypeScript 检查。
- `yarn lint`：通过。
- `yarn test`：14 项通过。
- production 和 preview 均逐步执行 `tsx scripts/prepare.ts`、`nuxt generate --preset static`、`tsx scripts/finalize.ts`、`tsx scripts/check-generated-html.ts`：12 个双语页面的 HTML、元信息、sitemap、robots、headers、404、分享图与草稿隔离通过。
- Preview 构建额外设置 `NITRO_PRESET=cloudflare-module` 模拟部署环境；命令行显式 static 成功覆盖它，日志确认 `Nitro preset: static`。
- Wrangler `deploy --dry-run`：通过，读取 56 个资源文件，绑定 ASSETS，打包 Worker 22.29 KiB；没有上传。验证用临时配置只省略已分步执行的 build.command，并将入口/资源路径解析为绝对路径，其他运行配置与根配置相同。
- `git diff --check` 与变更文档链接/任务计数检查通过。

### 2. 运行时

使用缓存 Wrangler `dev --local` 和真实本地 ASSETS 绑定，不以 Mock 替代运行验收。production 和 preview 各执行一轮 `yarn test:workers`，均通过：

- 12 页 200、正确语言和 canonical、JS 资源、nosniff。
- 公开页面 index.html/无尾斜杠 301，查询参数保留。
- 未知页面、草稿和直接访问错误文档均返回对应语言的 404/noindex。
- 编码斜杠、反斜杠、控制字符及无效 UTF-8 路径返回 400，无 Location。
- www → 主域名 301，路径与查询参数保留；HEAD 无响应体、POST 返回 405；robots/sitemap/图标可用。
- 分别在 8789/8790 用 `--host www.madebytmy.com` / `--host madebytmy.com` 与 `--upstream-protocol https` 模拟真实来源。production 主域名无 noindex；Preview 主域名有 noindex；普通本地来源在两种构建中均有 noindex。这些主机名模拟没有访问线上域名。

### 3. 系统级（本地真实场景）

`PREVIEW_URL=http://127.0.0.1:8788 yarn test:browser` 通过：48 组响应式/可访问性页面场景，键盘、双语切换、项目导航、无 JS 导航、HTTP 301/400/404；无浏览器错误、无第三方请求。报告见 [Workers 浏览器证据](evidence/f12-workers-browser.json)。

开发服务在 http://127.0.0.1:3002/ 保留；中文首页实际 HTTP 200。测试用 Workers 监听器已关闭；最终 .output/public 为 Preview/noindex。

## 证据与限制

本地命令日志（沿用项目 *.log 忽略约定）：docs/f12-typecheck.log、f12-lint.log、f12-test.log、f12-production.log、f12-preview.log、f12-wrangler-dry-run.log、f12-workers-http-production.log、f12-workers-http-preview.log、f12-browser.log、f12-dev.log。

未重新执行包含 50 个外链请求的完整 `yarn generate`，本地只验证其离线构建阶段；实际部署的 build.command 仍调用完整流程，保留原外链发布门禁，没有增加跳过开关。外链的最新可用性未验证。

Cloudflare API 成功发布、构建环境变量、真实自定义域名、DNS/HTTPS 与 CDN 行为仍未验证，继续由 F04 验收。修复初次交付没有执行 Git 提交；用户随后授权提交本次本地修复，不包含推送或实际部署。

## 部署续接

把本次源码改动上传至当前 Workers Builds 连接的仓库后，按 [部署说明](DEPLOY.md) 重试：构建命令留空或仅运行 typecheck/lint/test，部署命令保持 `npx wrangler deploy`，生产构建环境设 `SITE_ENV=production`，Preview 不设置或设 preview。Wrangler 会自行执行完整 generate。生产域名和 www 必须实际绑定到该 Worker，相关线上验收不由本地通过替代。
