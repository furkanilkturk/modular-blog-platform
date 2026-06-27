import { lazy } from 'react'
import { Megaphone } from 'lucide-react'
import { defineBlock } from '../definition'
import { bannerBlockDataSchema } from '../schemas'
import { BannerBlockRender } from './BannerBlockRender'

const BannerBlockEdit = lazy(() =>
  import('./BannerBlockEdit').then((m) => ({ default: m.BannerBlockEdit })),
)

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
