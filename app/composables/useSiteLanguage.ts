import en from '../locales/en.json'
import zh from '../locales/zh.json'
import { basePath, localizedPath, localizedExternalUrl } from '#shared/languages'
export function useSiteLanguage() {
  const route = useRoute()
  const isZh = computed(() => route.path === '/zh' || route.path.startsWith('/zh/'))
  function t(text: string): string {
    const messages: Record<string, string> = isZh.value ? zh : en
    return messages[text] ?? text
  }
  const localePath = (path: string) => localizedPath(path, isZh.value ? 'zh' : 'en')
  const alternatePath = computed(() => localizedPath(basePath(route.path), isZh.value ? 'en' : 'zh'))
  const externalUrl = (url?: string, zhUrl?: string) => localizedExternalUrl(url, zhUrl, isZh.value ? 'zh' : 'en')
  return { t, isZh, localePath, alternatePath, externalUrl }
}
