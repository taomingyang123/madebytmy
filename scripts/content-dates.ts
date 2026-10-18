import { basePath } from '../shared/languages'
import { fixedRouteUpdated } from '../shared/site'
import type { Project } from '../types/project'
export function contentDate(route: string, projects: Project[]): string | undefined {
  const path = basePath(route)
  return fixedRouteUpdated[path] ?? projects.find(p => path === `/projects/${p.slug}/`)?.contentUpdated
}
