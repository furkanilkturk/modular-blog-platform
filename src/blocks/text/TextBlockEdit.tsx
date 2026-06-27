import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { BlockEditProps } from '../definition'
import type { Align } from '../types'

const ALIGNMENTS: Align[] = ['left', 'center', 'right']

/**
 * Minimal property panel for Sprint 1. Sprint 3 swaps the textarea for a
 * focused TipTap instance; the data contract (`html`, `align`) stays the same.
 */
export function TextBlockEdit({ data, onChange }: BlockEditProps<'text'>) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text-html">Content</Label>
        <Textarea
          id="text-html"
          value={data.html}
          rows={6}
          placeholder="Write something…"
          onChange={(e) => onChange({ ...data, html: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="text-align">Alignment</Label>
        <Select
          value={data.align}
          onValueChange={(value) => onChange({ ...data, align: value as Align })}
        >
          <SelectTrigger id="text-align">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ALIGNMENTS.map((align) => (
              <SelectItem key={align} value={align}>
                {align}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
