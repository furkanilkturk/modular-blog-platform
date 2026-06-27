import { blockList } from '@/blocks'
import { Button } from '@/components/ui/button'
import { useEditorStore } from './store'

/** Left sidebar: the palette is generated from the block registry. */
export function BlockPalette() {
  const addBlock = useEditorStore((s) => s.addBlock)

  return (
    <aside className="w-56 shrink-0 border-r bg-background p-3">
      <h2 className="mb-3 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Blocks
      </h2>
      <div className="grid gap-1.5">
        {blockList.map((def) => {
          const Icon = def.icon
          return (
            <Button
              key={def.type}
              variant="outline"
              className="justify-start"
              onClick={() => addBlock(def.type)}
            >
              <Icon className="mr-2 size-4" />
              {def.label}
            </Button>
          )
        })}
      </div>
    </aside>
  )
}
