import { useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { BlockPalette } from './BlockPalette'
import { EditorCanvas } from './EditorCanvas'
import { EditorToolbar } from './EditorToolbar'
import { PropertyPanel } from './PropertyPanel'
import { useEditorKeyboard } from './useEditorKeyboard'

/**
 * Three-panel content editor: palette · live canvas · property panel.
 * On mobile the side panels become slide-over sheets so the canvas keeps the
 * full width.
 */
export function AdminEditor() {
  useEditorKeyboard()
  const isMobile = useIsMobile()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [propertiesOpen, setPropertiesOpen] = useState(false)

  return (
    <div className="flex h-svh flex-col">
      <EditorToolbar
        isMobile={isMobile}
        onOpenPalette={() => setPaletteOpen(true)}
        onOpenProperties={() => setPropertiesOpen(true)}
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
