import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { Placeholder } from '@tiptap/extensions'
import { useActiveEditor } from './activeEditor'
import type { BlockEditProps } from '../definition'

/**
 * In-place rich-text editing (the Notion experience). A TipTap instance is
 * mounted only while the block is selected on the canvas; on deselect it
 * unmounts and the static TextBlockRender takes over. The editor registers
 * itself as the active editor so the right panel can format it. Alignment is
 * stored in the HTML via TextAlign, so there is no block-level align field.
 */
export function TextBlockInlineEdit({ data, onChange }: BlockEditProps<'text'>) {
  const setActiveEditor = useActiveEditor((s) => s.setEditor)

  const editor = useEditor({
    extensions: [
      StarterKit,
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
