import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUploadField } from '../shared/ImageUploadField'
import type { BlockEditProps } from '../definition'

export function ImageBlockEdit({ data, onChange }: BlockEditProps<'image'>) {
  return (
    <div className="space-y-4">
      <ImageUploadField
        label="Image"
        value={data.src}
        onChange={(src) => onChange({ ...data, src })}
      />
      <div className="space-y-2">
        <Label htmlFor="image-alt">Alt text</Label>
        <Input
          id="image-alt"
          value={data.alt}
          placeholder="Describe the image"
          onChange={(e) => onChange({ ...data, alt: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image-caption">Caption</Label>
        <Input
          id="image-caption"
          value={data.caption ?? ''}
          placeholder="Optional caption"
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
        />
      </div>
    </div>
  )
}
