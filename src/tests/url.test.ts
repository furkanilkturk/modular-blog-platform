import { describe, expect, it } from 'vitest'
import { safeUrl } from '@/lib/url'

describe('safeUrl', () => {
  it('allows http/https/mailto', () => {
    expect(safeUrl('https://example.com')).toBe('https://example.com')
    expect(safeUrl('http://example.com')).toBe('http://example.com')
    expect(safeUrl('mailto:a@b.com')).toBe('mailto:a@b.com')
  })

  it('allows relative paths and anchors', () => {
    expect(safeUrl('/about')).toBe('/about')
    expect(safeUrl('#section')).toBe('#section')
  })

  it('blocks javascript: and data: URLs', () => {
    expect(safeUrl('javascript:alert(1)')).toBe('#')
    expect(safeUrl('data:text/html;base64,xxx')).toBe('#')
    expect(safeUrl('vbscript:msgbox(1)')).toBe('#')
  })

  it('falls back for empty/invalid input', () => {
    expect(safeUrl('')).toBe('#')
    expect(safeUrl(undefined)).toBe('#')
    expect(safeUrl('   ', '/home')).toBe('/home')
  })
})
