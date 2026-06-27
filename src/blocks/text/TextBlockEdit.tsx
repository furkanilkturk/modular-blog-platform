import { useActiveEditor } from './activeEditor'
import { TextFormatToolbar } from './TextFormatToolbar'
import type { BlockEditProps } from '../definition'

/**
 * Right-panel formatting for the selected text block. Controls are always
 * visible here (no floating popup) and drive the block's active TipTap editor.
 */
export function TextBlockEdit(_props: BlockEditProps<'text'>) {
  const editor = useActiveEditor((s) => s.editor)

  if (!editor) {
    return (
      <p className="text-sm text-muted-foreground">
        Click the text on the canvas to start editing, then format it here.
      </p>
    )
  }
  return <TextFormatToolbar editor={editor} />
}
