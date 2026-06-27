# Modular Blog Platform — Project Plan

A sprint-based, checkbox-driven plan for building the Modular Blog Platform case study.
Work top-to-bottom. Each sprint has a **Goal**, **Definition of Done (DoD)**, and tasks.
Check items off as you go so progress is always visible.

> Pair this with [`TECHNICAL_DESIGN.md`](./TECHNICAL_DESIGN.md), which holds the locked
> architectural decisions (block model, registry, TipTap pattern, etc.).

---

## Locked Decisions (do not re-litigate mid-build)

- [x] **Everything is a block.** "Widgets/addons" are just blocks; the **block registry is the addon API**.
- [x] **Block model** = a discriminated union keyed by `type`, with a document `version` field.
- [x] **Dynamic renderer** reads the registry, keys by `block.id`, and has an `UnknownBlock` fallback.
- [x] **TipTap = one instance per *focused* text block.** Read view renders sanitized HTML, never mounts TipTap.
- [x] **Editor state** is immutable + history-backed (undo/redo) from day one.
- [x] **Images** = `URL.createObjectURL` for uploads + placeholder seeds. No DB. IndexedDB is optional later.
- [x] **No SEO/SSR** — client-side SPA is acceptable for this case study.
- [x] **Tests**: Vitest + React Testing Library on engine/store; optional Playwright for drag-drop flow.
- [x] **Interactive block proof**: ship one **Quiz** block in v1 to prove addons can be interactive.

---

## Sprint 0 — Foundations & Setup

**Goal:** A running app shell with the full toolchain wired up.
**DoD:** `npm run dev` serves a styled page; `npm run test` and lint pass on an empty suite.

- [x] Scaffold Vite + React + TypeScript (React 19, Vite 8, TS 6)
- [x] Configure path alias `@/` → `src/`
- [x] Install & configure Tailwind CSS (v4 via `@tailwindcss/vite`)
- [x] Init shadcn/ui and add components (`--all` — 60 components, neutral base)
- [x] Install state/data libs: `zustand`, `zundo` (undo/redo), `immer`
- [x] Install routing: `react-router-dom`
- [x] Install forms/validation: `react-hook-form`, `zod`, `@hookform/resolvers`
- [x] Install editor: `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`
- [x] Install drag-and-drop: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- [x] Install sanitizer: `dompurify` (ships its own types in v3)
- [x] Install mock API: `msw` (dev) and init worker (`public/mockServiceWorker.js`)
- [x] Install testing: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@vitest/coverage-v8`
- [ ] (Optional) Install `@playwright/test` — deferred to Sprint 7
- [x] Linting/formatting: `oxlint` (ships with the Vite template; ignores vendored `ui/`)
- [~] Create folder structure (feature-based) — created as each sprint needs it
- [x] Add npm scripts: `dev`, `build`, `preview`, `test`, `test:run`, `test:coverage`, `typecheck`, `lint`
- [x] Verified: `build`, `test:run`, and `lint` all pass on the scaffold
- [ ] Commit: "chore: project scaffold" — pending `git init` (not yet a repo)

---

## Sprint 1 — Block Engine Core

**Goal:** The keystone. Types + registry + dynamic renderer, fully tested, no UI polish.
**DoD:** Given a `BlogDocument`, the renderer renders the correct components and falls back gracefully on unknown types. 100% of this is unit-tested.

- [x] Define `Block` discriminated union + `BlogDocument` (with `version`) in `src/blocks/types.ts`
- [x] Define Zod schemas per block; combine into a discriminated-union document schema (`schemas.ts`, `satisfies`-checked against the TS types)
- [x] Define the `BlockDefinition` interface + `defineBlock()` authoring helper (`definition.ts`)
- [x] Implement the registry object (`text`, `image` entries) with `getBlockDefinition` + `blockList`
- [x] Implement `<DynamicRenderer blocks={...} />` reading the registry, keyed by `block.id`, `data` passed as one typed prop
- [x] Implement `<UnknownBlock />` fallback
- [x] Implement a `createBlock(type)` factory using `defaultData` (deep-cloned, throws on unknown)
- [x] Implement a `migrate(document)` stub keyed off `version`
- [x] Add `sanitizeHtml()` (DOMPurify) for text-block HTML
- [x] **Tests:** renderer maps type→component + unknown/unregistered fallback, factory defaults/clone/throw, schema pass/fail, migrate, sanitize (22 tests)
- [x] Wire a temporary sample document into `App.tsx` to visibly prove the engine
- [x] Verified: typecheck, tests, lint, build all pass
- [ ] Commit: "feat: block engine core"

---

## Sprint 2 — Editor Shell & State

**Goal:** Three-panel editor layout with working reorder + undo/redo.
**DoD:** Can add, select, reorder (drag + keyboard), duplicate, and delete blocks; Cmd/Ctrl+Z/Y works.

- [x] Build editor store with `zustand` + `immer` + `zundo` (history; reference-equality skips no-op entries)
- [x] Store API: `addBlock`, `removeBlock`, `reorderBlocks`, `duplicateBlock`, `updateBlockData`, `selectBlock` (+ `moveBlock`, `updateTitle`)
- [x] Build 3-panel `AdminEditor` layout (left palette / center canvas / right properties)
- [x] Left sidebar: block palette generated from the registry (`blockList`)
- [x] Center canvas: render blocks via the engine, with selection + per-block hover toolbar
- [x] Wire `dnd-kit` sortable for block reorder (PointerSensor + **KeyboardSensor**)
- [x] Add non-drag fallback (move up/down buttons) for a11y & mobile
- [x] Right sidebar: property panel driven by the selected block's registry `Edit`
- [x] Undo/redo buttons + keyboard shortcuts (Cmd/Ctrl+Z, Shift+Z / Ctrl+Y)
- [x] **Tests:** store operations — add/insert/remove/duplicate/reorder/move/update + undo/redo + selection-not-tracked (10 tests)
- [x] Verified: typecheck, tests (31 total), lint, build all pass
- [ ] Commit: "feat: editor shell + state"

---

## Sprint 3 — Static Blocks

**Goal:** Implement the static content blocks end-to-end (palette → edit → render).
**DoD:** Text, Image, Banner, Quote each: appear in palette, edit via panel, render in canvas & read view.

- [x] Editing model: added optional `InlineEdit` (canvas) + `Edit` (panel) to `BlockDefinition` — content is edited in place, not in the sidebar
- [x] **Text block** — inline TipTap (StarterKit + TextAlign + Placeholder) with a floating **bubble toolbar** (bold/italic/H2/align/link); mounted only while selected; alignment stored in HTML
- [x] Text read-view renders sanitized HTML (no TipTap); shared `.tiptap-content` typography
- [x] **Image block** — `createObjectURL` upload (shared `ImageUploadField`) + alt + caption; placeholder render when empty
- [x] **Banner block** — background image upload, button text, link
- [x] **Quote block** — inline-editable quote text + attribution
- [x] Each block: registry entry, Zod schema, `Render` + (`InlineEdit` and/or `Edit`)
- [x] **Tests:** schemas (text/banner/quote), renderer, + inline TipTap mount smoke test (33 total)
- [x] Verified: typecheck, tests, lint, build all pass
- [ ] Commit: "feat: static blocks (text/image/banner/quote)"

---

## Sprint 4 — Read Side (Blog List + Detail)

**Goal:** The reader experience.
**DoD:** Listing page with search/filter/pagination; detail page renders a document via the engine.

- [x] Routing: `/` (list), `/blog/:slug` (detail), `/admin` (editor), `*` (404); `PublicLayout` chrome for reader pages
- [x] Blog Listing page: cards, featured hero, search, category chips, pagination (4/page)
- [x] Blog Detail page: cover + meta header, renders blocks via `DynamicRenderer`, not-found handling
- [x] Loading states with `Skeleton` (async-shaped `usePosts`/`usePost` hooks over fixtures)
- [x] Responsive layouts (mobile/tablet/desktop)
- [x] Pure `filter.ts` (filter/featured/categories/paginate) driving the list; fixtures in `data.ts`
- [x] **Tests:** filter/search/featured/categories/paginate (13) + routing render tests (3) — 44 total
- [x] Verified: typecheck, tests, lint, build all pass
- [ ] Commit: "feat: blog list + detail"

---

## Sprint 5 — Persistence, Drafts & Mock API

**Goal:** Content survives and the app talks to a (mock) backend.
**DoD:** Create/edit/delete posts, save drafts, autosave; all via MSW-mocked endpoints.

- [x] MSW handlers (`src/mocks/`): GET list, GET by slug, POST, PUT, DELETE over an in-memory db seeded from fixtures; worker started in `main.tsx`
- [x] Server derives post metadata (slug, excerpt, cover, reading time) from the editor's title + blocks
- [x] Service layer (`src/features/blog/api.ts`) + `usePosts`/`usePost` now fetch via the API (loading + error states)
- [x] Draft persistence to `localStorage` (`localDraft.ts`) restored on new-post bootstrap
- [x] Debounced autosave (`AutoSave`) for unsaved new posts
- [x] Publish vs. draft status: Save draft / Publish / Delete in the toolbar + status badge; edit existing via `/admin/:slug`; Edit link on the detail page; sonner toasts
- [x] **Tests:** service layer against MSW (6) — list/get/404/create+derive/update-keeps-slug/delete; localStorage + MSW wired into test setup (51 total)
- [x] Verified: typecheck, tests, lint, build all pass
- [ ] Commit: "feat: persistence + mock API"

---

## Sprint 6 — Interactive Block (Quiz) — Addon Proof

**Goal:** Prove the registry handles interactive, stateful blocks.
**DoD:** A Quiz block authored in the editor and *playable* (answer → score) in the read view.

- [ ] Define Quiz block type + schema (questions, options, correct answer)
- [ ] Quiz `Edit` panel: add/remove questions & options
- [ ] Quiz `Render` (read view): interactive — select answers, submit, show score
- [ ] Register as a `kind: "interactive"` block
- [ ] **Tests:** scoring logic + schema
- [ ] Commit: "feat: interactive quiz block"

---

## Sprint 7 — Polish & Hardening

**Goal:** Production-feel pass.
**DoD:** Accessible, responsive, performant, lint-clean, meaningful tests green.

- [ ] Accessibility audit: keyboard nav, ARIA, semantic HTML, focus management
- [ ] Performance: lazy-load blocks (`React.lazy`), code-split routes, memoize where it matters
- [ ] Empty/error states everywhere
- [ ] (Optional) Playwright: drag-drop reorder + "add → edit → preview" happy path
- [ ] README with run instructions, architecture overview, and a screenshot/GIF
- [ ] Final lint + test pass
- [ ] Commit: "chore: polish + docs"

---

## Backlog / Future (explicitly out of scope for v1)

- [ ] Auth + role-based permissions
- [ ] Additional blocks: Newsletter, Ad, Video embed, Related articles, Hero banner variants
- [ ] Analytics dashboard
- [ ] SEO / SSR (would require Next.js or vite-ssg)
- [ ] i18n / multi-language
- [ ] Scheduled publishing, theme customization
- [ ] IndexedDB image persistence
- [ ] Real backend (Node/Express/NestJS)
