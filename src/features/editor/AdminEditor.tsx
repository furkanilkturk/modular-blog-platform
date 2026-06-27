import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useEditorStore } from './store'
import { AutoSave } from './AutoSave'
import { BlockPalette } from './BlockPalette'
import { EditorCanvas } from './EditorCanvas'
import { EditorToolbar } from './EditorToolbar'
import { PropertyPanel } from './PropertyPanel'
import { useEditorBootstrap } from './useEditorBootstrap'
import { useEditorKeyboard } from './useEditorKeyboard'
import { useEditorPersistence } from './useEditorPersistence'

/**
 * Three-panel content editor: palette · live canvas · property panel.
 * On mobile the side panels become slide-over sheets so the canvas keeps the
 * full width.
 */
export function AdminEditor() {
  useEditorKeyboard()
  const { slug } = useParams<{ slug: string }>()
  const { isLoading, notFound } = useEditorBootstrap(slug)
  const { saveDraft, publish, remove, isSaving } = useEditorPersistence()
  const postId = useEditorStore((s) => s.postId)
  const isMobile = useIsMobile()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [propertiesOpen, setPropertiesOpen] = useState(false)

  if (notFound) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-3 text-center">
        <h1 className="text-2xl font-semibold">Post not found</h1>
        <Link to="/" className="text-primary hover:underline">
          ← Back to all posts
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center text-muted-foreground">
        Loading editor…
      </div>
    )
  }

  return (
    <div className="flex h-svh flex-col">
      <AutoSave />
      <EditorToolbar
        isMobile={isMobile}
        onOpenPalette={() => setPaletteOpen(true)}
        onOpenProperties={() => setPropertiesOpen(true)}
        onSaveDraft={saveDraft}
        onPublish={publish}
        onDelete={remove}
        isSaving={isSaving}
        isExisting={postId !== null}
      />

      <div className="flex flex-1 overflow-hidden">
        {!isMobile ? <BlockPalette /> : null}
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <EditorCanvas />
        </main>
        {!isMobile ? <PropertyPanel /> : null}
      </div>

      {isMobile ? (
        <>
          <Sheet open={paletteOpen} onOpenChange={setPaletteOpen}>
            <SheetContent side="left" className="w-72 gap-0 p-0">
              <SheetHeader>
                <SheetTitle>Blocks</SheetTitle>
              </SheetHeader>
              <BlockPalette embedded onAfterAdd={() => setPaletteOpen(false)} />
            </SheetContent>
          </Sheet>

          <Sheet open={propertiesOpen} onOpenChange={setPropertiesOpen}>
            <SheetContent side="right" className="w-80 gap-0 p-0">
              <SheetHeader>
                <SheetTitle>Properties</SheetTitle>
              </SheetHeader>
              <PropertyPanel embedded />
            </SheetContent>
          </Sheet>
        </>
      ) : null}
    </div>
  )
}
