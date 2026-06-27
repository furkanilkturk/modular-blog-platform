import {
  blockSchema,
  blogDocumentSchema,
  quizBlockDataSchema,
  textBlockDataSchema,
} from '@/blocks'
import type { BlogDocument } from '@/blocks'

describe('block schemas', () => {
  it('accepts valid text block data', () => {
    expect(textBlockDataSchema.safeParse({ html: '<p>hi</p>' }).success).toBe(true)
  })

  it('rejects text data missing html', () => {
    expect(textBlockDataSchema.safeParse({}).success).toBe(false)
  })

  it('requires at least two options per quiz question', () => {
    const result = quizBlockDataSchema.safeParse({
      title: 'Quiz',
      questions: [{ id: 'q1', prompt: '?', options: ['only one'], correctIndex: 0 }],
    })
    expect(result.success).toBe(false)
  })

  it('accepts valid banner and quote data', () => {
    expect(
      blockSchema.safeParse({
        id: 'bn',
        type: 'banner',
        data: { image: '', buttonText: 'Go', link: '#' },
      }).success,
    ).toBe(true)
    expect(
      blockSchema.safeParse({
        id: 'qt',
        type: 'quote',
        data: { text: 'Hi' },
      }).success,
    ).toBe(true)
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
    blocks: [{ id: 't1', type: 'text', data: { html: '' } }],
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
