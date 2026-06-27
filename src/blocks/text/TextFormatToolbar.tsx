import { useEditorState, type Editor } from '@tiptap/react'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Link as LinkIcon,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const STYLE_OPTIONS = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
]

const COLORS: { label: string; value: string | null }[] = [
  { label: 'Default', value: null },
  { label: 'Red', value: '#ef4444' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Green', value: '#22c55e' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Purple', value: '#a855f7' },
]

/** Formatting controls for a text block, driven by its TipTap editor. */
export function TextFormatToolbar({ editor }: { editor: Editor }) {
  const active = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      left: editor.isActive({ textAlign: 'left' }),
      center: editor.isActive({ textAlign: 'center' }),
      right: editor.isActive({ textAlign: 'right' }),
      link: editor.isActive('link'),
      style: editor.isActive('heading', { level: 1 })
        ? 'h1'
        : editor.isActive('heading', { level: 2 })
          ? 'h2'
          : editor.isActive('heading', { level: 3 })
            ? 'h3'
            : 'paragraph',
      color: (editor.getAttributes('textStyle').color as string | undefined) ?? null,
    }),
  })

  function setStyle(value: string | null) {
    if (!value) return
    const chain = editor.chain().focus()
    if (value === 'paragraph') {
      chain.setParagraph().run()
    } else {
      chain.setHeading({ level: Number(value.slice(1)) as 1 | 2 | 3 }).run()
    }
  }

  function setColor(value: string | null) {
    if (value === null) {
      editor.chain().focus().unsetColor().run()
    } else {
      editor.chain().focus().setColor(value).run()
    }
  }

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
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Style</Label>
        <Select value={active.style} onValueChange={setStyle}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STYLE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Format</Label>
        <div className="flex flex-wrap items-center gap-1">
          <IconToggle label="Bold" icon={Bold} active={active.bold} onClick={() => editor.chain().focus().toggleBold().run()} />
          <IconToggle label="Italic" icon={Italic} active={active.italic} onClick={() => editor.chain().focus().toggleItalic().run()} />
          <Separator />
          <IconToggle label="Align left" icon={AlignLeft} active={active.left} onClick={() => editor.chain().focus().setTextAlign('left').run()} />
          <IconToggle label="Align center" icon={AlignCenter} active={active.center} onClick={() => editor.chain().focus().setTextAlign('center').run()} />
          <IconToggle label="Align right" icon={AlignRight} active={active.right} onClick={() => editor.chain().focus().setTextAlign('right').run()} />
          <Separator />
          <IconToggle label="Link" icon={LinkIcon} active={active.link} onClick={setLink} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Color</Label>
        <div className="flex flex-wrap items-center gap-1.5">
          {COLORS.map((c) => {
            const isActive = active.color === c.value
            return (
              <button
                key={c.label}
                type="button"
                aria-label={c.label}
                aria-pressed={isActive}
                onClick={() => setColor(c.value)}
                className={cn(
                  'flex size-6 items-center justify-center rounded-full border',
                  isActive && 'ring-2 ring-ring ring-offset-1',
                )}
                style={c.value ? { backgroundColor: c.value } : undefined}
              >
                {c.value === null ? <span className="text-[10px] font-medium">A</span> : null}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Separator() {
  return <span className="mx-0.5 h-5 w-px bg-border" aria-hidden />
}

interface IconToggleProps {
  label: string
  icon: ComponentType<{ className?: string }>
  active: boolean
  onClick: () => void
}

function IconToggle({ label, icon: Icon, active, onClick }: IconToggleProps) {
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
