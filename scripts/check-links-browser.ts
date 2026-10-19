import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
import { linkLanguage, publicLinks, responseError, destinationError } from './link-validation'
const host = process.argv.find(arg => arg.startsWith('--host='))?.slice(7)
const urls = publicLinks().filter(url => !host || new URL(url).hostname === host)
assert(urls.length, 'No public links match the selected host')
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL ?? 'chrome', headless: true })
const results: { url: string; finalUrl?: string; status?: number; title?: string; ok: boolean; error?: string }[] = []
try {
  for (const url of urls) {
    // Isolate cookies and language state so one visit cannot mask another.
    const context = await browser.newContext({ locale: linkLanguage(url) })
    try {
      const page = await context.newPage()
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
      assert(response, 'No document response')
      const error = responseError(url, response.status(), response.url(), response.headers()['content-type'] ?? '') ?? destinationError(url, page.url())
      assert(!error, error)
      assert((await page.locator('body').innerText()).trim().length > 100, 'Empty page')
      results.push({ url, finalUrl: page.url(), status: response.status(), title: await page.title(), ok: true })
    } catch (error) { results.push({ url, ok: false, error: error instanceof Error ? error.message : String(error) }) }
    finally { await context.close() }
    console.log(JSON.stringify(results.at(-1)))
  }
} finally {
  await browser.close()
  await mkdir('docs/evidence', { recursive: true })
  await writeFile('docs/evidence/external-links-browser.json', JSON.stringify({ checkedAt: new Date().toISOString(), host: host ?? null, results }, null, 2) + '\n')
}
assert(results.every(result => result.ok), 'Browser link verification failed; see docs/evidence/external-links-browser.json')
