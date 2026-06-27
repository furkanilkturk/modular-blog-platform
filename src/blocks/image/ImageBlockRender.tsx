import { Image as ImageIcon } from 'lucide-react'
import type { ImageBlockData } from '../types'

export function ImageBlockRender({ data }: { data: ImageBlockData }) {
  if (!data.src) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
        <ImageIcon className="mr-2 size-5" />
        <span className="text-sm">Upload an image in the panel</span>
      </div>
    )
  }
  return (
    <figure className="space-y-2">
      <img
        src={data.src}
        alt={data.alt}
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
      {data.caption ? (
        <figcaption className="text-center text-sm text-muted-foreground">
          {data.caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
