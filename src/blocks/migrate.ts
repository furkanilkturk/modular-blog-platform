import { CURRENT_DOCUMENT_VERSION } from './types'
import type { BlogDocument } from './types'

/**
 * Upgrades a stored document to the current schema version. Today it only stamps
 * the version; as block shapes evolve, add steps here (e.g. a switch on
 * `doc.version`) so old content keeps loading. Bump CURRENT_DOCUMENT_VERSION
 * whenever a block's stored shape changes.
 */
export function migrate(doc: BlogDocument): BlogDocument {
  if (doc.version >= CURRENT_DOCUMENT_VERSION) {
    return doc
  }

  // Future per-version migration steps go here, e.g.:
  // if (next.version === 1) { next = upgradeV1toV2(next) }

  return { ...doc, version: CURRENT_DOCUMENT_VERSION }
}
