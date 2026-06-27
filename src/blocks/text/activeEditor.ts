import { create } from 'zustand'
import type { Editor } from '@tiptap/core'

/**
 * Holds the TipTap editor of the currently-focused text block so the right
 * panel's formatting toolbar can drive it. The inline editor registers itself
 * on mount and clears on unmount.
 */
interface ActiveEditorState {
  editor: Editor | null
  setEditor: (editor: Editor | null) => void
}

export const useActiveEditor = create<ActiveEditorState>((set) => ({
  editor: null,
  setEditor: (editor) => set({ editor }),
}))
