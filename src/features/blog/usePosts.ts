import { useEffect, useState } from 'react'
import { getPost, listPosts } from './api'
import type { BlogPost } from './types'

/** Loads all posts from the (MSW-mocked) API. */
export function usePosts() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let active = true
    setIsLoading(true)
    listPosts()
      .then((data) => {
        if (active) {
          setPosts(data)
          setError(null)
        }
      })
      .catch((e: Error) => active && setError(e))
      .finally(() => active && setIsLoading(false))
    return () => {
      active = false
    }
  }, [])

  return { posts, isLoading, error }
}

/** Loads a single post by slug; `post` is null when not found. */
export function usePost(slug: string | undefined) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!slug) {
      setPost(null)
      setIsLoading(false)
      return
    }
    let active = true
    setIsLoading(true)
    getPost(slug)
      .then((data) => {
        if (active) {
          setPost(data)
          setError(null)
        }
      })
      .catch((e: Error) => active && setError(e))
      .finally(() => active && setIsLoading(false))
    return () => {
      active = false
    }
  }, [slug])

  return { post, isLoading, error }
}
