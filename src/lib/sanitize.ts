import DOMPurify from 'dompurify'

/**
 * Sanitize untrusted/rich HTML before rendering it with dangerouslySetInnerHTML.
 * Text blocks store HTML produced by the editor; always pass it through here.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, { USE_PROFILES: { html: true } })
}
