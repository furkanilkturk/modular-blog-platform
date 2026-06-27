import { generateId } from '@/lib/id'
import { getBlockDefinition } from './registry'
import type { Block, BlockType } from './types'

// Creates a block from the registry's defaultData (deep-cloned so blocks don't
// share nested references). Throws for unregistered types.
export function createBlock(type: BlockType): Block {
  const definition = getBlockDefinition(type)
  if (!definition) {
    throw new Error(`Cannot create block: unknown type "${type}"`)
  }
  return {
    id: generateId(),
    type,
    data: structuredClone(definition.defaultData),
  } as Block
}
