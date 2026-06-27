import type { ImageBlockData } from '../types'

export function ImageBlockRender({ data }: { data: ImageBlockData }) {
  if (!data.src) return null
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
