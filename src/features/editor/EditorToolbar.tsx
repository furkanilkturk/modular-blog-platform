import { Redo2, Undo2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEditorStore } from './store'
import { useEditorHistory } from './useEditorHistory'

export function EditorToolbar() {
  const title = useEditorStore((s) => s.document.title)
  const updateTitle = useEditorStore((s) => s.updateTitle)
  const { undo, redo, canUndo, canRedo } = useEditorHistory()

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
      <Input
        aria-label="Post title"
        value={title}
        onChange={(e) => updateTitle(e.target.value)}
        className="max-w-sm border-transparent text-base font-medium shadow-none focus-visible:border-input"
      />
      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Undo"
          disabled={!canUndo}
          onClick={() => undo()}
        >
          <Undo2 className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Redo"
          disabled={!canRedo}
          onClick={() => redo()}
        >
          <Redo2 className="size-4" />
        </Button>
      </div>
    </header>
  )
}
