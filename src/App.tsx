import { DynamicRenderer } from '@/blocks'
import { sampleDocument } from '@/sample-document'

function App() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <header className="mb-8 border-b pb-4">
        <p className="text-sm text-muted-foreground">Modular Blog Platform</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {sampleDocument.title}
        </h1>
      </header>
      <article className="space-y-6">
        <DynamicRenderer blocks={sampleDocument.blocks} />
      </article>
    </main>
  )
}

export default App
