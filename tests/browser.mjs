import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import assert from 'node:assert/strict'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
const origin = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4180'
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL ?? 'chrome', headless: true })
const registry = JSON.parse(await readFile('data/projects.json', 'utf8'))
const englishRoutes = ['/', '/projects/', '/about/', ...registry.filter(p => p.status === 'published').map(p => `/projects/${p.slug}/`)]
const routes = englishRoutes.flatMap(route => [route, '/zh' + route])
const report = { checkedAt: new Date().toISOString(), pages: [], navigation: [], noJs: [], http: [] }
await mkdir('docs/evidence', { recursive: true })
try {
  for (const width of [320, 375, 768, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
    const page = await context.newPage()
    const errors = [], remote = []
    page.on('pageerror', e => errors.push(e.message))
    page.on('console', m => { if (m.type() === 'error' || /hydration/i.test(m.text())) errors.push(m.text()) })
    page.on('request', r => { if (!r.url().startsWith(origin) && !r.url().startsWith('data:')) remote.push(r.url()) })
    for (const route of routes) {
      const response = await page.goto(origin + route, { waitUntil: 'networkidle' })
      assert.equal(response.status(), 200)
      assert.equal(await page.locator('h1').count(), 1)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
      assert(!overflow, `${width} ${route}: horizontal overflow`)
      const a11y = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
      report.pages.push({ width, route, overflow, violations: a11y.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })) })
      if (route === '/zh/' && [320, 1280].includes(width)) await page.screenshot({ path: `docs/evidence/zh-home-${width}.png`, fullPage: true })
      if (route === '/' && [375, 1280].includes(width)) await page.screenshot({ path: `docs/evidence/home-${width}.png`, fullPage: true })
      if (route === '/projects/tinys-tool/' && width === 1280) await page.screenshot({ path: 'docs/evidence/project-1280.png', fullPage: true })
    }
    assert.deepEqual(errors, [], `${width}: browser errors`)
    assert.deepEqual(remote, [], `${width}: third-party requests`)
    await context.close()
  }
  const page = await browser.newPage()
  await page.goto(origin, { waitUntil: 'networkidle' })
  await page.keyboard.press('Tab')
  assert.equal(await page.locator(':focus').textContent(), 'Skip to content')
  await page.keyboard.press('Enter')
  assert.equal(await page.locator(':focus').getAttribute('id'), 'main')
  await page.getByRole('link', { name: 'Explore my projects' }).click()
  await page.waitForURL('**/projects/')
  await page.getByRole('link', { name: 'Explore the project' }).first().click()
  await page.waitForURL('**/projects/tinys-tool/')
  assert.equal(await page.locator('h1').textContent(), "Tiny's Tool")
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://madebytmy.com/projects/tinys-tool/')
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'About' }).click()
  await page.waitForURL('**/about/')
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://madebytmy.com/about/')
  for (const route of englishRoutes) {
    await page.goto(origin + route, { waitUntil: 'networkidle' })
    await page.getByRole('link', { name: '切换到中文' }).click()
    await page.waitForURL(origin + '/zh' + route)
    await page.waitForFunction(() => document.documentElement.lang === 'zh-Hans')
    assert.equal(await page.locator('html').getAttribute('lang'), 'zh-Hans')
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://madebytmy.com/zh' + route)
    await page.getByRole('link', { name: 'Switch to English' }).click()
    await page.waitForURL(origin + route)
    await page.waitForFunction(() => document.documentElement.lang === 'en')
    assert.equal(await page.locator('html').getAttribute('lang'), 'en')
  }
  await page.goto(origin + '/zh/projects/tinys-tool/', { waitUntil: 'networkidle' })
  assert.equal(await page.locator('.feature-items li').count(), 21)
  assert.equal(await page.getByRole('link', { name: 'JSON 校验', exact: false }).getAttribute('href'), 'https://tinystool.org/zh/tools/json/json-validator/')
  await page.getByRole('link', { name: 'Tiny QR Toolkit ↗', exact: true }).click()
  await page.waitForURL(origin + '/zh/projects/qr-generator/')
  assert.equal(await page.locator('.feature-items li').count(), 5)
  assert.equal(await page.locator('.feature-items a').count(), 1)
  assert.equal(await page.locator('.feature-items a').getAttribute('href'), 'https://qr.tinystool.org/zh/decode')
  assert(await page.locator('.availability-note').isVisible())
  await page.getByRole('link', { name: 'Tiny Image ↗', exact: true }).click()
  await page.waitForURL(origin + '/zh/projects/image-compression/')
  assert.equal(await page.locator('.feature-items li').count(), 6)
  assert.equal(await page.locator('a[href="https://image.tinystool.org/"]').count(), 0)
  assert.match(await page.locator('.availability-note').last().textContent(), /HTTPS/)
  report.navigation.push('Tiny Image detail and six source-verified features; unreachable website has no visit link')
  report.navigation.push('21 localized tool links, 5 QR features, unstable links disabled, related-project navigation')
  for (const prefix of ['', '/zh']) {
    await page.goto(origin + prefix + '/projects/', { waitUntil: 'networkidle' })
    for (const project of registry.filter(p => p.status === 'published' && p.websiteAvailable !== false)) {
      const expected = prefix && project.websiteZhUrl ? project.websiteZhUrl : project.websiteUrl
      assert.equal(await page.locator('.project-card').filter({ has: page.getByRole('heading', { name: project.name, exact: true }) }).locator('a[target="_blank"]').getAttribute('href'), expected)
    }
    await page.goto(origin + prefix + '/projects/tinys-tool/', { waitUntil: 'networkidle' })
    assert.equal(await page.locator('.project-deep-links a').first().getAttribute('href'), 'https://tinystool.org' + prefix + '/tools/')
  }
  report.navigation.push('English and Chinese project buttons and resource links use verified language counterparts')
  report.navigation.push('Bilingual switching across six page pairs, lang and canonical update')
  report.navigation.push('Keyboard skip link; home → projects → detail → about; client canonical updates')
  for (const route of ['/does-not-exist/', '/projects/ip-checker/', '/projects/unknown/', '/zh/does-not-exist/', '/zh/projects/ip-checker/']) {
    const response = await page.goto(origin + route, { waitUntil: 'networkidle' })
    assert.equal(response.status(), 404)
    assert.equal(await page.locator('html').getAttribute('lang'), route.startsWith('/zh/') ? 'zh-Hans' : 'en')
    assert.equal(await page.locator('script[type="application/ld+json"]').count(), 0)
    assert.match(await page.locator('meta[name="robots"]').getAttribute('content'), /noindex/)
    assert.equal(await page.locator('link[rel="canonical"]').count(), 0)
    report.http.push({ route, status: 404 })
  }
  for (const route of ['/%2Fexample.com/x/index.html', '/%5Cexample.com/x/index.html', '/%2Fprojects/index.html', '/%0Aprojects/index.html']) {
    const response = await page.request.get(origin + route, { maxRedirects: 0 })
    assert.equal(response.status(), 400)
    assert.equal(response.headers().location, undefined)
    report.http.push({ route, status: 400 })
  }
  const missingIndex = await page.request.get(origin + '/not-a-directory/index.html', { maxRedirects: 0 })
  assert.equal(missingIndex.status(), 404)
  assert.equal(missingIndex.headers().location, undefined)
  const indexAlias = await page.request.get(origin + '/zh/projects/index.html?source=check', { maxRedirects: 0 })
  assert.equal(indexAlias.status(), 301)
  assert.equal(indexAlias.headers().location, '/zh/projects/?source=check')
  report.http.push({ route: '/not-a-directory/index.html', status: 404 }, { route: '/zh/projects/index.html?source=check', status: 301 })
  for (const route of ['/projects', '/about', '/projects/tinys-tool']) {
    const response = await page.request.get(origin + route, { maxRedirects: 0 })
    assert.equal(response.status(), 301)
    assert.equal(response.headers().location, route + '/')
    report.http.push({ route, status: 301, location: route + '/' })
  }
  const noJs = await browser.newContext({ javaScriptEnabled: false })
  const staticPage = await noJs.newPage()
  for (const route of routes) {
    await staticPage.goto(origin + route)
    assert.equal(await staticPage.locator('h1').count(), 1)
    assert((await staticPage.locator('main').textContent()).trim().length > 150)
    report.noJs.push(route)
  }
  await staticPage.goto(origin)
  await staticPage.getByRole('link', { name: 'Explore my projects' }).click()
  await staticPage.waitForURL('**/projects/')
  report.noJs.push('Home → projects link works without JS')
  assert(report.pages.every(p => p.violations.length === 0), 'Accessibility violations; see docs/evidence/browser.json')
  console.log(`PASS ${report.pages.length} responsive/a11y page cases; keyboard; navigation; no JS; HTTP 301/404; no console errors or third-party requests`)
} finally {
  await writeFile('docs/evidence/browser.json', JSON.stringify(report, null, 2) + '\n')
  await browser.close()
}
