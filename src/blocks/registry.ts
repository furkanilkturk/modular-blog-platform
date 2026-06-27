import type { BlockDefinition } from './definition'
import type { BlockType } from './types'
import { textBlock } from './text'
import { imageBlock } from './image'
import { bannerBlock } from './banner'
import { quoteBlock } from './quote'

/**
 * Single source of truth for block "addons". The palette, dynamic renderer,
 * property panel, validation, and defaults all read from here. Registering a
 * block = adding it to this list. Types not present here render as UnknownBlock,
 * which is what makes the system forward-compatible.
 */
const definitions = [textBlock, imageBlock, bannerBlock, quoteBlock]

export const blockRegistry: Partial<Record<BlockType, BlockDefinition>> =
  Object.fromEntries(
    // Per-block defs are heterogeneous; erase to the loose form for dispatch.
    definitions.map((def) => [def.type, def as BlockDefinition]),
  )

export function getBlockDefinition(
  type: string,
): BlockDefinition | undefined {
  return blockRegistry[type as BlockType]
}

/** Ordered list for the editor palette. */
export const blockList: BlockDefinition[] = definitions as BlockDefinition[]
