import { useEffect } from 'react'
import { useEditorHistory } from './useEditorHistory'

/** Wires Cmd/Ctrl+Z (undo) and Cmd/Ctrl+Shift+Z or Ctrl+Y (redo). */
export function useEditorKeyboard() {
  const { undo, redo, canUndo, canRedo } = useEditorHistory()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!(e.metaKey || e.ctrlKey)) return
      const key = e.key.toLowerCase()
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo) undo()
      } else if ((key === 'z' && e.shiftKey) || key === 'y') {
        e.preventDefault()
        if (canRedo) redo()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [undo, redo, canUndo, canRedo])
}
