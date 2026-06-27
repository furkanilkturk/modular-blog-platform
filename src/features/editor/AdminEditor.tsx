import { BlockPalette } from './BlockPalette'
import { EditorCanvas } from './EditorCanvas'
import { EditorToolbar } from './EditorToolbar'
import { PropertyPanel } from './PropertyPanel'
import { useEditorKeyboard } from './useEditorKeyboard'

/** Three-panel content editor: palette · live canvas · property panel. */
export function AdminEditor() {
  useEditorKeyboard()

  return (
    <div className="flex h-svh flex-col">
      <EditorToolbar />
      <div className="flex flex-1 overflow-hidden">
        <BlockPalette />
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <EditorCanvas />
        </main>
        <PropertyPanel />
      </div>
    </div>
  )
}
