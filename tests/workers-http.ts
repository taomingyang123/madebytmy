import assert from 'node:assert/strict'
import { load } from 'cheerio'
import published from '../app/data/published.json'
import { bilingualRoutes } from '../shared/languages'
import { fixedRoutes, site } from '../shared/site'

const origin = process.env.WORKERS_URL ?? 'http://127.0.0.1:8788'
const routes = bilingualRoutes([...fixedRoutes, ...published.map(project => `/projects/${project.slug}/`)])
const get = (path: string, init?: RequestInit) => fetch(origin + path, { redirect: 'manual', ...init })
for (const route of routes) {
  const response = await get(route)
  assert.equal(response.status, 200, route)
  assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/, 'local / preview hosts stay noindex')
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
  const $ = load(await response.text())
  assert.equal($('html').attr('lang'), route.startsWith('/zh/') ? 'zh-Hans' : 'en')
  assert.equal($('link[rel="canonical"]').attr('href'), site.origin + route)
  assert.equal($('h1').length, 1)
  const script = $('script[src]').first().attr('src')!
  assert(script?.startsWith('/_nuxt/'))
  assert.equal((await get(script)).status, 200)
  for (const alias of [route + 'index.html', ...(route === '/' ? [] : [route.slice(0, -1)])]) {
    const redirect = await get(alias + '?source=check')
    assert.equal(redirect.status, 301, alias)
    assert.equal(redirect.headers.get('location'), route + '?source=check')
  }
}
for (const path of ['/missing/', '/missing/index.html', '/projects/ip-checker/', '/404.html', '/zh/missing/', '/zh/projects/ip-checker/', '/zh/404.html']) {
  const response = await get(path)
  assert.equal(response.status, 404, path)
  assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/)
  const $ = load(await response.text())
  assert.equal($('html').attr('lang'), path.startsWith('/zh/') ? 'zh-Hans' : 'en')
  assert.equal($('link[rel="canonical"]').length, 0)
}
for (const path of ['/%2Fexample.com/x/index.html', '/%5Cexample.com/x/index.html', '/%0Aprojects/index.html', '/%FF']) {
  const response = await get(path)
  assert.equal(response.status, 400, path)
  assert.equal(response.headers.get('location'), null)
}
// A cached error document must never turn into an empty 404 when ASSETS would
// normally answer a conditional request with 304.
for (const path of ['/missing/', '/zh/missing/', '/404.html', '/zh/404.html']) {
  const initial = await get(path)
  const body = await initial.text()
  const etag = initial.headers.get('etag')
  assert(etag, `${path}: real asset cache validator`)
  for (const headers of [{ 'If-None-Match': etag }, { Range: 'bytes=0-30' }]) {
    const response = await get(path, { headers })
    assert.equal(response.status, 404)
    assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/)
    assert.equal(await response.text(), body, `${path}: complete error body with ${JSON.stringify(headers)}`)
  }
}
// Wrangler rewrites the origin in local mode. Supply additional local listeners
// started with --host and --upstream-protocol https for domain-specific checks.
if (process.env.WORKERS_WWW_URL) {
  const www = await fetch(process.env.WORKERS_WWW_URL + '/zh/projects/?source=check', { redirect: 'manual' })
  assert.equal(www.status, 301)
  assert.equal(www.headers.get('location'), site.origin + '/zh/projects/?source=check')
}
if (process.env.WORKERS_APEX_URL) {
  const apex = await fetch(process.env.WORKERS_APEX_URL + '/')
  assert.equal(apex.status, 200)
  if (process.env.SITE_ENV === 'production') assert.equal(apex.headers.get('x-robots-tag'), null)
  else assert.match(apex.headers.get('x-robots-tag') ?? '', /noindex/)
}
const head = await get('/zh/projects/', { method: 'HEAD' })
assert.equal(head.status, 200)
assert.equal(await head.text(), '')
assert.equal((await get('/', { method: 'POST' })).status, 405)
for (const path of ['/robots.txt', '/sitemap.xml', '/og-default.png', '/favicon.svg']) assert.equal((await get(path)).status, 200, path)
console.log(`PASS Workers: ${routes.length} pages, JS assets, canonical aliases/query, localized 404, unsafe paths, HEAD/405, SEO resources; www=${Boolean(process.env.WORKERS_WWW_URL)}, apex=${Boolean(process.env.WORKERS_APEX_URL)}`)
