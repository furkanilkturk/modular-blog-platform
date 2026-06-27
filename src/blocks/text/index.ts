import { Type } from 'lucide-react'
import { defineBlock } from '../definition'
import { textBlockDataSchema } from '../schemas'
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
  // Text is edited in place on the canvas; no right-panel config.
  InlineEdit: TextBlockInlineEdit,
})
