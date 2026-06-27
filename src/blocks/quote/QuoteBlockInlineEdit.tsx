import type { BlockEditProps } from '../definition'

/** Inline editing for the quote: text and attribution are edited in place. */
export function QuoteBlockInlineEdit({ data, onChange }: BlockEditProps<'quote'>) {
  return (
    <blockquote className="border-l-4 border-primary pl-4">
      <textarea
        autoFocus
        aria-label="Quote text"
        value={data.text}
        rows={2}
        placeholder="Quote…"
        onChange={(e) => onChange({ ...data, text: e.target.value })}
        className="w-full resize-none bg-transparent text-lg italic placeholder:text-muted-foreground focus:outline-none"
      />
      <input
        aria-label="Attribution"
        value={data.attribution ?? ''}
        placeholder="Attribution (optional)"
        onChange={(e) => onChange({ ...data, attribution: e.target.value })}
        className="mt-1 w-full bg-transparent text-sm text-muted-foreground placeholder:text-muted-foreground/70 focus:outline-none"
      />
    </blockquote>
  )
}
