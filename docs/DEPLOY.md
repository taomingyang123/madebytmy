# Cloudflare Pages: static deployment

This runbook is preparation, not evidence of a live deployment.

| Setting | Value |
|---|---|
| Repository | Separate madebytmy-portfolio repository, containing this directory's contents |
| Root directory | `/` in that separate repository |
| Production branch | main |
| Node version | NODE_VERSION=22.22.3 (check availability in selected Pages build image) |
| Package manager | Yarn 4.5.0, packageManager and yarn.lock |
| Install | corepack enable; corepack prepare yarn@4.5.0 --activate; yarn install --immutable |
| Build command | yarn typecheck && yarn lint && yarn test && yarn generate |
| Output | .output/public |
| Production variable | SITE_ENV=production, production environment only |
| Preview variable | SITE_ENV=preview or unset |
| Secrets / runtime services | None |

The application now lives at the repository root; use `/` as the Pages root directory. Do not use the Worker preset, `yarn build`, a dist guess, or SPA catch-all redirects.

## Preview

1. Import the separate repository via Pages Git integration. Enable Cloudflare Access for previews where available.
2. Ensure Preview SITE_ENV is unset or preview. Build emits `Disallow: /` and global `X-Robots-Tag: noindex, nofollow`. Canonical stays on madebytmy.com.
3. Check all 12 English/Chinese pages, external links, mobile, keyboard, console, and unknown path HTTP 404. robots alone is not an indexing guarantee; response headers/access protection are required.

## Production

1. Add madebytmy.com through Pages custom domains, configure the required DNS and wait for a valid certificate.
2. Set SITE_ENV=production only for production. Build again from the same revision.
3. Add www as a domain if used; `_redirects` sends it to the apex. Configure HTTPS at Cloudflare. Verify http/www/HTML aliases/trailing slash redirects and ensure no loops.
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

Select the last known good production deployment in Pages, or revert the offending commit and redeploy. Recheck robots, sitemap, canonical, response statuses and assets after rollback. Failed external-link checks are release blockers: repair/remove the deep link or move the affected project to draft; don't bypass verification silently. Keep source and lockfile with the release.

## After launch

Day 0: technical response baseline and webmaster verification. Day 7: discovery/crawl diagnosis. Day 14: content, links and project detail review. Day 30: separate Google/Bing impressions and indexing review. These are observation windows, not indexing deadlines.
