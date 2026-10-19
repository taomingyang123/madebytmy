# Independent Projects / 独立开发者作品集

Nuxt 4 portfolio at the project root, built as static HTML for Cloudflare Workers Static Assets or Pages. Run all commands directly from this directory. The previous template is preserved in `.backups/20261017-root-migration/`. `madebytmy-seo-plan/` contains the original requirements; `Evolve/` is unrelated and ignored.

## Local development

```sh
nvm install
nvm use
corepack enable
corepack prepare yarn@4.5.0 --activate
yarn install --immutable
yarn dev # http://127.0.0.1:3002/
```

Node **22.22.3** and Yarn **4.5.0**. Exact direct dependencies and a separate yarn.lock are included. Nuxt 4.6.1 needs newer Node than 22.17.0. The temporary runtime used during development is not a deployment dependency.

```sh
yarn typecheck
yarn lint
yarn test
yarn generate                # defaults to preview / noindex
yarn preview                 # http://127.0.0.1:4180
SITE_ENV=production yarn generate
SITE_ENV=production yarn check:seo
```

`generate` performs live HTTPS checks of public project links, prepares public-only data and static resources, runs Nuxt SSG, writes the complete 404 page, removes the 200 SPA fallback and checks the output. Network failure stops the build, with evidence in docs/evidence/external-links.json. The final output directory is `.output/public`; do not deploy source files or the entire workspace.

`typecheck` prepares generated source files for a clean checkout. Run the final `generate` after checks, with the desired environment. Preview is safe by default; production requires `SITE_ENV=production`. Never set this variable globally for preview deployments.

Browser acceptance (start `yarn preview` in another terminal):

```sh
yarn test:browser # installed Chrome
# Or: yarn playwright install chromium
# BROWSER_CHANNEL=chromium yarn test:browser
```

The GitHub Actions workflow is supplied for a separate repository. It has not been run remotely in this session. Its preview build defaults to noindex.

## Content

Edit `data/projects.json`; only `published` entries enter `app/data/published.json`. The latter is generated and ignored by Git. Drafts and archived entries stay out of public HTML, JS, JSON, sitemap and structured data. Published web projects need a unique slug, HTTPS URL, verified deep links, summary, problem and solution. Run checks after every edit. Publishing another project requires owner confirmation and real content; a successful URL request alone is not permission to publish it.

Site identity is in `shared/site.ts`. Missing biography, contacts, technology stack, dates and social accounts are deliberately omitted. See [Owner TODO](docs/OWNER-TODO.md).

## Delivery

- [Review and implementation plan](docs/REVIEW.md)
- [Verification](docs/QA.md)
- [Cloudflare Workers / Pages deployment and rollback](docs/DEPLOY.md)
- [Source tree](docs/FILE-TREE.txt)

No commits, remote repository creation, deployment or search-engine submissions are performed by the development scripts.

The existing Workers Builds project can keep `npx wrangler deploy`: the root `wrangler.jsonc` runs the full static `yarn generate` pipeline and deploys `.output/public` with a small redirect/404 handler. Set `SITE_ENV=production` in the production build environment; leave preview builds unset or preview. See the runbook for dashboard settings and local `yarn test:workers` acceptance.

## Root migration

See [migration and verification](docs/ROOT-MIGRATION.md). There is no separate madebytmy-portfolio application directory anymore. Root AGENTS.md / TASKS.md / MEMORY.md remain the collaboration entry points.

## Languages

English routes stay at `/`, `/projects/`, `/about/`, `/projects/tinys-tool/`. Simplified Chinese uses the matching `/zh/` prefix. The header switches to the corresponding page; it does not force language based on browser preferences. Shared layouts use `useSiteLanguage()` and `app/locales/en.json` / `zh.json`. Add translated public copy to both catalogs when extending content. SEO includes language-specific canonical and reciprocal en/zh-Hans/x-default links; SSG generates both versions. Draft projects remain excluded.

## 当前公开项目与站名

站点名称：Independent Projects / 独立开发者作品集。公开展示 Tiny’s Tool（https://tinystool.org/）、Tiny QR Toolkit（https://qr.tinystool.org/zh）和 Tiny Image（配置官网 https://image.tinystool.org/，当前不可达）。二维码项目详情位于 `/projects/qr-generator/` 与 `/zh/projects/qr-generator/`。

Tiny Image 已加入作品集，详情：`/projects/image-compression/`、`/zh/projects/image-compression/`。支持基于源码确认的本地图片处理、批量、对比和下载介绍；官网暂未连接成功，访问按钮暂不展示。
