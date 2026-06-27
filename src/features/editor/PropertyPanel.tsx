import type { ComponentType } from 'react'
import { getBlockDefinition, UnknownBlock } from '@/blocks'
import type { BlockEditProps } from '@/blocks'
import type { BlockType } from '@/blocks'
import { useEditorStore } from './store'

/** Right sidebar: renders the selected block's Edit panel from the registry. */
export function PropertyPanel() {
  const selectedId = useEditorStore((s) => s.selectedBlockId)
  const block = useEditorStore(
    (s) => s.document.blocks.find((b) => b.id === selectedId) ?? null,
  )
  const updateBlockData = useEditorStore((s) => s.updateBlockData)

  let content
  if (!block) {
    content = (
      <p className="text-sm text-muted-foreground">
        Select a block to edit its properties.
      </p>
    )
  } else {
    const definition = getBlockDefinition(block.type)
    if (!definition) {
      content = <UnknownBlock type={block.type} />
    } else {
      // Dispatch boundary: the selected block guarantees the data matches this Edit.
      const Edit = definition.Edit as ComponentType<BlockEditProps<BlockType>>
      content = (
        <>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {definition.label}
          </h2>
          <Edit
            data={block.data}
            onChange={(data) => updateBlockData(block.id, data)}
          />
        </>
      )
    }
  }

  return (
    <aside className="w-72 shrink-0 overflow-y-auto border-l bg-background p-4">
      {content}
    </aside>
  )
}
