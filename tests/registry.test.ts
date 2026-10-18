import { test } from 'node:test'
import assert from 'node:assert/strict'
import projects from '../data/projects.json'
import { publicProjects, validateProjects, assertHttps } from '../scripts/registry'
import type { Project } from '../types/project'
const fresh = () => structuredClone(projects) as Project[]
test('Only published records are exported; private notes and draft URLs excluded', () => {
  const data = publicProjects(fresh())
  assert.deepEqual(data.map(p => p.slug), ['tinys-tool', 'qr-generator', 'image-compression'])
  assert(!JSON.stringify(data).includes('verificationNote'))
  assert(!JSON.stringify(data).includes('ip.tinystool.org'))
})
test('Archived projects are not published', () => { const data = fresh(); data[0]!.status = 'archived'; assert.equal(publicProjects(data).length, 2) })
test('Duplicate slugs rejected across draft and published', () => { const data = fresh(); data[1]!.slug = data[0]!.slug; assert.throws(() => validateProjects(data), /duplicate slug/) })
test('Incomplete public entries rejected', () => { const data = fresh(); delete data[0]!.websiteUrl; assert.throws(() => validateProjects(data), /Incomplete/) })
test('Unverified links rejected', () => { const data = fresh(); data[0]!.links![0]!.verified = false; assert.throws(() => validateProjects(data), /Unverified/) })
test('Unsafe and placeholder public URLs rejected', () => { for (const url of ['javascript:alert(1)', 'data:text/html,hi', 'http://tinystool.org/', 'https://example.com/', 'https://user:pass@tinystool.org/']) assert.throws(() => assertHttps(url)); assert.doesNotThrow(() => assertHttps('https://tinystool.org/')) })
test('Invalid slug rejected', () => { const data = fresh(); data[0]!.slug = '../secret'; assert.throws(() => validateProjects(data), /slug/) })
