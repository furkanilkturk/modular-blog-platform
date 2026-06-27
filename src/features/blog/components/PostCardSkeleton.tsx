import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function PostCardSkeleton() {
  return (
    <Card className="overflow-hidden pt-0">
      <Skeleton className="aspect-[16/9] w-full" />
      <CardContent className="space-y-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  )
}
