import { serializeStructuredData } from '#shared/structured-data'
import { site } from '#shared/site'
import { basePath } from '#shared/languages'
export function useSeo(title: string, description: string, path: string, graph: Record<string, unknown>[] = []) {
  const { t, isZh, localePath } = useSiteLanguage()
  const url = site.origin + localePath(path)
  title = t(title)
  description = t(description)
  const lang = isZh.value ? 'zh-Hans' : 'en'
  const normalizedGraph = JSON.parse(JSON.stringify(graph, (key, value) => {
    if (key === 'inLanguage') return lang
    if (typeof value !== 'string') return value
    if (value.startsWith(site.origin + '/') && !value.includes('#')) return site.origin + localePath(value.slice(site.origin.length))
    return t(value)
  }))
  useSeoMeta({ title, description, ogTitle: title, ogDescription: description, ogUrl: url, ogType: 'website', ogSiteName: t(site.name), ogLocale: isZh.value ? 'zh_CN' : 'en_US', ogImage: `${site.origin}/og-default.png`, ogImageWidth: 1200, ogImageHeight: 630, ogImageAlt: t('Small tools. Thoughtfully made.'), twitterCard: 'summary_large_image', twitterTitle: title, twitterDescription: description, twitterImage: `${site.origin}/og-default.png` })
  useHead({ htmlAttrs: { lang }, link: [
    { rel: 'canonical', href: url },
    { rel: 'alternate', hreflang: 'en', href: site.origin + basePath(path) },
    { rel: 'alternate', hreflang: 'zh-Hans', href: site.origin + '/zh' + basePath(path) },
    { rel: 'alternate', hreflang: 'x-default', href: site.origin + basePath(path) },
  ], script: graph.length ? [{ key: 'structured-data', type: 'application/ld+json', innerHTML: serializeStructuredData({ '@context': 'https://schema.org', '@graph': normalizedGraph }) }] : [] })
}
