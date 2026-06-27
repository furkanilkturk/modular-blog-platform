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

// Render = read + static canvas view. InlineEdit = optional in-place editor on
// the canvas. Edit = optional right-panel config. A block provides whichever it needs.
export interface BlockDefinition<T extends BlockType = BlockType> {
  type: T
  label: string
  icon: ComponentType<{ className?: string }>
  kind: BlockKind
  schema: z.ZodType<BlockDataMap[T]>
  defaultData: BlockDataMap[T]
  Render: ComponentType<BlockRenderProps<T>>
  InlineEdit?: ComponentType<BlockEditProps<T>>
  Edit?: ComponentType<BlockEditProps<T>>
}

// Identity helper so each block gets full type inference at the call site.
export function defineBlock<T extends BlockType>(
  definition: BlockDefinition<T>,
): BlockDefinition<T> {
  return definition
}
