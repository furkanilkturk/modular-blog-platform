import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { usePosts } from '../usePosts'
import { filterPosts, getCategories, getFeatured, paginate } from '../filter'
import { PostCard } from '../components/PostCard'
import { FeaturedPost } from '../components/FeaturedPost'
import { PostCardSkeleton } from '../components/PostCardSkeleton'
import { PaginationControls } from '../components/PaginationControls'

const PER_PAGE = 4

function byNewest<T extends { publishedAt: string }>(a: T, b: T) {
  return b.publishedAt.localeCompare(a.publishedAt)
}

export function BlogListPage() {
  const { posts, isLoading, error } = usePosts()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const categories = useMemo(() => getCategories(posts), [posts])
  const isFiltering = query.trim() !== '' || category !== null

  const filtered = useMemo(
    () => filterPosts(posts, { query, category }).sort(byNewest),
    [posts, query, category],
  )
  const result = useMemo(() => paginate(filtered, page, PER_PAGE), [filtered, page])
  const featured = useMemo(() => getFeatured(posts).sort(byNewest)[0], [posts])

  function updateQuery(value: string) {
    setQuery(value)
    setPage(1)
  }
  function updateCategory(value: string | null) {
    setCategory(value)
    setPage(1)
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">The Blog</h1>
        <p className="text-muted-foreground">
          Posts assembled from modular content blocks.
        </p>
      </header>

      {!isLoading && !isFiltering && featured ? (
        <FeaturedPost post={featured} />
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts…"
            aria-label="Search posts"
            className="pl-8"
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
          <CategoryChip active={category === null} onClick={() => updateCategory(null)}>
            All
          </CategoryChip>
          {categories.map((c) => (
            <CategoryChip
              key={c}
              active={category === c}
              onClick={() => updateCategory(c)}
            >
              {c}
            </CategoryChip>
          ))}
        </div>
      </div>

      {error ? (
        <p className="py-12 text-center text-destructive">
          Couldn’t load posts. Please refresh and try again.
        </p>
      ) : isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : result.total === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No posts found. Try a different search or category.
        </p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2">
            {result.items.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <PaginationControls
            page={result.page}
            totalPages={result.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Button
      type="button"
      variant={active ? 'default' : 'outline'}
      size="sm"
      aria-pressed={active}
      onClick={onClick}
      className={cn('rounded-full')}
    >
      {children}
    </Button>
  )
}
