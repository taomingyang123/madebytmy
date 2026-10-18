import { test } from 'node:test'
import assert from 'node:assert/strict'
import { contentDate } from '../scripts/content-dates'
import { publicProjects } from '../scripts/registry'
import projects from '../data/projects.json'
import type { Project } from '../types/project'
test('Sitemap uses actual project dates for both languages, never a blanket or build date', () => {
  const data = publicProjects(structuredClone(projects) as Project[])
  data[0]!.contentUpdated = '2025-02-03'
  assert.equal(contentDate('/projects/tinys-tool/', data), '2025-02-03')
  assert.equal(contentDate('/zh/projects/tinys-tool/', data), '2025-02-03')
  delete data[0]!.contentUpdated
  assert.equal(contentDate('/projects/tinys-tool/', data), undefined)
  assert.equal(contentDate('/unknown/', data), undefined)
})
