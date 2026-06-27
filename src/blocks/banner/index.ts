import { Megaphone } from 'lucide-react'
import { defineBlock } from '../definition'
import { bannerBlockDataSchema } from '../schemas'
import { BannerBlockEdit } from './BannerBlockEdit'
import { BannerBlockRender } from './BannerBlockRender'

export const bannerBlock = defineBlock({
  type: 'banner',
  label: 'Banner',
  icon: Megaphone,
  kind: 'static',
  schema: bannerBlockDataSchema,
  defaultData: { image: '', buttonText: 'Subscribe', link: '' },
  Render: BannerBlockRender,
  Edit: BannerBlockEdit,
})
