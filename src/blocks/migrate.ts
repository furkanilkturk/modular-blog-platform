import { CURRENT_DOCUMENT_VERSION } from './types'
import type { BlogDocument } from './types'

// Upgrades a stored document to the current schema version. For now it just
// stamps the version; per-version steps would go here as block shapes change.
export function migrate(doc: BlogDocument): BlogDocument {
  if (doc.version >= CURRENT_DOCUMENT_VERSION) {
    return doc
  }
  return { ...doc, version: CURRENT_DOCUMENT_VERSION }
}
