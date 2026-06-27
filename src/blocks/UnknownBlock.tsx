// Fallback for block types not in the registry, so the renderer doesn't crash.
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
