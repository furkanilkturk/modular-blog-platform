/**
 * Fallback for block types that aren't in the registry (unknown, or a known
 * type not yet implemented). Keeps the renderer crash-proof and forward-compatible.
 */
export function UnknownBlock({ type }: { type: string }) {
  return (
    <div
      role="alert"
      className="rounded-md border border-dashed border-destructive/50 bg-destructive/5 p-4 text-sm text-muted-foreground"
    >
      Unknown block type: <code className="font-mono">{type}</code>
    </div>
  )
}
