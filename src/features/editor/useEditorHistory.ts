import { useStore } from 'zustand'
import { useEditorStore } from './store'

/** Exposes undo/redo from zundo's temporal store plus reactive can-undo/redo flags. */
export function useEditorHistory() {
  const { undo, redo, clear } = useEditorStore.temporal.getState()
  const canUndo = useStore(useEditorStore.temporal, (s) => s.pastStates.length > 0)
  const canRedo = useStore(useEditorStore.temporal, (s) => s.futureStates.length > 0)
  return { undo, redo, clear, canUndo, canRedo }
}
