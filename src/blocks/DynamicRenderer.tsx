import { getBlockDefinition } from './registry'
import { UnknownBlock } from './UnknownBlock'
import type { Block } from './types'

/**
 * Renders a list of blocks by looking each one up in the registry. Dispatch is
 * keyed by `block.id`; unknown/unregistered types fall back to UnknownBlock.
 * `data` is passed as one typed prop — never spread — so each block owns its shape.
 */
export function DynamicRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block) => {
        const definition = getBlockDefinition(block.type)
        if (!definition) {
          return <UnknownBlock key={block.id} type={block.type} />
        }
        const { Render } = definition
        return <Render key={block.id} data={block.data} />
      })}
    </>
  )
}
