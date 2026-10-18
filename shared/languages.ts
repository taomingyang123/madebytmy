export function basePath(path: string) {
  const base = path === '/zh' ? '/' : path.replace(/^\/zh(?=\/)/, '')
  return base.endsWith('/') ? base : base + '/'
}
export function localizedPath(path: string, locale: 'en' | 'zh') {
  return (locale === 'zh' ? '/zh' : '') + basePath(path)
}
export function bilingualRoutes(paths: string[]) {
  return paths.flatMap(path => [localizedPath(path, 'en'), localizedPath(path, 'zh')])
}

export function localizedExternalUrl(url: string | undefined, zhUrl: string | undefined, locale: 'en' | 'zh') {
  return locale === 'zh' ? (zhUrl ?? url) : url
}
