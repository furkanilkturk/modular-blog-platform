import { useEditorState, type Editor } from '@tiptap/react'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Italic,
  Link as LinkIcon,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { cn } from '@/lib/utils'

/** Formatting controls for a text block, driven by its TipTap editor. */
export function TextFormatToolbar({ editor }: { editor: Editor }) {
  const active = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      h2: editor.isActive('heading', { level: 2 }),
      left: editor.isActive({ textAlign: 'left' }),
      center: editor.isActive({ textAlign: 'center' }),
      right: editor.isActive({ textAlign: 'right' }),
      link: editor.isActive('link'),
    }),
  })

  function setLink() {
    const previous = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link URL', previous ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      <ToolbarButton label="Bold" icon={Bold} active={active.bold} onClick={() => editor.chain().focus().toggleBold().run()} />
      <ToolbarButton label="Italic" icon={Italic} active={active.italic} onClick={() => editor.chain().focus().toggleItalic().run()} />
      <ToolbarButton label="Heading" icon={Heading2} active={active.h2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
      <Separator />
      <ToolbarButton label="Align left" icon={AlignLeft} active={active.left} onClick={() => editor.chain().focus().setTextAlign('left').run()} />
      <ToolbarButton label="Align center" icon={AlignCenter} active={active.center} onClick={() => editor.chain().focus().setTextAlign('center').run()} />
      <ToolbarButton label="Align right" icon={AlignRight} active={active.right} onClick={() => editor.chain().focus().setTextAlign('right').run()} />
      <Separator />
      <ToolbarButton label="Link" icon={LinkIcon} active={active.link} onClick={setLink} />
    </div>
  )
}

function Separator() {
  return <span className="mx-0.5 h-5 w-px bg-border" aria-hidden />
}

interface ToolbarButtonProps {
  label: string
  icon: ComponentType<{ className?: string }>
  active: boolean
  onClick: () => void
}

function ToolbarButton({ label, icon: Icon, active, onClick }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground',
        active && 'bg-muted text-foreground',
      )}
    >
      <Icon className="size-4" />
    </button>
  )
}
