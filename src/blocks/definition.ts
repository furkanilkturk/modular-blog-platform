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
 * A self-contained block "addon": metadata + validation + its views.
 *
 * - `Render` — read view (blog detail) and the static canvas view.
 * - `InlineEdit` — optional in-place editor shown on the canvas while the block
 *   is selected (the Notion-style experience, e.g. TipTap for text).
 * - `Edit` — optional right-panel config for properties that don't belong inline
 *   (the Webflow-style experience, e.g. an image's alt text or a banner's link).
 *
 * A block provides whichever editing surfaces make sense: text is inline-only,
 * image is panel-only, a banner could use both. The registry wires all of this
 * into the palette, renderer, property panel, validation, and defaults.
 */
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

/** Identity helper that gives full per-block type inference at the call site. */
export function defineBlock<T extends BlockType>(
  definition: BlockDefinition<T>,
): BlockDefinition<T> {
  return definition
}
