import { Route, Routes } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { NotFound } from '@/components/NotFound'
import { AdminEditor } from '@/features/editor'
import { BlogListPage } from '@/features/blog/pages/BlogListPage'
import { BlogDetailPage } from '@/features/blog/pages/BlogDetailPage'

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
      </Route>
      <Route path="/admin" element={<AdminEditor />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
