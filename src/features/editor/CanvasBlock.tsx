import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ChevronDown,
  ChevronUp,
  Copy,
  GripVertical,
  Trash2,
} from 'lucide-react'
import { getBlockDefinition, UnknownBlock } from '@/blocks'
import type { Block } from '@/blocks'
import { cn } from '@/lib/utils'
import { useEditorStore } from './store'

interface CanvasBlockProps {
  block: Block
  index: number
  total: number
}

export function CanvasBlock({ block, index, total }: CanvasBlockProps) {
  const selectedId = useEditorStore((s) => s.selectedBlockId)
  const selectBlock = useEditorStore((s) => s.selectBlock)
  const removeBlock = useEditorStore((s) => s.removeBlock)
  const duplicateBlock = useEditorStore((s) => s.duplicateBlock)
  const moveBlock = useEditorStore((s) => s.moveBlock)
  const updateBlockData = useEditorStore((s) => s.updateBlockData)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id })

  const definition = getBlockDefinition(block.type)
  const selected = selectedId === block.id

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation()
        selectBlock(block.id)
      }}
      aria-current={selected}
      className={cn(
        'group relative rounded-lg border bg-background transition-colors',
        selected ? 'border-primary ring-2 ring-primary/40' : 'border-transparent hover:border-border',
        isDragging && 'opacity-50',
      )}
    >
      <div
        className="absolute -top-3 right-2 z-10 flex items-center gap-0.5 rounded-md border bg-background p-0.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 focus-within:opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Drag to reorder"
          className="cursor-grab rounded p-1 text-muted-foreground hover:bg-muted"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Move up"
          disabled={index === 0}
          onClick={() => moveBlock(block.id, 'up')}
          className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
        >
          <ChevronUp className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Move down"
          disabled={index === total - 1}
          onClick={() => moveBlock(block.id, 'down')}
          className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
        >
          <ChevronDown className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Duplicate block"
          onClick={() => duplicateBlock(block.id)}
          className="rounded p-1 text-muted-foreground hover:bg-muted"
        >
          <Copy className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Delete block"
          onClick={() => removeBlock(block.id)}
          className="rounded p-1 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="p-4">
        {!definition ? (
          <UnknownBlock type={block.type} />
        ) : selected && definition.InlineEdit ? (
          <definition.InlineEdit
            data={block.data}
            onChange={(data) => updateBlockData(block.id, data)}
          />
        ) : (
          <definition.Render data={block.data} />
        )}
      </div>
    </div>
  )
}
