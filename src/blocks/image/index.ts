import { Image as ImageIcon } from 'lucide-react'
import { defineBlock } from '../definition'
import { imageBlockDataSchema } from '../schemas'
import { ImageBlockEdit } from './ImageBlockEdit'
import { ImageBlockRender } from './ImageBlockRender'

export const imageBlock = defineBlock({
  type: 'image',
  label: 'Image',
  icon: ImageIcon,
  kind: 'static',
  schema: imageBlockDataSchema,
  defaultData: { src: '', alt: '' },
  Edit: ImageBlockEdit,
  Render: ImageBlockRender,
})
