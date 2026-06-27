import { describe, expect, it } from 'vitest'
import {
  createPost,
  deletePost,
  getPost,
  listPosts,
  updatePost,
} from '@/features/blog/api'

describe('blog api (against MSW)', () => {
  it('lists seeded posts', async () => {
    const posts = await listPosts()
    expect(posts.length).toBeGreaterThan(0)
  })

  it('gets a post by slug', async () => {
    const post = await getPost('modular-block-architecture')
    expect(post?.title).toMatch(/modular block/i)
  })

  it('returns null for an unknown slug', async () => {
    expect(await getPost('does-not-exist')).toBeNull()
  })

  it('creates a post and derives metadata', async () => {
    const created = await createPost({
      title: 'My New Post',
      status: 'draft',
      blocks: [{ id: 'b', type: 'text', data: { html: '<p>Hello world content</p>' } }],
    })
    expect(created.id).toBeTruthy()
    expect(created.slug).toBe('my-new-post')
    expect(created.excerpt).toContain('Hello world')
    expect(created.status).toBe('draft')

    expect(await getPost('my-new-post')).not.toBeNull()
  })

  it('updates a post but keeps its slug stable', async () => {
    const created = await createPost({ title: 'Updatable', status: 'draft', blocks: [] })
    const updated = await updatePost(created.id, {
      title: 'Updated Title',
      status: 'published',
      blocks: [],
    })
    expect(updated.title).toBe('Updated Title')
    expect(updated.status).toBe('published')
    expect(updated.slug).toBe(created.slug)
  })

  it('deletes a post', async () => {
    const created = await createPost({ title: 'Deletable', status: 'draft', blocks: [] })
    await deletePost(created.id)
    expect(await getPost(created.slug)).toBeNull()
  })
})
