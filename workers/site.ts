import published from '../app/data/published.json'
import { bilingualRoutes } from '../shared/languages'
import { fixedRoutes, site } from '../shared/site'

interface Environment {
  ASSETS: { fetch(request: Request): Promise<Response> }
}

const routes = new Set(bilingualRoutes([...fixedRoutes, ...published.map(project => `/projects/${project.slug}/`)]))
const canonicalHost = new URL(site.origin).host

export default {
  async fetch(request: Request, env: Environment): Promise<Response> {
    const url = new URL(request.url)
    let path: string
    try { path = decodeURIComponent(url.pathname) }
    catch { return new Response('Bad request', { status: 400 }) }
    if (path.startsWith('//') || path.includes('\\') || [...path].some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) {
      return new Response('Bad request', { status: 400 })
    }
    if (url.hostname === `www.${canonicalHost}`) {
      return Response.redirect(site.origin + url.pathname + url.search, 301)
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } })
    }

    const canonicalPath = path.endsWith('/index.html') ? path.slice(0, -10) : path.endsWith('/') ? path : path + '/'
    const page = routes.has(canonicalPath)
    if (page && url.pathname !== canonicalPath) {
      return new Response(null, { status: 301, headers: { Location: canonicalPath + url.search } })
    }

    const assetUrl = new URL(request.url)
    if (page) assetUrl.pathname = canonicalPath + 'index.html'
    let response = await env.ASSETS.fetch(new Request(assetUrl, request))
    // Static Assets does not select a localized 404 for us. Direct requests for
    // the generated error documents must also retain HTTP 404 and noindex.
    const missing = response.status === 404 || path === '/404.html' || path === '/zh/404.html'
    if (missing) {
      assetUrl.pathname = path === '/zh' || path.startsWith('/zh/') ? '/zh/404.html' : '/404.html'
      response = await env.ASSETS.fetch(new Request(assetUrl, request))
    }
    const headers = new Headers(response.headers)
    // Production workers.dev / preview hosts must not index the same content.
    if (missing || url.origin !== site.origin) headers.set('X-Robots-Tag', 'noindex, nofollow')
    return new Response(request.method === 'HEAD' ? null : response.body, { status: missing ? 404 : response.status, headers })
  },
}
