import { createBlock, getBlockDefinition } from '@/blocks'
import type { TextBlock } from '@/blocks'

describe('createBlock', () => {
  it('creates a block with an id, type, and default data', () => {
    const block = createBlock('text') as TextBlock
    expect(block.type).toBe('text')
    expect(block.id).toBeTruthy()
    expect(block.data).toEqual({ html: '' })
  })

  it('generates a unique id per block', () => {
    const a = createBlock('text')
    const b = createBlock('text')
    expect(a.id).not.toBe(b.id)
  })

  it('deep-clones defaults so blocks never share references', () => {
    const definition = getBlockDefinition('text')
    const block = createBlock('text')
    expect(block.data).not.toBe(definition?.defaultData)

    const other = createBlock('text') as TextBlock
    ;(block as TextBlock).data.html = 'mutated'
    expect(other.data.html).toBe('')
  })

  it('throws for an unregistered type', () => {
    expect(() => createBlock('mystery' as 'text')).toThrow(/unknown type/i)
  })
})
