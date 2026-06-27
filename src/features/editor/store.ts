import { create } from 'zustand'
import { temporal } from 'zundo'
import { immer } from 'zustand/middleware/immer'
import { arrayMove } from '@dnd-kit/sortable'
import { createBlock, CURRENT_DOCUMENT_VERSION } from '@/blocks'
import type { Block, BlockType, BlogDocument } from '@/blocks'
import { generateId } from '@/lib/id'

export interface EditorState {
  document: BlogDocument
  selectedBlockId: string | null

  selectBlock: (id: string | null) => void
  updateTitle: (title: string) => void
  addBlock: (type: BlockType, index?: number) => void
  removeBlock: (id: string) => void
  duplicateBlock: (id: string) => void
  /** Reorder by dnd-kit ids (the active item dropped over another). */
  reorderBlocks: (activeId: string, overId: string) => void
  /** Keyboard/non-drag fallback for moving a block up or down. */
  moveBlock: (id: string, direction: 'up' | 'down') => void
  updateBlockData: (id: string, data: Block['data']) => void
}

export function createEmptyDocument(): BlogDocument {
  return {
    id: generateId(),
    version: CURRENT_DOCUMENT_VERSION,
    title: 'Untitled post',
    status: 'draft',
    blocks: [],
  }
}

function createSeedDocument(): BlogDocument {
  return {
    ...createEmptyDocument(),
    blocks: [
      {
        id: generateId(),
        type: 'text',
        data: {
          html: '<h2>New post</h2><p>Click here to edit this text inline, or add blocks from the left.</p>',
        },
      },
      {
        id: generateId(),
        type: 'image',
        data: {
          src: 'https://picsum.photos/seed/editor/800/400',
          alt: 'Placeholder image',
          caption: '',
        },
      },
    ],
  }
}

export const useEditorStore = create<EditorState>()(
  temporal(
    immer((set, get) => ({
      document: createSeedDocument(),
      selectedBlockId: null,

      selectBlock: (id) =>
        set((state) => {
          state.selectedBlockId = id
        }),

      updateTitle: (title) =>
        set((state) => {
          state.document.title = title
        }),

      addBlock: (type, index) =>
        set((state) => {
          const block = createBlock(type)
          if (index === undefined) {
            state.document.blocks.push(block)
          } else {
            state.document.blocks.splice(index, 0, block)
          }
          state.selectedBlockId = block.id
        }),

      removeBlock: (id) =>
        set((state) => {
          state.document.blocks = state.document.blocks.filter((b) => b.id !== id)
          if (state.selectedBlockId === id) {
            state.selectedBlockId = null
          }
        }),

      duplicateBlock: (id) => {
        // Clone from committed state — immer drafts are Proxies and can't be structuredClone'd.
        const blocks = get().document.blocks
        const index = blocks.findIndex((b) => b.id === id)
        if (index === -1) return
        const clone: Block = { ...structuredClone(blocks[index]), id: generateId() }
        set((state) => {
          state.document.blocks.splice(index + 1, 0, clone)
          state.selectedBlockId = clone.id
        })
      },

      reorderBlocks: (activeId, overId) =>
        set((state) => {
          const from = state.document.blocks.findIndex((b) => b.id === activeId)
          const to = state.document.blocks.findIndex((b) => b.id === overId)
          if (from === -1 || to === -1 || from === to) return
          state.document.blocks = arrayMove(state.document.blocks, from, to)
        }),

      moveBlock: (id, direction) =>
        set((state) => {
          const index = state.document.blocks.findIndex((b) => b.id === id)
          if (index === -1) return
          const to = direction === 'up' ? index - 1 : index + 1
          if (to < 0 || to >= state.document.blocks.length) return
          state.document.blocks = arrayMove(state.document.blocks, index, to)
        }),

      updateBlockData: (id, data) =>
        set((state) => {
          const block = state.document.blocks.find((b) => b.id === id)
          if (block) {
            block.data = data
          }
        }),
    })),
    {
      // Only the document is undoable; selection changes don't pollute history.
      partialize: (state) => ({ document: state.document }),
      // Immer keeps the document reference stable when only selection changes,
      // so reference equality skips no-op history entries.
      equality: (a, b) => a.document === b.document,
      limit: 100,
    },
  ),
)
