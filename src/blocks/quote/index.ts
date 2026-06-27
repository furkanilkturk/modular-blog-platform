import { lazy } from 'react'
import { Quote } from 'lucide-react'
import { defineBlock } from '../definition'
import { quoteBlockDataSchema } from '../schemas'
import { QuoteBlockRender } from './QuoteBlockRender'

const QuoteBlockInlineEdit = lazy(() =>
  import('./QuoteBlockInlineEdit').then((m) => ({ default: m.QuoteBlockInlineEdit })),
)

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
