import { blockList } from '@/blocks'
import type { BlockType } from '@/blocks'
import { Button } from '@/components/ui/button'
import { useEditorStore } from './store'

interface BlockPaletteProps {
  /** Render without the fixed-width sidebar chrome (e.g. inside a Sheet). */
  embedded?: boolean
  /** Called after a block is added (used to close the mobile sheet). */
  onAfterAdd?: () => void
}

/** Left sidebar: the palette is generated from the block registry. */
export function BlockPalette({ embedded = false, onAfterAdd }: BlockPaletteProps) {
  const addBlock = useEditorStore((s) => s.addBlock)

  function handleAdd(type: BlockType) {
    addBlock(type)
    onAfterAdd?.()
  }

  const items = (
    <div className="grid gap-1.5">
      {blockList.map((def) => {
        const Icon = def.icon
        return (
          <Button
            key={def.type}
            variant="outline"
            className="justify-start"
            onClick={() => handleAdd(def.type)}
          >
            <Icon className="mr-2 size-4" />
            {def.label}
          </Button>
        )
      })}
    </div>
  )

  if (embedded) {
    return <div className="px-4 pb-4">{items}</div>
  }

  return (
    <aside className="w-56 shrink-0 border-r bg-background p-3">
      <h2 className="mb-3 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Blocks
      </h2>
      {items}
    </aside>
  )
}
