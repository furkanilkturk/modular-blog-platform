import {
  filterPosts,
  getCategories,
  getFeatured,
  paginate,
} from '@/features/blog/filter'
import type { BlogPost } from '@/features/blog/types'

function makePost(overrides: Partial<BlogPost>): BlogPost {
  return {
    id: '1',
    slug: 'p',
    title: 'Title',
    excerpt: 'Excerpt',
    category: 'Engineering',
    coverImage: '',
    author: 'A',
    publishedAt: '2026-01-01',
    readingTimeMinutes: 3,
    featured: false,
    status: 'published',
    blocks: [],
    ...overrides,
  }
}

const posts: BlogPost[] = [
  makePost({ id: '1', title: 'React Patterns', category: 'Engineering', featured: true }),
  makePost({ id: '2', title: 'Design Systems', category: 'Design' }),
  makePost({ id: '3', title: 'Hidden draft', category: 'Engineering', status: 'draft' }),
  makePost({ id: '4', excerpt: 'all about accessibility', category: 'Design' }),
]

describe('filterPosts', () => {
  it('excludes drafts', () => {
    const result = filterPosts(posts, { query: '', category: null })
    expect(result.map((p) => p.id)).not.toContain('3')
    expect(result).toHaveLength(3)
  })

  it('filters by category', () => {
    const result = filterPosts(posts, { query: '', category: 'Design' })
    expect(result.every((p) => p.category === 'Design')).toBe(true)
    expect(result).toHaveLength(2)
  })

  it('searches title and excerpt, case-insensitively', () => {
    expect(filterPosts(posts, { query: 'react', category: null })).toHaveLength(1)
    expect(filterPosts(posts, { query: 'accessibility', category: null })).toHaveLength(1)
  })

  it('returns nothing when nothing matches', () => {
    expect(filterPosts(posts, { query: 'zzz', category: null })).toHaveLength(0)
  })
})

describe('getFeatured / getCategories', () => {
  it('returns only published featured posts', () => {
    expect(getFeatured(posts).map((p) => p.id)).toEqual(['1'])
  })

  it('returns unique published categories, sorted', () => {
    expect(getCategories(posts)).toEqual(['Design', 'Engineering'])
  })
})

describe('paginate', () => {
  const items = [1, 2, 3, 4, 5]

  it('slices the requested page', () => {
    const result = paginate(items, 2, 2)
    expect(result.items).toEqual([3, 4])
    expect(result.totalPages).toBe(3)
    expect(result.total).toBe(5)
  })

  it('clamps an out-of-range page into range', () => {
    expect(paginate(items, 99, 2).page).toBe(3)
    expect(paginate(items, 0, 2).page).toBe(1)
  })

  it('reports one page for an empty list', () => {
    const result = paginate([], 1, 4)
    expect(result.totalPages).toBe(1)
    expect(result.items).toEqual([])
  })
})
