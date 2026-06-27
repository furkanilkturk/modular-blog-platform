import { generateId } from '@/lib/id'
import { getBlockDefinition } from './registry'
import type { Block, BlockType } from './types'

/**
 * Creates a fresh block of the given type using the registry's `defaultData`.
 * Deep-clones the defaults so blocks never share nested references.
 * Throws for types that aren't registered.
 */
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
