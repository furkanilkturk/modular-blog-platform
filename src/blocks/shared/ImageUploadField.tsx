import { useId, useRef } from 'react'
import { ImageUp, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface ImageUploadFieldProps {
  label: string
  value: string
  onChange: (src: string) => void
}

// Turns the chosen file into an in-memory object URL (no backend/storage).
// Note: object URLs are lost on refresh.
export function ImageUploadField({ label, value, onChange }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const id = useId()

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onChange(URL.createObjectURL(file))
    e.target.value = ''
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {value ? (
        <div className="group relative overflow-hidden rounded-md border">
          <img src={value} alt="" className="h-28 w-full object-cover" />
          <button
            type="button"
            aria-label="Remove image"
            onClick={() => onChange('')}
            className="absolute right-1 top-1 rounded bg-background/80 p-1 text-foreground opacity-0 transition-opacity group-hover:opacity-100"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}
      <input
        id={id}
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFile}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => inputRef.current?.click()}
      >
        <ImageUp className="mr-2 size-4" />
        {value ? 'Replace image' : 'Upload image'}
      </Button>
    </div>
  )
}
