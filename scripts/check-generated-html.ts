import { contentDate } from './content-dates'
import { bilingualRoutes, basePath } from '../shared/languages'
import { readFile, readdir, stat } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { join } from 'node:path'
import { load } from 'cheerio'
import projects from '../data/projects.json'
import { validateProjects } from './registry'
import { site, fixedRoutes } from '../shared/site'
import type { Project } from '../types/project'
const output = '.output/public'
const published = validateProjects(projects as Project[])
const routes = bilingualRoutes([...fixedRoutes, ...published.map(p => `/projects/${p.slug}/`)])
const titles = new Set<string>(), descriptions = new Set<string>()
const htmlFiles = new Set(routes.map(r => join(output, r, 'index.html')))
htmlFiles.add(join(output, '404.html'))
htmlFiles.add(join(output, 'zh/404.html'))
for (const route of routes) {
  const $ = load(await readFile(join(output, route, 'index.html'), 'utf8'))
  assert(!/\bTMY\b/i.test($('body').text() + $('title').text()), `${route}: no personal branding`)
  const title = $('title').text(), description = $('meta[name="description"]').attr('content')!
  assert(title && !titles.has(title), `${route}: unique title`); titles.add(title)
  assert(description && !descriptions.has(description), `${route}: unique description`); descriptions.add(description)
  assert.equal($('h1').length, 1, `${route}: one H1`)
  assert($('h1').text().trim().length > 3, `${route}: nonempty H1`)
  assert.equal($('link[rel="canonical"]').length, 1)
  assert.equal($('link[rel="canonical"]').attr('href'), site.origin + route)
  assert.equal($('html').attr('lang'), route.startsWith('/zh/') ? 'zh-Hans' : 'en')
  if (route.startsWith('/zh/')) assert(/[\u4e00-\u9fff]/.test(description), `${route}: translated description`)
  for (const [lang, path] of [['en', basePath(route)], ['zh-Hans', '/zh' + basePath(route)], ['x-default', basePath(route)]]) assert.equal($(`link[hreflang="${lang}"]`).attr('href'), site.origin + path)
  assert(!$('meta[name="robots"]').attr('content')?.includes('noindex'), `${route}: public content meta`)
  for (const [key, value] of Object.entries({ title, description, url: site.origin + route, image: site.origin + '/og-default.png' })) assert.equal($(`meta[property="og:${key}"]`).attr('content'), value)
  assert.equal($('meta[name="twitter:card"]').attr('content'), 'summary_large_image')
  assert($('main').text().trim().length > 150, `${route}: prerendered body`)
  for (const element of $('script[type="application/ld+json"]').toArray()) JSON.parse($(element).text())
  if (route === '/' || route === '/about/') assert.equal($('script[type="application/ld+json"]').length, 1)
  const currentProject = published.find(p => basePath(route) === `/projects/${p.slug}/`)
  if (currentProject) {
    if (currentProject.websiteAvailable !== false) {
      const expectedWebsite = route.startsWith('/zh/') && currentProject.websiteZhUrl ? currentProject.websiteZhUrl : currentProject.websiteUrl
      assert.equal($('.detail-intro a.button').attr('href'), expectedWebsite)
      const data = JSON.parse($('script[type="application/ld+json"]').text())['@graph']
      assert.equal(data.find((node: { '@type': string }) => node['@type'] === 'WebPage').about.url, expectedWebsite)
    }
    if (currentProject.websiteAvailable === false) {
      assert.equal($(`a[href="${currentProject.websiteUrl}"]`).length, 0)
      assert($('.detail-intro .availability-note').text().trim(), `${route}: website status visible before content`)
    }
    const graph = JSON.parse($('script[type="application/ld+json"]').text())['@graph']
    assert(graph.some((node: { '@type': string }) => node['@type'] === 'BreadcrumbList'), `${route}: breadcrumbs`)
    for (const group of currentProject.featureGroups ?? []) for (const feature of group.items) {
      if (!feature.url) continue
      const target = route.startsWith('/zh/') && feature.zhUrl ? feature.zhUrl : feature.url
      assert.equal($(`a[href="${target}"]`).length > 0, feature.available, `${route}: feature link ${target}`)
    }
    assert.equal($('.feature-items li').length, currentProject.featureGroups?.reduce((count, group) => count + group.items.length, 0))
  }
  for (const element of $('a[href]').toArray()) {
    const a = $(element), href = a.attr('href')!
    if (href.startsWith('/') && !href.startsWith('//')) assert(routes.includes(href), `${route}: unknown internal link ${href}`)
    if (a.attr('target') === '_blank') assert(/noopener/.test(a.attr('rel') ?? '') && /noreferrer/.test(a.attr('rel') ?? ''))
  }
  console.log(`PASS ${route}: HTML, metadata, body, links`)
}
const xml = load(await readFile(join(output, 'sitemap.xml'), 'utf8'), { xml: true })
assert.deepEqual(xml('loc').toArray().map(e => xml(e).text()).sort(), routes.map(r => site.origin + r).sort())
for (const node of xml('url').toArray()) {
  const route = xml(node).find('loc').text().slice(site.origin.length)
  assert.equal(xml(node).find('lastmod').text(), contentDate(route, published) ?? '')
}
const robot = await readFile(join(output, 'robots.txt'), 'utf8'), headers = await readFile(join(output, '_headers'), 'utf8')
assert(robot.includes(`Sitemap: ${site.origin}/sitemap.xml`))
if (process.env.SITE_ENV === 'production') { assert(robot.includes('Allow: /')); assert(!headers.split('/404.html')[0]!.includes('noindex')) }
else { assert(robot.includes('Disallow: /')); assert(headers.split('/404.html')[0]!.includes('noindex')) }
assert(headers.includes('/zh/404.html\n  X-Robots-Tag: noindex, nofollow'), 'Chinese 404 response header')
const error = load(await readFile(join(output, '404.html'), 'utf8'))
assert(error('meta[name="robots"]').attr('content')?.includes('noindex')); assert.equal(error('link[rel="canonical"]').length, 0); assert.equal(error('h1').length, 1)
assert((await stat(join(output, 'og-default.png'))).size > 1000)
const forbidden = projects.filter(p => p.status !== 'published').flatMap(p => [p.slug, p.websiteUrl]).filter(Boolean) as string[]
async function scan(dir: string): Promise<void> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name)
    if (entry.isDirectory()) { await scan(file); continue }
    if (file.endsWith('.html')) assert(htmlFiles.has(file), `Unexpected HTML: ${file}`)
    if (/\.(html|js|json|xml|txt|map)$/.test(file)) {
      const text = await readFile(file, 'utf8')
      for (const value of forbidden) assert(!text.includes(value) && !text.includes(value.replaceAll('/', '\\/')), `Draft leaked in ${file}: ${value}`)
    }
  }
}
await scan(output)
console.log(`PASS sitemap, robots, headers, 404, OG image and all output files: ${routes.length} public routes; no draft data`)
