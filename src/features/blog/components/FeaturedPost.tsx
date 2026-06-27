import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/format'
import type { BlogPost } from '../types'

export function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group grid overflow-hidden rounded-xl border bg-card md:grid-cols-2"
    >
      <img
        src={post.coverImage}
        alt=""
        className="aspect-[16/9] w-full object-cover md:aspect-auto md:h-full"
        loading="lazy"
      />
      <div className="flex flex-col justify-center gap-3 p-6">
        <div className="flex items-center gap-2">
          <Badge>Featured</Badge>
          <Badge variant="secondary">{post.category}</Badge>
        </div>
        <h2 className="text-2xl font-semibold leading-tight group-hover:underline">
          {post.title}
        </h2>
        <p className="text-muted-foreground">{post.excerpt}</p>
        <p className="text-sm text-muted-foreground">
          {post.author} · {formatDate(post.publishedAt)} · {post.readingTimeMinutes} min read
        </p>
      </div>
    </Link>
  )
}
