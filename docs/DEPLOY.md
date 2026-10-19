# Cloudflare static deployment

The 2026-10-18 deployment log uses **Workers Builds** with `npx wrangler deploy`. Use the Workers settings below for that existing project. The app remains Nuxt SSG: no Nitro SSR server is deployed. Local verification does not establish a successful production release.

## Existing Workers project (F12)

| Setting | Value |
|---|---|
| Worker name | madebytmy, matching wrangler.jsonc |
| Root directory | Repository root |
| Node version | NODE_VERSION=22.22.3 |
| Package manager | Yarn 4.5.0 |
| Dashboard build command | Leave empty; Wrangler runs the configured build. Optional checks: yarn typecheck && yarn lint && yarn test |
| Deploy command | npx wrangler deploy |
| Production build variable | SITE_ENV=production, production environment only |
| Preview build variable | SITE_ENV=preview or unset |
| Assets directory | .output/public, set by wrangler.jsonc |

`wrangler.jsonc` supplies an explicit Worker entry and runs `yarn generate` before deployment. This prevents Wrangler's Nuxt auto-setup from choosing `yarn nuxt build` and an SSR preset. `generate` explicitly selects the static preset, runs the existing live external-link gate, creates both localized 404 documents, removes the SPA fallback, and verifies the generated HTML. Do not replace it with `yarn nuxt build` or deploy the server output.

The old `public/_redirects` absolute-source rule caused API error 100324 in Workers and has been removed. `workers/site.ts` redirects `www.madebytmy.com` to the apex with path/query intact, implements the published pages' canonical trailing slash and index.html aliases, and serves English/Chinese 404 responses with noindex. Non-apex hosts (including workers.dev) receive noindex even with production assets. Preview builds also carry the global noindex header prepared during generation.

After uploading these source changes to the connected repository, retry the failed deployment. Set SITE_ENV in the **build** environment, since robots and static headers are generated at build time. If the build reports an unavailable external project link, review docs/evidence/external-links.json and repair the link before retrying; do not bypass the gate. No account token belongs in the repository.

Add madebytmy.com and, if needed, www.madebytmy.com to the existing Worker's custom domains, configure HTTPS, and verify the response checks below. The Worker redirect requires requests for www to reach this Worker. Preserve preview protections. No custom domain or DNS changes are made by the source configuration.

For local acceptance, `npx wrangler dev --local --port 8788` builds assets and starts the Worker; run `yarn test:workers` in another terminal (defaults to http://127.0.0.1:8788). `yarn test:browser` also accepts `PREVIEW_URL=http://127.0.0.1:8788`. Wrangler rewrites the local request origin: to test domain-specific behavior, start additional local listeners with `--host www.madebytmy.com --upstream-protocol https --port 8789 --inspector-port 9231` and `--host madebytmy.com --upstream-protocol https --port 8790 --inspector-port 9232`. Pass `WORKERS_WWW_URL=http://127.0.0.1:8789 WORKERS_APEX_URL=http://127.0.0.1:8790 SITE_ENV=production yarn test:workers` for production assets, or SITE_ENV=preview for preview assets. These are local checks, not a deployment.

## Alternative: Cloudflare Pages

Pages remains an alternative for the same SSG assets. Its Git integration does not run `npx wrangler deploy`, does not use workers/site.ts, and needs domain redirect rules configured in Cloudflare. Choose the settings for the service actually being used.

| Setting | Value |
|---|---|
| Repository | Repository containing the root application |
| Root directory | Repository root |
| Production branch | main |
| Node version | NODE_VERSION=22.22.3 (check availability in selected Pages build image) |
| Package manager | Yarn 4.5.0, packageManager and yarn.lock |
| Install | corepack enable; corepack prepare yarn@4.5.0 --activate; yarn install --immutable |
| Build command | yarn typecheck && yarn lint && yarn test && yarn generate |
| Output | .output/public |
| Production variable | SITE_ENV=production, production environment only |
| Preview variable | SITE_ENV=preview or unset |
| Secrets / runtime services | None |

The application lives at the repository root. Do not use an SSR preset, `yarn build`, a dist guess, or SPA catch-all redirects.

## Preview

1. Import the separate repository via Pages Git integration. Enable Cloudflare Access for previews where available.
2. Ensure Preview SITE_ENV is unset or preview. Build emits `Disallow: /` and global `X-Robots-Tag: noindex, nofollow`. Canonical stays on madebytmy.com.
3. Check all 12 English/Chinese pages, external links, mobile, keyboard, console, and unknown path HTTP 404. robots alone is not an indexing guarantee; response headers/access protection are required.

## Production

1. Add madebytmy.com through Pages custom domains, configure the required DNS and wait for a valid certificate.
2. Set SITE_ENV=production only for production. Build again from the same revision.
3. Add www as a domain if used; configure its redirect to the apex with Cloudflare domain redirect rules. The Workers-only redirect handler is not run by Pages. Configure HTTPS at Cloudflare. Verify http/www/HTML aliases/trailing slash redirects and ensure no loops.
4. Configure the production project's pages.dev hostname to redirect to madebytmy.com using Cloudflare's supported domain redirect controls. Keep branch/hash Preview hosts protected. A production build's static _headers cannot alone distinguish its custom domain from pages.dev.
5. Validate HTTPS status 200 for `/`, `/projects/`, `/projects/tinys-tool/`, `/projects/qr-generator/`, `/projects/image-compression/`, `/about/`, their `/zh/` counterparts, `/robots.txt`, `/sitemap.xml`, `/og-default.png`; nonexistent and draft paths must return 404. Canonicals must match the sitemap. Public HTML must not carry noindex; 404 must.
6. Register Search Console and Bing Webmaster Tools, verify ownership, and submit sitemap only after these checks. Do not promise indexing or rankings. No IndexNow automation is included.

```sh
curl -I https://madebytmy.com/
curl -I http://madebytmy.com/
curl -I https://www.madebytmy.com/projects/
curl -I https://madebytmy.com/projects
curl -I https://madebytmy.com/does-not-exist/
curl -I https://madebytmy.com/projects/qr-generator/
curl -s https://madebytmy.com/robots.txt
curl -s https://madebytmy.com/sitemap.xml
```

Record revision, environment, deployment URL, response headers, and browser evidence. Local preview imitates static directory redirects and 404 but does not prove CDN behavior.

## Rollback

Select the last known good deployment in the chosen Cloudflare service, or revert the offending commit and redeploy. Recheck robots, sitemap, canonical, response statuses and assets after rollback. Failed external-link checks are release blockers: repair/remove the deep link or move the affected project to draft; don't bypass verification silently. Keep source and lockfile with the release.

## After launch

Day 0: technical response baseline and webmaster verification. Day 7: discovery/crawl diagnosis. Day 14: content, links and project detail review. Day 30: separate Google/Bing impressions and indexing review. These are observation windows, not indexing deadlines.
