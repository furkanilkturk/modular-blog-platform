import { Type } from 'lucide-react'
import { defineBlock } from '../definition'
import { textBlockDataSchema } from '../schemas'
import { TextBlockEdit } from './TextBlockEdit'
import { TextBlockInlineEdit } from './TextBlockInlineEdit'
import { TextBlockRender } from './TextBlockRender'

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
