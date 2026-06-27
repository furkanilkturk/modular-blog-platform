import type { Block } from '@/blocks'
import type { BlogPost } from './types'

const BASE = '/api/posts'

export interface PostInput {
  title: string
  status: 'draft' | 'published'
  blocks: Block[]
  category?: string
}

async function toJson<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  return res.json() as Promise<T>
}

const jsonHeaders = { 'Content-Type': 'application/json' }

export function listPosts(): Promise<BlogPost[]> {
  return fetch(BASE).then((r) => toJson<BlogPost[]>(r))
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`${BASE}/${slug}`)
  if (res.status === 404) return null
  return toJson<BlogPost>(res)
}

export function createPost(input: PostInput): Promise<BlogPost> {
  return fetch(BASE, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(input),
  }).then((r) => toJson<BlogPost>(r))
}

export function updatePost(id: string, input: PostInput): Promise<BlogPost> {
  return fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(input),
  }).then((r) => toJson<BlogPost>(r))
}

export async function deletePost(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
}
