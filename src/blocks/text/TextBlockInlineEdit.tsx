import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { Color, TextStyle } from '@tiptap/extension-text-style'
import { Placeholder } from '@tiptap/extensions'
import { useActiveEditor } from './activeEditor'
import type { BlockEditProps } from '../definition'

// Mounts a TipTap editor only while the block is selected; otherwise the static
// TextBlockRender shows. Registers itself so the right panel can format it.
// Alignment is stored in the HTML (TextAlign), so there's no align field.
export function TextBlockInlineEdit({ data, onChange }: BlockEditProps<'text'>) {
  const setActiveEditor = useActiveEditor((s) => s.setEditor)

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Write something…' }),
    ],
    content: data.html || '',
    autofocus: 'end',
    editorProps: {
      attributes: { class: 'tiptap-content min-h-6 focus:outline-none' },
    },
    onUpdate: ({ editor }) => onChange({ html: editor.getHTML() }),
  })

  useEffect(() => {
    if (editor) setActiveEditor(editor)
    return () => setActiveEditor(null)
  }, [editor, setActiveEditor])

  if (!editor) return null
  return <EditorContent editor={editor} />
}
