import type { Block } from '@/blocks'

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  coverImage: string
  author: string
  /** ISO date string. */
  publishedAt: string
  readingTimeMinutes: number
  featured: boolean
  status: 'draft' | 'published'
  /** The page content, rendered by the block engine. */
  blocks: Block[]
}
