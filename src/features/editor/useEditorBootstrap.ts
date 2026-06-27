import { useEffect, useState } from 'react'
import { getPost } from '@/features/blog/api'
import { useEditorStore } from './store'
import { loadLocalDraft } from './localDraft'

/**
 * Prepares the editor for a route: loads an existing post when a slug is
 * present, otherwise restores a local draft or starts a fresh post. Clears
 * undo history so the loaded state is the baseline.
 */
export function useEditorBootstrap(slug: string | undefined) {
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let active = true
    setIsLoading(true)
    setNotFound(false)

    if (slug) {
      getPost(slug)
        .then((post) => {
          if (!active) return
          if (post) {
            useEditorStore.getState().loadPost(post)
            useEditorStore.temporal.getState().clear()
          } else {
            setNotFound(true)
          }
        })
        .finally(() => active && setIsLoading(false))
    } else {
      const draft = loadLocalDraft()
      if (draft) {
        useEditorStore.getState().loadDocument(draft)
      } else {
        useEditorStore.getState().resetToNew()
      }
      useEditorStore.temporal.getState().clear()
      setIsLoading(false)
    }

    return () => {
      active = false
    }
  }, [slug])

  return { isLoading, notFound }
}
