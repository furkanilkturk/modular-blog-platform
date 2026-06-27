import { beforeEach, describe, expect, it } from 'vitest'
import { createEmptyDocument, useEditorStore } from '@/features/editor'
import type { TextBlock } from '@/blocks'

const get = () => useEditorStore.getState()
const history = () => useEditorStore.temporal.getState()

beforeEach(() => {
  useEditorStore.setState({
    document: createEmptyDocument(),
    selectedBlockId: null,
  })
  history().clear()
})

describe('editor store: block operations', () => {
  it('adds a block and selects it', () => {
    get().addBlock('text')
    const { document, selectedBlockId } = get()
    expect(document.blocks).toHaveLength(1)
    expect(document.blocks[0].type).toBe('text')
    expect(selectedBlockId).toBe(document.blocks[0].id)
  })

  it('inserts a block at a given index', () => {
    get().addBlock('text')
    get().addBlock('image')
    get().addBlock('text', 1)
    const types = get().document.blocks.map((b) => b.type)
    expect(types).toEqual(['text', 'text', 'image'])
  })

  it('removes a block and clears selection when it was selected', () => {
    get().addBlock('text')
    const id = get().document.blocks[0].id
    get().selectBlock(id)
    get().removeBlock(id)
    expect(get().document.blocks).toHaveLength(0)
    expect(get().selectedBlockId).toBeNull()
  })

  it('duplicates a block with a new id and an independent copy', () => {
    get().addBlock('text')
    const original = get().document.blocks[0] as TextBlock
    get().updateBlockData(original.id, { html: 'hello', align: 'left' })
    get().duplicateBlock(original.id)

    const blocks = get().document.blocks
    expect(blocks).toHaveLength(2)
    expect(blocks[1].id).not.toBe(blocks[0].id)
    expect((blocks[1] as TextBlock).data).toEqual({ html: 'hello', align: 'left' })
    expect(blocks[1].data).not.toBe(blocks[0].data)
  })

  it('reorders blocks by id', () => {
    get().addBlock('text')
    get().addBlock('image')
    const [a, b] = get().document.blocks
    get().reorderBlocks(a.id, b.id)
    expect(get().document.blocks.map((x) => x.id)).toEqual([b.id, a.id])
  })

  it('moves a block up and down, clamping at the ends', () => {
    get().addBlock('text')
    get().addBlock('image')
    const [a, b] = get().document.blocks

    get().moveBlock(b.id, 'up')
    expect(get().document.blocks.map((x) => x.id)).toEqual([b.id, a.id])

    get().moveBlock(b.id, 'up') // already at top → no-op
    expect(get().document.blocks.map((x) => x.id)).toEqual([b.id, a.id])
  })

  it('updates block data', () => {
    get().addBlock('image')
    const id = get().document.blocks[0].id
    get().updateBlockData(id, { src: 'x.jpg', alt: 'pic' })
    expect(get().document.blocks[0].data).toEqual({ src: 'x.jpg', alt: 'pic' })
  })
})

describe('editor store: history', () => {
  it('undoes and redoes content changes', () => {
    get().addBlock('text')
    expect(get().document.blocks).toHaveLength(1)

    history().undo()
    expect(get().document.blocks).toHaveLength(0)

    history().redo()
    expect(get().document.blocks).toHaveLength(1)
  })

  it('does not record selection changes in history', () => {
    get().addBlock('text')
    history().clear()
    get().selectBlock(get().document.blocks[0].id)
    expect(history().pastStates).toHaveLength(0)
  })
})
