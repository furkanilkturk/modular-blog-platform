import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUploadField } from '../shared/ImageUploadField'
import type { BlockEditProps } from '../definition'

export function BannerBlockEdit({ data, onChange }: BlockEditProps<'banner'>) {
  return (
    <div className="space-y-4">
      <ImageUploadField
        label="Background image"
        value={data.image}
        onChange={(image) => onChange({ ...data, image })}
      />
      <div className="space-y-2">
        <Label htmlFor="banner-button">Button text</Label>
        <Input
          id="banner-button"
          value={data.buttonText}
          placeholder="Subscribe"
          onChange={(e) => onChange({ ...data, buttonText: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="banner-link">Link</Label>
        <Input
          id="banner-link"
          value={data.link}
          placeholder="https://…"
          onChange={(e) => onChange({ ...data, link: e.target.value })}
        />
      </div>
    </div>
  )
}
