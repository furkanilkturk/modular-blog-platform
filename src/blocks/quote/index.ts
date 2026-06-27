import { Quote } from 'lucide-react'
import { defineBlock } from '../definition'
import { quoteBlockDataSchema } from '../schemas'
import { QuoteBlockInlineEdit } from './QuoteBlockInlineEdit'
import { QuoteBlockRender } from './QuoteBlockRender'

export const quoteBlock = defineBlock({
  type: 'quote',
  label: 'Quote',
  icon: Quote,
  kind: 'static',
  schema: quoteBlockDataSchema,
  defaultData: { text: '' },
  Render: QuoteBlockRender,
  InlineEdit: QuoteBlockInlineEdit,
})
