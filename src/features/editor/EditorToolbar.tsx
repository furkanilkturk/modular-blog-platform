import { PanelLeft, Redo2, SlidersHorizontal, Undo2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEditorStore } from './store'
import { useEditorHistory } from './useEditorHistory'

interface EditorToolbarProps {
  isMobile: boolean
  onOpenPalette: () => void
  onOpenProperties: () => void
}

export function EditorToolbar({
  isMobile,
  onOpenPalette,
  onOpenProperties,
}: EditorToolbarProps) {
  const title = useEditorStore((s) => s.document.title)
  const updateTitle = useEditorStore((s) => s.updateTitle)
  const { undo, redo, canUndo, canRedo } = useEditorHistory()

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-3 sm:px-4">
      {isMobile ? (
        <Button variant="ghost" size="icon" aria-label="Open blocks" onClick={onOpenPalette}>
          <PanelLeft className="size-4" />
        </Button>
      ) : null}

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
        {isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open properties"
            onClick={onOpenProperties}
          >
            <SlidersHorizontal className="size-4" />
          </Button>
        ) : null}
      </div>
    </header>
  )
}
