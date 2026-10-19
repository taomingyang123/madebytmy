import projects from '../data/projects.json'
import { assertHttps, validateProjects } from './registry'
import type { Project } from '../types/project'

export function publicLinks(): string[] {
  return [...new Set(validateProjects(projects as Project[]).flatMap(p => [
    ...(p.websiteAvailable === false ? [] : [p.websiteUrl!, ...(p.websiteZhUrl ? [p.websiteZhUrl] : [])]),
    ...(p.links ?? []).flatMap(l => [l.url, ...(l.zhUrl ? [l.zhUrl] : [])]),
    ...(p.featureGroups ?? []).flatMap(g => g.items.filter(i => i.available && i.url).flatMap(i => [i.url!, ...(i.zhUrl ? [i.zhUrl] : [])])),
  ]))]
}
export function linkLanguage(url: string) {
  return /^\/zh(?:\/|$)/.test(new URL(url).pathname) ? 'zh-CN' : 'en-US'
}
// A successful homepage response is not proof that a deep link works. Only
// trailing-slash normalization is accepted without an editorial URL update.
export function destinationError(requested: string, finalUrl: string): string | undefined {
  try {
    assertHttps(finalUrl)
    const expected = new URL(requested), actual = new URL(finalUrl)
    const path = (url: URL) => url.pathname.replace(/\/+$/, '') || '/'
    if (expected.origin !== actual.origin || path(expected) !== path(actual) || expected.search !== actual.search) return `Unexpected destination: ${finalUrl}`
  } catch { return `Invalid destination: ${finalUrl}` }
}
export function responseError(requested: string, status: number, finalUrl: string, contentType: string): string | undefined {
  if (status < 200 || status >= 300) return `HTTP ${status}`
  const redirectError = destinationError(requested, finalUrl)
  if (redirectError) return redirectError
  if (!/^(text\/html|application\/xhtml\+xml)(?:;|$)/i.test(contentType)) return `Expected HTML, received ${contentType || 'no content type'}`
}
