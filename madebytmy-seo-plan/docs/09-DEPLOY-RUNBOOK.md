# 09 · GitHub + Cloudflare Pages 部署与回滚手册

## 部署模式

**选择：纯静态 Nuxt 4 SSG**。`npx nuxt generate` 生成静态文件，然后由 Pages 作为静态资源服务。该模式不需要 Workers、数据库或运行时服务端函数。

注意 Cloudflare 的通用 Nuxt Pages 指南常使用 `npm run build` + `dist`（其框架预设 / 动态部署路线），本项目应以**实际静态产物**为准：

| 设置 | 本项目静态路线 |
|---|---|
| Git provider | GitHub |
| 仓库 | `madebytmy-portfolio` |
| 生产分支 | `main` |
| Node | 22.x LTS（锁定并核对 Cloudflare 支持情况） |
| 安装 | Pages 自动识别，推荐设置与仓库锁文件一致的包管理器 |
| Build command | `yarn generate`（如用 npm 则 `npm run generate`） |
| Build output directory | `.output/public`（**必须先经真实构建验证**） |
| 环境变量 | 不应需要敏感密钥；可按要求设置 Node 版本变量 |
| 正式域名 | `madebytmy.com` |
| 临时预览 | `*.pages.dev`，不得成为规范 URL |

**不要**把 Nuxt 2 的 `dist`、Nuxt 3 静态 `.output/public`、Nuxt 动态构建输出，以及通用 Cloudflare 建站模板默认 `dist` 混为一谈。

## 上线流程

1. 运行全部测试并留存报告；检查 `generated HTML` 包含内容、JSON-LD 与真外链；确认 `draft` 不出现在输出中。
2. 创建新的 GitHub repo，`git push` 到 `main`。禁用仓库明文密钥，并添加适当 `.gitignore`（`.nuxt`, `.output`, `node_modules`）。
3. Cloudflare Pages → 新建应用 → 导入 Git 仓库（创建时选择 Git Integration，避免日后无法给 Direct Upload 项目无缝追加 Git Integration）。
4. 配置静态构建和 output 目录，先由 `*.pages.dev` Preview 检查导航、详情页、图片、robots / sitemap、404。
5. 生产域名添加 `madebytmy.com`；按照 Cloudflare 说明配 DNS 与 HTTPS，www 与 http 归一，检查避免重定向循环。
6. 确保所有 canonical/OG URL 为最终 `https://madebytmy.com/...`，不是 pages.dev / localhost。
7. 再将域名注册到 Google Search Console / Bing Webmaster Tools 并提交 sitemap；不能先声称收录完成。

## DNS/域名规范

- `madebytmy.com` 为 primary host；`www.madebytmy.com` 可重定向到 apex；强制 HTTPS。
- 同一页面不应通过 http/https、www/apex、尾斜杠差异返回多份 200；允许一跳 301/308 到 canonical。
- CDN 缓存更新可能异步，验证首页 HTML、`/robots.txt` 和 sitemap 的响应内容都来自最新一次生产构建。
- 设定 Preview 环境避免被搜索引擎编入索引：最佳实践是访问控制 / authentication；辅助 `X-Robots-Tag: noindex` 适合能保证响应头生效的方案；不要误把生产也挡住。

## robots 示例

```text
User-agent: *
Allow: /

Sitemap: https://madebytmy.com/sitemap.xml
```

这是**生产**示例，必须与真实公开页面和定稿 sitemap 一致。

## Sitemap 生成建议

最初可以生成公开固定页面和 `published` registry 项目详情（XML 序列化要 escape），不要手写整个大列表并长期维护。新增项目时同步生成，确保通过 static output 验收。

如果后期有语言版本，逐项维护各语言规范 URL 与 `hreflang`；在只有英文的首版禁止生成空的中文替代页。

## 回滚与故障处理

- 构建失败：回到 GitHub workflow / Pages Build Log，先在相同 Node / 包管理器环境复现。
- 静态路径 404：检查 `.output/public` 是否真的有对应目录 HTML；必要时手动指定 prerender routes。
- 内容缺失：检查是否意外 client-only 渲染；直接 curl 源 HTML，而非只看运行完 JS 的浏览器 DOM。
- 链接失效：将对应 project 标草稿或先撤掉失效 deep link，更新并部署。
- 生产错误：Cloudflare Pages 历史部署中选择已知良好版本回滚，或者将 `main` revert 并重新部署；记录 commit SHA。
- Google 收录慢：不靠重复提交来保证，优先重新检查状态和内容；无技术问题则耐心监测。

## 预发布检查关键命令

```sh
# 本地
node -v
yarn typecheck && yarn lint && yarn test && yarn generate
find .output/public -maxdepth 4 -type f | sort
# 线上，替换生产部署后执行
curl -IL https://madebytmy.com/
curl -IL https://madebytmy.com/projects/
curl -IL https://madebytmy.com/robots.txt
curl -IL https://madebytmy.com/sitemap.xml
```

Nuxt / Cloudflare 官方参考：
- https://developers.cloudflare.com/pages/framework-guides/deploy-a-nuxt-site/
- https://developers.cloudflare.com/pages/configuration/build-configuration/
- https://nuxt.com/docs/4.x/community/roadmap/
