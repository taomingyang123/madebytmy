import { bilingualRoutes } from './shared/languages'
import tailwindcss from '@tailwindcss/vite'
import projects from './data/projects.json'
import { validateProjects } from './scripts/registry'
import { fixedRoutes } from './shared/site'
import type { Project } from './types/project'
const published = validateProjects(projects as Project[])
export default defineNuxtConfig({
  compatibilityDate: '2026-10-17',
  ssr: true,
  hooks: {
    'pages:extend'(pages) {
      // Separate route records let Vue Router navigate between language versions.
      pages.push(...pages.map(page => ({
        ...page,
        name: `zh-${page.name}`,
        path: page.path === '/' ? '/zh/' : `/zh${page.path}`,
      })))
    },
  },
  buildDir: '.nuxt',
  devtools: { enabled: false },
  modules: ['@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  typescript: { strict: true },
  app: { head: { htmlAttrs: { lang: 'en' }, link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }] } },
  nitro: { preset: 'static', prerender: { crawlLinks: false, failOnError: true, routes: bilingualRoutes([...fixedRoutes, ...published.map(p => `/projects/${p.slug}/`)]) } },
})
