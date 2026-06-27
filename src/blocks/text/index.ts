import { lazy } from 'react'
import { Type } from 'lucide-react'
import { defineBlock } from '../definition'
import { textBlockDataSchema } from '../schemas'
import { TextBlockRender } from './TextBlockRender'

// Editor-only views are lazy so the reader bundle never loads TipTap.
const TextBlockInlineEdit = lazy(() =>
  import('./TextBlockInlineEdit').then((m) => ({ default: m.TextBlockInlineEdit })),
)
const TextBlockEdit = lazy(() =>
  import('./TextBlockEdit').then((m) => ({ default: m.TextBlockEdit })),
)

export const textBlock = defineBlock({
  type: 'text',
  label: 'Text',
  icon: Type,
  kind: 'static',
  schema: textBlockDataSchema,
  defaultData: { html: '' },
  Render: TextBlockRender,
  // Typed inline on the canvas; formatting controls live in the right panel.
  InlineEdit: TextBlockInlineEdit,
  Edit: TextBlockEdit,
})
