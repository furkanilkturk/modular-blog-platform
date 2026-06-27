import { useEffect } from 'react'
import { useEditorStore } from './store'
import { saveLocalDraft } from './localDraft'

// Debounced autosave of new (unsaved) posts to localStorage. Renders nothing.
export function AutoSave() {
  const document = useEditorStore((s) => s.document)
  const postId = useEditorStore((s) => s.postId)

  useEffect(() => {
    if (postId) return
    const timer = setTimeout(() => saveLocalDraft(document), 800)
    return () => clearTimeout(timer)
  }, [document, postId])

  return null
}
