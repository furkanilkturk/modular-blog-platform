import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useEditorStore } from './store'
import { CanvasBlock } from './CanvasBlock'

/** Center canvas: a sortable, selectable live preview of the document's blocks. */
export function EditorCanvas() {
  const blocks = useEditorStore((s) => s.document.blocks)
  const reorderBlocks = useEditorStore((s) => s.reorderBlocks)
  const selectBlock = useEditorStore((s) => s.selectBlock)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      reorderBlocks(String(active.id), String(over.id))
    }
  }

  return (
    <div
      className="min-h-full p-6"
      onClick={() => selectBlock(null)}
    >
      <div className="mx-auto max-w-2xl">
        {blocks.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
            Add a block from the left to start building your page.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {blocks.map((block, index) => (
                  <CanvasBlock
                    key={block.id}
                    block={block}
                    index={index}
                    total={blocks.length}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}
