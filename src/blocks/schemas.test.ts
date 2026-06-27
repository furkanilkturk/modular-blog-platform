import {
  blockSchema,
  blogDocumentSchema,
  quizBlockDataSchema,
  textBlockDataSchema,
} from './schemas'
import type { BlogDocument } from './types'

describe('block schemas', () => {
  it('accepts valid text block data', () => {
    expect(
      textBlockDataSchema.safeParse({ html: '<p>hi</p>', align: 'center' }).success,
    ).toBe(true)
  })

  it('rejects an invalid alignment', () => {
    const result = textBlockDataSchema.safeParse({ html: '', align: 'sideways' })
    expect(result.success).toBe(false)
  })

  it('requires at least two options per quiz question', () => {
    const result = quizBlockDataSchema.safeParse({
      title: 'Quiz',
      questions: [{ id: 'q1', prompt: '?', options: ['only one'], correctIndex: 0 }],
    })
    expect(result.success).toBe(false)
  })

  it('discriminates blocks by type', () => {
    const result = blockSchema.safeParse({
      id: 'x',
      type: 'image',
      data: { src: 'u', alt: 'a' },
    })
    expect(result.success).toBe(true)
  })

  it('rejects data that does not match its declared type', () => {
    const result = blockSchema.safeParse({
      id: 'x',
      type: 'image',
      data: { html: '<p>not an image</p>', align: 'left' },
    })
    expect(result.success).toBe(false)
  })
})

describe('blogDocumentSchema', () => {
  const valid: BlogDocument = {
    id: 'doc-1',
    version: 1,
    title: 'Hello',
    status: 'draft',
    blocks: [{ id: 't1', type: 'text', data: { html: '', align: 'left' } }],
  }

  it('accepts a well-formed document', () => {
    expect(blogDocumentSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects a non-positive version', () => {
    expect(blogDocumentSchema.safeParse({ ...valid, version: 0 }).success).toBe(false)
  })

  it('rejects an invalid status', () => {
    expect(
      blogDocumentSchema.safeParse({ ...valid, status: 'archived' }).success,
    ).toBe(false)
  })
})
