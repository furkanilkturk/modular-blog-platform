import { Button } from '@/components/ui/button'

function App() {
  return (
    <main className="min-h-svh flex flex-col items-center justify-center gap-6 p-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Modular Blog Platform
        </h1>
        <p className="text-muted-foreground">
          Toolchain ready — block engine coming in Sprint 1.
        </p>
      </div>
      <Button>It works</Button>
    </main>
  )
}

export default App
