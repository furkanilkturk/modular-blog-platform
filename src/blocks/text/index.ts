import { Type } from 'lucide-react'
import { defineBlock } from '../definition'
import { textBlockDataSchema } from '../schemas'
import { TextBlockEdit } from './TextBlockEdit'
import { TextBlockRender } from './TextBlockRender'

export const textBlock = defineBlock({
  type: 'text',
  label: 'Text',
  icon: Type,
  kind: 'static',
  schema: textBlockDataSchema,
  defaultData: { html: '', align: 'left' },
  Edit: TextBlockEdit,
  Render: TextBlockRender,
})
