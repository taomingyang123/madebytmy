import { contentDate } from './content-dates'
import { bilingualRoutes } from '../shared/languages'
import { mkdir, writeFile } from 'node:fs/promises'
import sharp from 'sharp'
import projects from '../data/projects.json'
import { publicProjects } from './registry'
import { site, fixedRoutes } from '../shared/site'
import type { Project } from '../types/project'
const published = publicProjects(projects as Project[])
await mkdir('app/data', { recursive: true })
await mkdir('public', { recursive: true })
await writeFile('app/data/published.json', JSON.stringify(published, null, 2))
const routes = bilingualRoutes([...fixedRoutes, ...published.map(p => `/projects/${p.slug}/`)])
await writeFile('public/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + routes.map(route => { const date = contentDate(route, published); return `<url><loc>${site.origin}${route}</loc>${date ? `<lastmod>${date}</lastmod>` : ''}</url>` }).join('') + '</urlset>\n')
// Cloudflare Pages production builds have a configured primary branch; all
// non-primary builds (including local builds) default to noindex.
const production = process.env.SITE_ENV === 'production'
await writeFile('public/robots.txt', `User-agent: *\n${production ? 'Allow: /' : 'Disallow: /'}\n\nSitemap: ${site.origin}/sitemap.xml\n`)
await writeFile('public/_headers', `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n${production ? '' : '  X-Robots-Tag: noindex, nofollow\n'}/404.html\n  X-Robots-Tag: noindex, nofollow\n/zh/404.html\n  X-Robots-Tag: noindex, nofollow\n`)
const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#f4f2e9"/><rect x="64" y="64" width="76" height="76" rx="20" fill="#2739bc"/><text x="102" y="117" text-anchor="middle" fill="white" font-family="sans-serif" font-size="48">↗</text><text x="170" y="112" font-family="sans-serif" font-size="30" fill="#202420">Independent Projects</text><text x="64" y="290" font-family="sans-serif" font-size="83" font-weight="bold" fill="#202420">Small tools.</text><text x="64" y="390" font-family="sans-serif" font-size="83" font-weight="bold" fill="#2739bc">Thoughtfully made.</text><text x="67" y="540" font-family="sans-serif" font-size="24" fill="#555b52">INDEPENDENT WEB PROJECTS</text><circle cx="1090" cy="516" r="32" fill="#c85b32"/></svg>`
await sharp(Buffer.from(svg)).png().toFile('public/og-default.png')
console.log(`Prepared ${published.length} public project(s), ${routes.length} routes; ${production ? 'production' : 'preview (noindex)'}`)
