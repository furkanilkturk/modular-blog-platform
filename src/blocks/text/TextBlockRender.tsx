import { sanitizeHtml } from '@/lib/sanitize'
import type { TextBlockData } from '../types'

export function TextBlockRender({ data }: { data: TextBlockData }) {
  if (!data.html) {
    return <p className="text-muted-foreground">Empty text block</p>
  }
  return (
    <div
      className="tiptap-content leading-relaxed"
      // Sanitized at the boundary; text blocks store editor-produced HTML.
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.html) }}
    />
  )
}
