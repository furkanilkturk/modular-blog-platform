import type { Block } from '@/blocks'
import type { BlogPost } from '@/features/blog/types'
import { posts as seed } from '@/features/blog/data'
import { generateId } from '@/lib/id'

/** Editor-supplied fields; the server derives the rest of a post's metadata. */
export interface PostInput {
  title: string
  status: 'draft' | 'published'
  blocks: Block[]
  category?: string
}

let store: BlogPost[] = structuredClone(seed)

/** Reset to the seed data (used between tests). */
export function resetDb(): void {
  store = structuredClone(seed)
}

export function listPosts(): BlogPost[] {
  return store
}

export function findBySlug(slug: string): BlogPost | undefined {
  return store.find((p) => p.slug === slug)
}

export function createPost(input: PostInput): BlogPost {
  const post: BlogPost = {
    id: generateId(),
    slug: uniqueSlug(slugify(input.title) || 'untitled'),
    title: input.title,
    status: input.status,
    blocks: input.blocks,
    excerpt: deriveExcerpt(input.blocks),
    category: input.category ?? 'Uncategorized',
    coverImage: deriveCover(input.blocks),
    author: 'You',
    publishedAt: today(),
    readingTimeMinutes: estimateReadingTime(input.blocks),
    featured: false,
  }
  store = [post, ...store]
  return post
}

export function updatePost(id: string, input: PostInput): BlogPost | undefined {
  const existing = store.find((p) => p.id === id)
  if (!existing) return undefined
  const updated: BlogPost = {
    ...existing,
    title: input.title,
    status: input.status,
    blocks: input.blocks,
    excerpt: deriveExcerpt(input.blocks),
    coverImage: deriveCover(input.blocks) || existing.coverImage,
    readingTimeMinutes: estimateReadingTime(input.blocks),
    category: input.category ?? existing.category,
  }
  store = store.map((p) => (p.id === id ? updated : p))
  return updated
}

export function removePost(id: string): boolean {
  const next = store.filter((p) => p.id !== id)
  const removed = next.length !== store.length
  store = next
  return removed
}

// --- derivation helpers ----------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function uniqueSlug(base: string): string {
  let slug = base
  let n = 2
  while (store.some((p) => p.slug === slug)) {
    slug = `${base}-${n++}`
  }
  return slug
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function textOf(blocks: Block[]): string {
  return blocks
    .map((b) => {
      if (b.type === 'text') return stripHtml(b.data.html)
      if (b.type === 'quote') return b.data.text
      return ''
    })
    .filter(Boolean)
    .join(' ')
}

function deriveExcerpt(blocks: Block[]): string {
  const text = textOf(blocks)
  if (text.length <= 140) return text
  return `${text.slice(0, 140).trimEnd()}…`
}

function deriveCover(blocks: Block[]): string {
  const image = blocks.find((b) => b.type === 'image')
  if (image && image.type === 'image' && image.data.src) return image.data.src
  return 'https://picsum.photos/seed/untitled-post/1200/630'
}

function estimateReadingTime(blocks: Block[]): number {
  const words = textOf(blocks).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}
