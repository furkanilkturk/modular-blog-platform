import { lazy } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import { defineBlock } from '../definition'
import { imageBlockDataSchema } from '../schemas'
import { ImageBlockRender } from './ImageBlockRender'

const ImageBlockEdit = lazy(() =>
  import('./ImageBlockEdit').then((m) => ({ default: m.ImageBlockEdit })),
)

export const imageBlock = defineBlock({
  type: 'image',
  label: 'Image',
  icon: ImageIcon,
  kind: 'static',
  schema: imageBlockDataSchema,
  defaultData: { src: '', alt: '' },
  Render: ImageBlockRender,
  Edit: ImageBlockEdit,
})
