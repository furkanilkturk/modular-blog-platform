import { migrate } from './migrate'
import { CURRENT_DOCUMENT_VERSION } from './types'
import type { BlogDocument } from './types'

const baseDoc: BlogDocument = {
  id: 'doc-1',
  version: CURRENT_DOCUMENT_VERSION,
  title: 'Doc',
  status: 'draft',
  blocks: [],
}

describe('migrate', () => {
  it('returns current-version documents unchanged', () => {
    const result = migrate(baseDoc)
    expect(result).toBe(baseDoc)
  })

  it('stamps the current version onto an older document', () => {
    const old = { ...baseDoc, version: 0 }
    const result = migrate(old)
    expect(result.version).toBe(CURRENT_DOCUMENT_VERSION)
    expect(result).not.toBe(old)
  })
})
