import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/format'
import type { BlogPost } from '../types'

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Card className="overflow-hidden pt-0 transition-shadow hover:shadow-md">
      <Link to={`/blog/${post.slug}`} aria-label={post.title}>
        <img
          src={post.coverImage}
          alt=""
          className="aspect-[16/9] w-full object-cover"
          loading="lazy"
        />
      </Link>
      <CardContent className="space-y-2">
        <Badge variant="secondary">{post.category}</Badge>
        <h3 className="text-lg font-semibold leading-snug">
          <Link to={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
        <p className="pt-1 text-xs text-muted-foreground">
          {post.author} · {formatDate(post.publishedAt)} · {post.readingTimeMinutes} min read
        </p>
      </CardContent>
    </Card>
  )
}
