import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { BlockEditProps } from '../definition'

/**
 * Minimal property panel for Sprint 1 (URL-based). Sprint 3 adds real
 * file upload via URL.createObjectURL; the `src/alt/caption` contract is stable.
 */
export function ImageBlockEdit({ data, onChange }: BlockEditProps<'image'>) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image-src">Image URL</Label>
        <Input
          id="image-src"
          value={data.src}
          placeholder="https://…"
          onChange={(e) => onChange({ ...data, src: e.target.value })}
        />
      </div>
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
