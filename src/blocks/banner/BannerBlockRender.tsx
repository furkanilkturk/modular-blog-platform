import type { BannerBlockData } from '../types'

export function BannerBlockRender({ data }: { data: BannerBlockData }) {
  const style = data.image
    ? { backgroundImage: `url(${data.image})` }
    : { backgroundColor: data.background || 'var(--muted)' }

  return (
    <div
      className="flex min-h-44 flex-col items-center justify-center gap-4 rounded-lg bg-cover bg-center p-8 text-center"
      style={style}
    >
      {data.buttonText ? (
        <a
          href={data.link || '#'}
          className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
        >
          {data.buttonText}
        </a>
      ) : (
        <span className="text-sm text-muted-foreground">Banner</span>
      )}
    </div>
  )
}
