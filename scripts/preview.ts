import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname } from 'node:path'
const root = resolve('.output/public')
const port = Number(process.env.PORT ?? 4180)
const mime: Record<string,string> = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' }
// Local static preview only; deployment uses Cloudflare Pages directly.
createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://localhost')
    const path = decodeURIComponent(url.pathname)
    // Reject ambiguous paths before building a Location header. Browsers treat
    // both double slashes and backslashes as authority delimiters.
    const ambiguous = path.startsWith('//') || path.includes('\\') || [...path].some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)
    if (ambiguous) { res.writeHead(400).end('Bad request'); return }
    let file = resolve(root, '.' + path)
    if (!file.startsWith(root + '/') && file !== root) { res.writeHead(403).end(); return }
    let info = await stat(file).catch(() => null)
    if (info?.isFile() && path.endsWith('/index.html')) { res.writeHead(301, { Location: path.slice(0, -10) + url.search }).end(); return }
    if (info?.isDirectory()) {
      if (!path.endsWith('/')) { res.writeHead(301, { Location: path + '/' + url.search }).end(); return }
      file = resolve(file, 'index.html'); info = await stat(file).catch(() => null)
    }
    const found = Boolean(info?.isFile()) && !path.split('/').some(part => part.startsWith('_') && part !== '_nuxt' && !part.endsWith('.json'))
    if (!found) file = resolve(root, path.startsWith('/zh/') ? 'zh/404.html' : '404.html')
    const data = await readFile(file)
    res.writeHead(found ? 200 : 404, { 'Content-Type': mime[extname(file)] ?? 'application/octet-stream', 'X-Robots-Tag': 'noindex, nofollow' })
    res.end(req.method === 'HEAD' ? undefined : data)
  } catch { res.writeHead(400).end('Bad request') }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`))
