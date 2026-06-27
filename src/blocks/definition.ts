import type { ComponentType } from 'react'
import type { z } from 'zod'
import type { BlockDataMap, BlockType } from './types'

export type BlockKind = 'static' | 'interactive'

export interface BlockRenderProps<T extends BlockType> {
  data: BlockDataMap[T]
}

export interface BlockEditProps<T extends BlockType> {
  data: BlockDataMap[T]
  onChange: (data: BlockDataMap[T]) => void
}

/**
 * A self-contained block "addon": metadata + validation + the two views.
 * `Render` is the read/canvas view; `Edit` is the property panel. The registry
 * wires these into the palette, the dynamic renderer, validation, and defaults,
 * so adding a block type is a single registry entry.
 */
export interface BlockDefinition<T extends BlockType = BlockType> {
  type: T
  label: string
  icon: ComponentType<{ className?: string }>
  kind: BlockKind
  schema: z.ZodType<BlockDataMap[T]>
  defaultData: BlockDataMap[T]
  Edit: ComponentType<BlockEditProps<T>>
  Render: ComponentType<BlockRenderProps<T>>
}

/** Identity helper that gives full per-block type inference at the call site. */
export function defineBlock<T extends BlockType>(
  definition: BlockDefinition<T>,
): BlockDefinition<T> {
  return definition
}
