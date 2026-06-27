import type { BlogDocument } from '@/blocks'

/** Temporary seed used to demo the engine until the mock API lands (Sprint 5). */
export const sampleDocument: BlogDocument = {
  id: 'sample-1',
  version: 1,
  title: 'React Best Practices',
  status: 'published',
  blocks: [
    {
      id: 'b1',
      type: 'text',
      data: {
        html: '<h2>Welcome</h2><p>This page is assembled from <strong>reusable blocks</strong> rendered dynamically by the engine.</p>',
        align: 'left',
      },
    },
    {
      id: 'b2',
      type: 'image',
      data: {
        src: 'https://picsum.photos/seed/blocks/800/400',
        alt: 'A placeholder hero image',
        caption: 'Images are just another block type.',
      },
    },
    {
      id: 'b3',
      type: 'text',
      data: {
        html: '<p>Add a block type by dropping a folder and registering it — that single registry is the addon API.</p>',
        align: 'center',
      },
    },
    {
      // A known type that isn't registered yet → renders the UnknownBlock fallback.
      id: 'b4',
      type: 'banner',
      data: { image: '', buttonText: 'Subscribe', link: '#', background: '' },
    },
  ],
}
