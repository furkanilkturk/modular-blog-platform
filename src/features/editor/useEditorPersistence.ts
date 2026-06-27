import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { createPost, deletePost, updatePost } from '@/features/blog/api'
import type { PostInput } from '@/features/blog/api'
import { useEditorStore } from './store'
import { clearLocalDraft } from './localDraft'

/** Save (draft/publish) and delete the current post via the mock API. */
export function useEditorPersistence() {
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)

  async function persist(status: 'draft' | 'published', goToPost: boolean) {
    const { document, postId } = useEditorStore.getState()
    const input: PostInput = {
      title: document.title,
      status,
      blocks: document.blocks,
    }
    setIsSaving(true)
    try {
      const saved = postId
        ? await updatePost(postId, input)
        : await createPost(input)
      useEditorStore.setState({
        postId: saved.id,
        document: { ...document, status },
      })
      clearLocalDraft()
      toast.success(status === 'published' ? 'Published' : 'Draft saved')
      if (goToPost && status === 'published') navigate(`/blog/${saved.slug}`)
      return saved
    } catch {
      toast.error('Could not save. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  async function remove() {
    const { postId } = useEditorStore.getState()
    if (!postId) return
    setIsSaving(true)
    try {
      await deletePost(postId)
      clearLocalDraft()
      toast.success('Post deleted')
      navigate('/')
    } catch {
      toast.error('Could not delete. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return {
    saveDraft: () => persist('draft', false),
    publish: () => persist('published', true),
    remove,
    isSaving,
  }
}
