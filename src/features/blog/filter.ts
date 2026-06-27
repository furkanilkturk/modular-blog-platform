import type { BlogPost } from './types'

export interface PostFilters {
  query: string
  category: string | null
}

/** Published posts matching the search query (title/excerpt) and category. */
export function filterPosts(posts: BlogPost[], filters: PostFilters): BlogPost[] {
  const q = filters.query.trim().toLowerCase()
  return posts.filter((post) => {
    if (post.status !== 'published') return false
    if (filters.category && post.category !== filters.category) return false
    if (!q) return true
    return (
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q)
    )
  })
}

export function getFeatured(posts: BlogPost[]): BlogPost[] {
  return posts.filter((p) => p.status === 'published' && p.featured)
}

export function getCategories(posts: BlogPost[]): string[] {
  return Array.from(
    new Set(posts.filter((p) => p.status === 'published').map((p) => p.category)),
  ).sort()
}

export interface Page<T> {
  items: T[]
  page: number
  totalPages: number
  total: number
}

/** Slices items for the requested page, clamping the page into range. */
export function paginate<T>(items: T[], page: number, perPage: number): Page<T> {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const current = Math.min(Math.max(1, page), totalPages)
  const start = (current - 1) * perPage
  return {
    items: items.slice(start, start + perPage),
    page: current,
    totalPages,
    total,
  }
}
