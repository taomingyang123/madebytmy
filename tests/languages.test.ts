import { test } from 'node:test'
import assert from 'node:assert/strict'
import { basePath, bilingualRoutes, localizedPath, localizedExternalUrl } from '../shared/languages'
import en from '../app/locales/en.json'
import zh from '../app/locales/zh.json'
test('All public page counterparts retain their path and normalize the trailing slash', () => {
  for (const path of ['/', '/projects/', '/about/', '/projects/tinys-tool/']) {
    const chinese = localizedPath(path, 'zh')
    assert.equal(localizedPath(chinese, 'en'), path)
    assert.equal(localizedPath(chinese, 'zh'), chinese)
  }
  assert.equal(basePath('/zh'), '/')
  assert.equal(basePath('/zh/projects'), '/projects/')
})
test('Bilingual routes are unique and include both homepages', () => {
  const routes = bilingualRoutes(['/', '/projects/', '/about/'])
  assert.equal(new Set(routes).size, 6)
  assert(routes.includes('/') && routes.includes('/zh/'))
})
test('English and Chinese message catalogs contain identical, nonempty keys', () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(zh).sort())
  assert(Object.values(zh).every(value => value.trim().length > 0))
})

 test('Public feature, workflow and FAQ content has Chinese translations', async () => {
  const { default: projects } = await import('../data/projects.json')
  const catalog = zh as Record<string, string>
  for (const project of projects.filter(p => p.status === 'published')) {
    const messages = [project.seoTitle, project.availabilityNote,
      ...project.featureGroups?.flatMap(g => [g.title, ...g.items.flatMap(i => [i.name, i.description])]) ?? [],
      ...project.useCases?.flatMap(s => [s.title, s.description]) ?? [],
      ...project.faqs?.flatMap(f => [f.question, f.answer]) ?? []].filter(Boolean) as string[]
    for (const key of messages) assert(catalog[key], `Missing translation: ${key}`)
  }
})

test('External links use the verified language counterpart and retain a fallback', () => {
  assert.equal(localizedExternalUrl('https://site.org/', 'https://site.org/zh/', 'en'), 'https://site.org/')
  assert.equal(localizedExternalUrl('https://site.org/', 'https://site.org/zh/', 'zh'), 'https://site.org/zh/')
  assert.equal(localizedExternalUrl('https://site.org/', undefined, 'zh'), 'https://site.org/')
  assert.equal(localizedExternalUrl(undefined, undefined, 'zh'), undefined)
})
