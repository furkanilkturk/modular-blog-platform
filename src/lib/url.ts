const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:']

/**
 * Returns the URL only if it uses a safe protocol (http/https/mailto) or is a
 * relative/anchor link; otherwise returns the fallback. Guards href attributes
 * built from user-authored data against javascript:/data: XSS.
 */
export function safeUrl(url: string | null | undefined, fallback = '#'): string {
  if (!url) return fallback
  const trimmed = url.trim()
  if (!trimmed) return fallback
  // Relative paths and in-page anchors are safe.
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) return trimmed
  try {
    const parsed = new URL(trimmed, 'http://localhost')
    return ALLOWED_PROTOCOLS.includes(parsed.protocol) ? trimmed : fallback
  } catch {
    return fallback
  }
}
