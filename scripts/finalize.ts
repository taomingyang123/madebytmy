import { readFile, writeFile, rm } from 'node:fs/promises'
import { load } from 'cheerio'
for (const zh of [false, true]) {
  const prefix = zh ? '/zh' : ''
  const $ = load(await readFile(`.output/public${prefix}/index.html`, 'utf8'))
  $('title').text(zh ? '页面未找到 | 独立开发者作品集' : 'Page not found | Independent Projects')
  $('meta[name="description"]').attr('content', zh ? '找不到这个页面，请返回首页浏览已发布的作品。' : 'This page could not be found. Explore published projects instead.')
  $('link[rel="canonical"],link[rel="alternate"],meta[property^="og:"],meta[name^="twitter:"],script,link[rel="modulepreload"]').remove()
  $('head').append('<meta name="robots" content="noindex, nofollow">')
  $('main').addClass('shell error-page').html(`<span class="eyebrow muted">404</span><h1>${zh ? '这里还没有内容。' : 'Nothing here. Yet.'}</h1><p>${zh ? '你要找的页面不存在或暂时无法访问。' : 'The page you’re looking for isn’t available.'}</p><a class="button" href="${prefix}/">${zh ? '返回首页' : 'Back to home'} <span aria-hidden="true">↗</span></a>`)
  $('nav a').removeClass('current').removeAttr('aria-current')
  await writeFile(`.output/public${prefix}/404.html`, $.html())
}
await rm('.output/public/200.html', { force: true })
console.log('Wrote English and Chinese static noindex 404 pages; removed SPA fallback')
