import { cn } from '@/lib/utils'
import { sanitizeHtml } from '@/lib/sanitize'
import type { Align, TextBlockData } from '../types'

const alignClass: Record<Align, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export function TextBlockRender({ data }: { data: TextBlockData }) {
  return (
    <div
      className={cn('leading-relaxed', alignClass[data.align])}
      // Sanitized at the boundary; text blocks store editor-produced HTML.
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.html) }}
    />
  )
}
