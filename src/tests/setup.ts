import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from '@/mocks/server'
import { resetDb } from '@/mocks/db'

// This jsdom build doesn't provide a working localStorage; polyfill it.
if (typeof localStorage === 'undefined' || typeof localStorage.clear !== 'function') {
  const store = new Map<string, string>()
  const mock: Storage = {
    getItem: (k) => (store.has(k) ? store.get(k)! : null),
    setItem: (k, v) => void store.set(k, String(v)),
    removeItem: (k) => void store.delete(k),
    clear: () => store.clear(),
    key: (i) => Array.from(store.keys())[i] ?? null,
    get length() {
      return store.size
    },
  }
  Object.defineProperty(window, 'localStorage', { value: mock, writable: true })
  Object.defineProperty(globalThis, 'localStorage', { value: mock, writable: true })
}

// jsdom doesn't implement getClientRects; ProseMirror/TipTap calls it.
const emptyRect = {
  x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0,
  toJSON: () => ({}),
} as DOMRect
if (typeof Range !== 'undefined') {
  Range.prototype.getClientRects = () => [] as unknown as DOMRectList
  Range.prototype.getBoundingClientRect = () => emptyRect
}
if (!Element.prototype.getClientRects) {
  Element.prototype.getClientRects = () => [] as unknown as DOMRectList
}

// jsdom doesn't implement matchMedia; needed by useIsMobile.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
})

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))

afterEach(() => {
  cleanup()
  server.resetHandlers()
  resetDb()
  localStorage.clear()
})

afterAll(() => server.close())
