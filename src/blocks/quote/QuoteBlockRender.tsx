import type { QuoteBlockData } from '../types'

export function QuoteBlockRender({ data }: { data: QuoteBlockData }) {
  return (
    <blockquote className="border-l-4 border-primary pl-4">
      <p className="text-lg italic">
        {data.text || 'Empty quote'}
      </p>
      {data.attribution ? (
        <footer className="mt-2 text-sm text-muted-foreground">
          — {data.attribution}
        </footer>
      ) : null}
    </blockquote>
  )
}
