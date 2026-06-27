# Production Readiness

This project is an intentionally **MVP-scoped case study** whose *core* (the block
engine, type-safe data model, editor) is built to production standards, while the
*operational* layer (backend, auth, CI, storage, observability) is deliberately mocked.

This document is an honest map of that line: what is production-grade today, what is
intentionally mocked, and the concrete path to a real deployment.

Legend: ✅ done · 🟡 partial · ⛔ intentionally out of scope (mocked/skipped)

## Production-grade today

- ✅ **Architecture** — block registry as a single source of truth ("addon API"),
  discriminated-union block model, dynamic renderer with a safe fallback.
- ✅ **Type safety** — TypeScript end-to-end; Zod schemas `satisfies`-checked against the
  TS types so validation and types can't drift.
- ✅ **Separation of concerns** — pure logic (`filter`, `scoreQuiz`, store actions) split
  from UI and unit-tested.
- ✅ **Testing of the core** — 58 tests (Vitest + Testing Library): renderer, registry,
  schemas, editor store + undo/redo, inline editing, quiz, blog filters, API service, XSS.
- ✅ **Performance** — route-level code splitting + lazy block editors keep TipTap/editor
  out of the reader bundle; no >500 kB chunk warning.
- ✅ **Security (client)** — DOMPurify sanitizes rendered HTML; `safeUrl` allow-lists
  href protocols (http/https/mailto) against `javascript:`/`data:` XSS.
- ✅ **Resilience** — `ErrorBoundary` around routes; loading/empty/not-found states.
- ✅ **Accessibility basics** — semantic landmarks, skip link, aria-labels, keyboard
  drag-and-drop + non-drag fallback.

## Intentionally mocked / out of scope

- ⛔ **Backend** — MSW is the API (in-memory db). No server, no persistence across restarts.
- ⛔ **Auth & roles** — none; anyone can edit/delete. The Admin persona isn't enforced.
- ⛔ **Image storage** — uploads are in-memory object URLs (lost on refresh).
- ⛔ **SSR / SEO** — client-side SPA by design.
- ⛔ **CI/CD** — no pipeline; tests/lint run locally only.
- ⛔ **Observability** — no logging, error reporting, or analytics.

## Path to production (prioritized)

1. **Real API + data layer**
   - Replace MSW handlers with a real backend (the `api.ts` service is the seam — swap
     the fetch targets, nothing else changes).
   - Use an ORM / parameterized queries (Prisma, Drizzle) — never string-built SQL.
   - Add a client cache (TanStack Query) for invalidation after publish/delete and
     optimistic updates.
   - Gate MSW to `import.meta.env.DEV` so it never ships to production.
2. **Auth & authorization**
   - Sessions/JWT; protect `/admin*` routes; enforce ownership on update/delete.
3. **Image storage** — object storage (S3/R2) or IndexedDB for the demo; signed uploads.
4. **CI/CD** — GitHub Actions: `npm ci`, typecheck, lint, `test:run`, build on every PR;
   block merge on failure. Add a pre-commit hook (lint-staged) and a committed Prettier
   config to enforce formatting.
5. **Observability** — error reporting (Sentry), structured logging, basic analytics.
6. **Testing depth** — Playwright E2E for the editor happy path; `axe` accessibility
   assertions; visual regression on key blocks.
7. **Hardening** — Content-Security-Policy header, input validation on the server,
   rate limiting, and server-side HTML sanitization (defense in depth).
8. **Editor polish** — coalesce per-keystroke history into undo steps; conflict handling
   for concurrent edits.

## Notes

- `npm ci` is the clean-install check for CI (Linux). On Windows it can hit an EPERM file
  lock on native binaries (e.g. `lightningcss`) — not a project issue.
- shadcn/ui here is the current **Base UI** variant, not Radix.
