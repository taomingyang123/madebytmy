export const site = {
  origin: 'https://madebytmy.com',
  name: 'Independent Projects',
  author: 'Independent developer',
  description: 'A project portfolio and guide to practical web tools.',
} as const
export const fixedRoutes = ['/', '/projects/', '/about/']

// Actual editorial update dates. Never replace with the build date.
export const fixedRouteUpdated: Record<string, string> = {
  '/': '2026-10-17',
  '/projects/': '2026-10-18',
  '/about/': '2026-10-17',
}
