import { Spinner } from '@/components/ui/spinner'

/** Suspense fallback shown while a lazily-loaded route chunk loads. */
export function PageFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center text-muted-foreground">
      <Spinner className="size-6" />
    </div>
  )
}
