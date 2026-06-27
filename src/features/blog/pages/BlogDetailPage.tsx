import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, PenLine } from 'lucide-react'
import { DynamicRenderer } from '@/blocks'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format'
import { usePost } from '../usePosts'

export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { post, isLoading } = usePost(slug)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    )
  }

  if (!post || post.status !== 'published') {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-semibold">Post not found</h1>
        <p className="mt-2 text-muted-foreground">
          This post doesn’t exist or isn’t published.
        </p>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">
          ← Back to all posts
        </Link>
      </div>
    )
  }

  return (
    <article className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 size-4" />
          All posts
        </Link>
        <Link
          to={`/admin/${post.slug}`}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
        >
          <PenLine className="mr-1.5 size-4" />
          Edit
        </Link>
      </div>

      <header className="space-y-3">
        <Badge variant="secondary">{post.category}</Badge>
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
        <p className="text-sm text-muted-foreground">
          {post.author} · {formatDate(post.publishedAt)} · {post.readingTimeMinutes} min read
        </p>
      </header>

      <img
        src={post.coverImage}
        alt=""
        className="aspect-[16/8] w-full rounded-xl object-cover"
      />

      <div className="tiptap-content space-y-6 text-lg">
        <DynamicRenderer blocks={post.blocks} />
      </div>
    </article>
  )
}
