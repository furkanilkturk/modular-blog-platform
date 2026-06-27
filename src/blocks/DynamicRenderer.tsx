import { getBlockDefinition } from './registry'
import { UnknownBlock } from './UnknownBlock'
import type { Block } from './types'

// Looks each block up in the registry and renders its Render component, keyed by
// id. Unknown types fall back to UnknownBlock. data is passed as one typed prop.
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
