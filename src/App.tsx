import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { NotFound } from '@/components/NotFound'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { PageFallback } from '@/components/PageFallback'

// Route-level code splitting: the editor (TipTap, dnd-kit) loads only on /admin.
const BlogListPage = lazy(() =>
  import('@/features/blog/pages/BlogListPage').then((m) => ({ default: m.BlogListPage })),
)
const BlogDetailPage = lazy(() =>
  import('@/features/blog/pages/BlogDetailPage').then((m) => ({ default: m.BlogDetailPage })),
)
const AdminEditor = lazy(() =>
  import('@/features/editor').then((m) => ({ default: m.AdminEditor })),
)

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<BlogListPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
          </Route>
          <Route path="/admin" element={<AdminEditor />} />
          <Route path="/admin/:slug" element={<AdminEditor />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </ErrorBoundary>
  )
}

export default App
