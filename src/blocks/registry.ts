import type { BlockDefinition } from './definition'
import type { BlockType } from './types'
import { textBlock } from './text'
import { imageBlock } from './image'
import { bannerBlock } from './banner'
import { quoteBlock } from './quote'
import { quizBlock } from './quiz'

// The palette, renderer, property panel, validation and defaults all read from
// this list. To add a block, add it here. Unlisted types render as UnknownBlock.
const definitions = [textBlock, imageBlock, bannerBlock, quoteBlock, quizBlock]

export const blockRegistry: Partial<Record<BlockType, BlockDefinition>> =
  Object.fromEntries(
    // defs are heterogeneous; erase to the loose form for dispatch
    definitions.map((def) => [def.type, def as BlockDefinition]),
  )

export function getBlockDefinition(type: string): BlockDefinition | undefined {
  return blockRegistry[type as BlockType]
}

export const blockList: BlockDefinition[] = definitions as BlockDefinition[]
