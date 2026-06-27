import type { Block } from '@/blocks'
import type { BlogPost } from './types'

function content(parts: Block[]): Block[] {
  return parts
}

function text(id: string, html: string): Block {
  return { id, type: 'text', data: { html } }
}

function image(id: string, seed: string, alt: string, caption?: string): Block {
  return {
    id,
    type: 'image',
    data: { src: `https://picsum.photos/seed/${seed}/1000/520`, alt, caption },
  }
}

function quote(id: string, quoteText: string, attribution?: string): Block {
  return { id, type: 'quote', data: { text: quoteText, attribution } }
}

/** Static seed data. Replaced by MSW-backed endpoints in Sprint 5. */
export const posts: BlogPost[] = [
  {
    id: '1',
    slug: 'modular-block-architecture',
    title: 'Designing a Modular Block Architecture',
    excerpt:
      'How a single block registry turns a blog into an extensible page builder.',
    category: 'Engineering',
    coverImage: 'https://picsum.photos/seed/blocks-cover/1200/630',
    author: 'Ada Lovelace',
    publishedAt: '2026-05-02',
    readingTimeMinutes: 7,
    featured: true,
    status: 'published',
    blocks: content([
      text(
        '1-1',
        '<h2>One registry to rule them all</h2><p>Every page is an array of blocks. The registry maps each block <strong>type</strong> to its renderer, editor, schema, and defaults.</p>',
      ),
      image('1-2', 'architecture', 'A diagram of the block registry', 'The registry is the addon API.'),
      quote('1-3', 'Adding a block type is a single registry entry.', 'The architecture'),
      text('1-4', '<p>This keeps the palette, renderer, and validation in sync automatically.</p>'),
    ]),
  },
  {
    id: '2',
    slug: 'notion-style-inline-editing',
    title: 'Notion-Style Inline Editing with TipTap',
    excerpt:
      'Editing content where it lives, with a floating toolbar instead of a sidebar.',
    category: 'Engineering',
    coverImage: 'https://picsum.photos/seed/editing-cover/1200/630',
    author: 'Grace Hopper',
    publishedAt: '2026-05-18',
    readingTimeMinutes: 6,
    featured: true,
    status: 'published',
    blocks: content([
      text('2-1', '<h2>Write where you read</h2><p>A TipTap instance mounts only on the focused block.</p>'),
      quote('2-2', 'Nobody should write prose in a sidebar.'),
    ]),
  },
  {
    id: '3',
    slug: 'accessible-drag-and-drop',
    title: 'Accessible Drag and Drop',
    excerpt: 'Keyboard sensors and move buttons make reordering usable for everyone.',
    category: 'Design',
    coverImage: 'https://picsum.photos/seed/dnd-cover/1200/630',
    author: 'Ada Lovelace',
    publishedAt: '2026-04-21',
    readingTimeMinutes: 5,
    featured: false,
    status: 'published',
    blocks: content([
      text('3-1', '<h2>Drag is not enough</h2><p>Provide a non-drag fallback for mobile and assistive tech.</p>'),
    ]),
  },
  {
    id: '4',
    slug: 'type-safe-content-with-zod',
    title: 'Type-Safe Content with Zod',
    excerpt: 'Validating block data with discriminated unions that mirror your types.',
    category: 'Engineering',
    coverImage: 'https://picsum.photos/seed/zod-cover/1200/630',
    author: 'Barbara Liskov',
    publishedAt: '2026-03-30',
    readingTimeMinutes: 8,
    featured: false,
    status: 'published',
    blocks: content([
      text('4-1', '<h2>Schemas that can’t drift</h2><p>Each schema is checked against its TypeScript type.</p>'),
    ]),
  },
  {
    id: '5',
    slug: 'undo-redo-that-feels-right',
    title: 'Undo/Redo That Feels Right',
    excerpt: 'History scoped to content, so selection never pollutes your undo stack.',
    category: 'Product',
    coverImage: 'https://picsum.photos/seed/undo-cover/1200/630',
    author: 'Grace Hopper',
    publishedAt: '2026-06-09',
    readingTimeMinutes: 4,
    featured: false,
    status: 'published',
    blocks: content([
      text('5-1', '<h2>Only the document is undoable</h2><p>Reference equality skips no-op history entries.</p>'),
    ]),
  },
  {
    id: '6',
    slug: 'building-an-interactive-quiz-block',
    title: 'Building an Interactive Quiz Block',
    excerpt: 'Proving the registry handles stateful, interactive addons, not just static content.',
    category: 'Product',
    coverImage: 'https://picsum.photos/seed/quiz-cover/1200/630',
    author: 'Barbara Liskov',
    publishedAt: '2026-06-15',
    readingTimeMinutes: 6,
    featured: false,
    status: 'published',
    blocks: content([
      text('6-1', '<h2>Addons can be interactive</h2><p>A quiz block scores answers in the read view.</p>'),
    ]),
  },
  {
    id: '7',
    slug: 'draft-only-preview',
    title: 'A Draft You Should Not See',
    excerpt: 'This post is a draft and should be excluded from the public list.',
    category: 'Engineering',
    coverImage: 'https://picsum.photos/seed/draft-cover/1200/630',
    author: 'Ada Lovelace',
    publishedAt: '2026-06-20',
    readingTimeMinutes: 3,
    featured: false,
    status: 'draft',
    blocks: content([text('7-1', '<p>Draft content.</p>')]),
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}
