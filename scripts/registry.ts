import type { Project } from '../types/project'
export function assertHttps(value: string) {
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.username || url.password || url.port || url.hostname === 'localhost' || /(^|\.)(example\.(com|org|net)|invalid|test)$/.test(url.hostname)) throw new Error(`Invalid public URL: ${value}`)
}
export function validateProjects(projects: Project[]) {
  const slugs = new Set<string>()
  const ids = new Set<string>()
  for (const p of projects) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) || slugs.has(p.slug)) throw new Error(`Invalid or duplicate slug: ${p.slug}`)
    if (!p.id || ids.has(p.id)) throw new Error(`Invalid or duplicate id: ${p.id}`)
    slugs.add(p.slug); ids.add(p.id)
    if (!['published', 'draft', 'archived'].includes(p.status)) throw new Error(`Invalid status: ${p.slug}`)
    if (!['developer-tool', 'utility', 'game', 'mini-program', 'experiment'].includes(p.category)) throw new Error(`Invalid category: ${p.slug}`)
    if (p.status !== 'published') continue
    if (!p.name?.trim() || !p.summary?.trim() || !p.tagline?.trim() || !p.websiteUrl || !p.problem || !p.solution) throw new Error(`Incomplete published project: ${p.slug}`)
    if (p.contentUpdated && (!/^\d{4}-\d{2}-\d{2}$/.test(p.contentUpdated) || Number.isNaN(Date.parse(p.contentUpdated)) || new Date(p.contentUpdated).toISOString().slice(0, 10) !== p.contentUpdated)) throw new Error(`Invalid content date: ${p.slug}`)
    assertHttps(p.websiteUrl)
    if (p.websiteZhUrl) assertHttps(p.websiteZhUrl)
    for (const group of p.featureGroups ?? []) for (const item of group.items) {
      if (item.url) assertHttps(item.url)
      if (item.zhUrl) assertHttps(item.zhUrl)
      if (!item.name.trim() || !item.description.trim()) throw new Error(`Incomplete feature: ${p.slug}`)
    }
    for (const link of p.links ?? []) {
      assertHttps(link.url)
      if (link.zhUrl) assertHttps(link.zhUrl)
      if (!link.verified) throw new Error(`Unverified link: ${link.url}`)
    }
  }
  return projects.filter(p => p.status === 'published')
}
export function publicProjects(projects: Project[]) {
  return validateProjects(projects).map(({ verificationNote: _note, ...project }) => project)
}
