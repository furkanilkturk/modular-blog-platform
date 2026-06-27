import { blogDocumentSchema } from '@/blocks'
import type { BlogDocument } from '@/blocks'

const KEY = 'modular-blog:draft'

/** Persists the in-progress new-post document for crash protection. */
export function saveLocalDraft(document: BlogDocument): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(document))
  } catch {
    // ignore quota / unavailable storage
  }
}

export function loadLocalDraft(): BlogDocument | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = blogDocumentSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export function clearLocalDraft(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
