import { http, HttpResponse } from 'msw'
import {
  createPost,
  findBySlug,
  listPosts,
  removePost,
  updatePost,
  type PostInput,
} from './db'

export const handlers = [
  http.get('/api/posts', () => HttpResponse.json(listPosts())),

  http.get('/api/posts/:slug', ({ params }) => {
    const post = findBySlug(String(params.slug))
    return post ? HttpResponse.json(post) : new HttpResponse(null, { status: 404 })
  }),

  http.post('/api/posts', async ({ request }) => {
    const input = (await request.json()) as PostInput
    return HttpResponse.json(createPost(input), { status: 201 })
  }),

  http.put('/api/posts/:id', async ({ params, request }) => {
    const input = (await request.json()) as PostInput
    const post = updatePost(String(params.id), input)
    return post ? HttpResponse.json(post) : new HttpResponse(null, { status: 404 })
  }),

  http.delete('/api/posts/:id', ({ params }) => {
    const ok = removePost(String(params.id))
    return new HttpResponse(null, { status: ok ? 204 : 404 })
  }),
]
