import { mkdir, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import projects from '../data/projects.json'
import { validateProjects, assertHttps } from './registry'
import type { Project } from '../types/project'
const urls = [...new Set(validateProjects(projects as Project[]).flatMap(p => [...(p.websiteAvailable === false ? [] : [p.websiteUrl!, ...(p.websiteZhUrl ? [p.websiteZhUrl] : [])]), ...(p.links ?? []).flatMap(l => [l.url, ...(l.zhUrl ? [l.zhUrl] : [])]), ...(p.featureGroups ?? []).flatMap(g => g.items.filter(i => i.available && i.url).flatMap(i => [i.url!, ...(i.zhUrl ? [i.zhUrl] : [])]))]))]
const results = urls.map(url => {
  const response = spawnSync('curl', ['--silent', '--show-error', '--location', '--proto', '=https', '--proto-redir', '=https', '--max-redirs', '5', '--max-time', '25', '--output', '/dev/null', '--write-out', '%{http_code} %{url_effective}', url], { encoding: 'utf8' })
  const [code, finalUrl] = response.stdout.trim().split(' ')
  const ok = response.status === 0 && Number(code) >= 200 && Number(code) < 300 && Boolean(finalUrl)
  if (ok) assertHttps(finalUrl!)
  const result = { url, status: Number(code), finalUrl, ok, error: response.stderr.trim() || undefined }
  console.log(JSON.stringify(result))
  return result
})
await mkdir('docs/evidence', { recursive: true })
await writeFile('docs/evidence/external-links.json', JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2) + '\n')
if (results.some(r => !r.ok)) throw new Error('External URL verification failed; see docs/evidence/external-links.json')
