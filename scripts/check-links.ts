import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { setTimeout } from 'node:timers/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { linkLanguage, publicLinks, responseError } from './link-validation'
const run = promisify(execFile)
const urls = publicLinks()
const cookieDirectory = await mkdtemp(join(tmpdir(), 'portfolio-link-check-'))
async function check(url: string) {
  // Preserve cookies through redirects/retries, isolated per URL and removed
  // after the run. This mirrors a fresh browser's language negotiation.
  const cookieJar = join(cookieDirectory, `${urls.indexOf(url)}.cookies`)
  const attempts: { status: number; finalUrl: string; contentType: string; ok: boolean; error?: string }[] = []
  for (let index = 0; index < 3; index++) {
    let stdout = '', networkError: string | undefined
    try {
      const response = await run('curl', [
        '--silent', '--show-error', '--location', '--proto', '=https', '--proto-redir', '=https', '--max-redirs', '5', '--max-time', '25',
        '--header', 'Accept: text/html,application/xhtml+xml;q=0.9',
        '--header', `Accept-Language: ${linkLanguage(url)}`,
        '--user-agent', 'Mozilla/5.0 (compatible; PortfolioLinkCheck/1.0)',
        '--cookie', cookieJar, '--cookie-jar', cookieJar,
        '--output', '/dev/null', '--write-out', '%{http_code}\n%{url_effective}\n%{content_type}', url,
      ])
      stdout = response.stdout
    } catch (error) { networkError = error instanceof Error ? error.message : String(error) }
    const [code = '0', finalUrl = '', contentType = ''] = stdout.trim().split('\n')
    const status = Number(code)
    const error = networkError ?? responseError(url, status, finalUrl, contentType)
    attempts.push({ status, finalUrl, contentType, ok: !error, ...(error ? { error } : {}) })
    if (!error) break
    if (index < 2) await setTimeout(500 * (index + 1))
  }
  const result = { url, ...attempts.at(-1)!, attempts }
  console.log(JSON.stringify(result))
  return result
}
// Bound concurrency avoids a slow link blocking every other verification.
const results: Awaited<ReturnType<typeof check>>[] = []
try {
  for (let offset = 0; offset < urls.length; offset += 4) results.push(...await Promise.all(urls.slice(offset, offset + 4).map(check)))
} finally { await rm(cookieDirectory, { recursive: true, force: true }) }
await mkdir('docs/evidence', { recursive: true })
await writeFile('docs/evidence/external-links.json', JSON.stringify({ checkedAt: new Date().toISOString(), mode: 'HTML requests with explicit language; up to 3 attempts', results }, null, 2) + '\n')
if (results.some(r => !r.ok)) throw new Error('External URL verification failed. Inspect the attempts and run yarn check:links:browser to diagnose browser behavior; do not infer site-wide unavailability from HTTP checks alone.')
