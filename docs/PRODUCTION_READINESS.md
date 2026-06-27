# Production readiness

This is an MVP-scoped case study. The core (block engine, data model, editor) is built
to a standard I'd ship; the operational layer (backend, auth, CI, storage, monitoring) is
deliberately mocked. This note is an honest map of that line and what real deployment
would need.

## Solid today

- Architecture: a single block registry as the source of truth, a typed block model, and
  a renderer with a safe fallback for unknown types.
- Type safety: TypeScript throughout; Zod schemas checked against the TS types.
- Separation of concerns: pure logic (filtering, scoring, store actions) kept out of the
  UI and unit-tested.
- Tests: 58 (Vitest + Testing Library) over the renderer, registry, schemas, store and
  undo/redo, inline editing, quiz, blog filters, the API service, and sanitizing.
- Performance: route-level code splitting and lazy block editors keep TipTap out of the
  reader bundle.
- Client-side security: DOMPurify on rendered HTML, and a protocol allow-list for link
  hrefs (http/https/mailto).
- Resilience: an error boundary around the routes; loading, empty and not-found states.
- Accessibility basics: landmarks, a skip link, aria labels, keyboard drag-and-drop.

## Intentionally mocked / out of scope

- Backend: MSW is the API (in-memory store, no persistence across restarts).
- Auth and roles: none; anyone can edit or delete.
- Image storage: uploads are in-memory object URLs (lost on refresh).
- SSR / SEO: client-side SPA.
- CI/CD: tests and lint run locally only.
- Monitoring: no logging, error reporting or analytics.

## Path to production

1. Real API and data layer. Swap the MSW handlers for a real backend; `api.ts` is the
   seam, so the UI doesn't change. Use an ORM or parameterized queries (never string-built
   SQL). Add a client cache (TanStack Query) for invalidation after publish/delete. Gate
   MSW to dev so it never ships.
2. Auth and authorization: sessions/JWT, protect `/admin*`, enforce ownership on writes.
3. Image storage: object storage (S3/R2) or IndexedDB for the demo; signed uploads.
4. CI/CD: GitHub Actions running `npm ci`, typecheck, lint, tests and build on each PR;
   a pre-commit hook and a committed Prettier config for consistent formatting.
5. Monitoring: error reporting (e.g. Sentry), structured logging, basic analytics.
6. More tests: Playwright for the editor happy path; axe assertions; visual regression on
   key blocks.
7. Hardening: a Content-Security-Policy header, server-side validation and sanitizing,
   rate limiting.
8. Editor: coalesce per-keystroke history into undo steps; handle concurrent edits.

## Notes

- `npm ci` is the clean-install check for CI (Linux). On Windows it can hit a file-lock
  (EPERM) on native binaries like `lightningcss`; that's environmental, not a project bug.
- shadcn/ui here uses the current Base UI variant, not Radix.
