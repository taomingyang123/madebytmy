export type ProjectStatus = 'draft' | 'published' | 'archived'
export type ProjectCategory = 'developer-tool' | 'utility' | 'game' | 'mini-program' | 'experiment'
export interface Project {
  id: string
  slug: string
  name: string
  category: ProjectCategory
  status: ProjectStatus
  featured: boolean
  tagline: string
  summary: string
  problem?: string
  solution?: string
  highlights: string[]
  limitations?: string[]
  technologies: string[]
  websiteAvailable?: boolean
  websiteUrl?: string
  websiteZhUrl?: string
  links?: { label: string; url: string; zhUrl?: string; verified: boolean }[]
  publishDate?: string
  seoTitle?: string
  contentUpdated?: string
  availabilityNote?: string
  featureGroups?: { title: string; items: { name: string; description: string; url?: string; zhUrl?: string; available: boolean }[] }[]
  useCases?: { title: string; description: string }[]
  faqs?: { question: string; answer: string }[]
  verificationNote?: string
}
