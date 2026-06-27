import { sanitizeHtml } from '@/lib/sanitize'

describe('sanitizeHtml', () => {
  it('keeps safe markup', () => {
    const html = '<p>Hello <strong>world</strong></p>'
    expect(sanitizeHtml(html)).toBe(html)
  })

  it('strips script tags', () => {
    const result = sanitizeHtml('<p>ok</p><script>alert(1)</script>')
    expect(result).not.toContain('<script>')
    expect(result).toContain('<p>ok</p>')
  })

  it('removes inline event handlers', () => {
    const result = sanitizeHtml('<img src="x" onerror="alert(1)" />')
    expect(result).not.toContain('onerror')
  })
})
