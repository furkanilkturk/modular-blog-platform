import { Link, Outlet } from 'react-router-dom'
import { PenLine } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** Shared chrome for the reader-facing pages (list + detail). */
export function PublicLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:shadow"
      >
        Skip to content
      </a>
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link to="/" className="font-semibold tracking-tight">
            Modular Blog
          </Link>
          <Link
            to="/admin"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            <PenLine className="mr-1.5 size-4" />
            Write
          </Link>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t">
        <div className="mx-auto max-w-4xl px-4 py-6 text-sm text-muted-foreground">
          Modular Blog Platform
        </div>
      </footer>
    </div>
  )
}
