import { useEffect, useState } from 'react'
import { posts as allPosts, getPostBySlug } from './data'
import type { BlogPost } from './types'

/**
 * Async-shaped reads over the local fixtures. The loading flag exists so the
 * UI can show skeletons; Sprint 5 replaces the bodies with MSW-backed fetches
 * without changing these signatures.
 */
export function usePosts() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setPosts(allPosts)
    setIsLoading(false)
  }, [])

  return { posts, isLoading }
}

export function usePost(slug: string | undefined) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setPost(slug ? (getPostBySlug(slug) ?? null) : null)
    setIsLoading(false)
  }, [slug])

  return { post, isLoading }
}
