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

- [ ] Define `Block` discriminated union + `BlogDocument` (with `version`) in `src/blocks/types.ts`
- [ ] Define Zod schemas per block; combine into a discriminated-union document schema
- [ ] Define the `BlockRegistry` interface (`label`, `icon`, `schema`, `defaultData`, `Render`, `Edit`, `kind`)
- [ ] Implement the registry object (start with `text`, `image` entries)
- [ ] Implement `<DynamicRenderer blocks={...} />` reading the registry, keyed by `block.id`
- [ ] Implement `<UnknownBlock />` fallback
- [ ] Implement a `createBlock(type)` factory using `defaultData`
- [ ] Implement a `migrate(document)` stub keyed off `version`
- [ ] **Tests:** renderer maps type→component, unknown-type fallback, factory defaults, schema validation pass/fail
- [ ] Commit: "feat: block engine core"

---

## Sprint 2 — Editor Shell & State

**Goal:** Three-panel editor layout with working reorder + undo/redo.
**DoD:** Can add, select, reorder (drag + keyboard), duplicate, and delete blocks; Cmd/Ctrl+Z/Y works.

- [ ] Build editor store with `zustand` + `immer` + `zundo` (history)
- [ ] Store API: `addBlock`, `removeBlock`, `reorderBlocks`, `duplicateBlock`, `updateBlockData`, `selectBlock`
- [ ] Build 3-panel `AdminEditor` layout (left palette / center canvas / right properties)
- [ ] Left sidebar: block palette generated from the registry
- [ ] Center canvas: render blocks via the engine, with selection + drag handles
- [ ] Wire `dnd-kit` sortable for block reorder (mouse + **keyboard sensor**)
- [ ] Add non-drag fallback (move up/down buttons) for a11y & mobile
- [ ] Right sidebar: property panel driven by the selected block's registry entry
- [ ] Undo/redo buttons + keyboard shortcuts
- [ ] **Tests:** store operations (add/remove/reorder/duplicate/undo/redo)
- [ ] Commit: "feat: editor shell + state"

---

## Sprint 3 — Static Blocks

**Goal:** Implement the static content blocks end-to-end (palette → edit → render).
**DoD:** Text, Image, Banner, Quote each: appear in palette, edit via panel, render in canvas & read view.

- [ ] **Text block** — TipTap instance mounted only when focused; stores sanitized HTML
- [ ] Text read-view component renders sanitized HTML (no TipTap)
- [ ] **Image block** — upload via `createObjectURL`, alt text, caption; placeholder seed support
- [ ] **Banner block** — image, button text, link, background
- [ ] **Quote block** — quote text + attribution
- [ ] Each block: registry entry, Zod schema, `Edit` (property panel), `Render`
- [ ] **Tests:** each block's schema + render
- [ ] Commit: "feat: static blocks (text/image/banner/quote)"

---

## Sprint 4 — Read Side (Blog List + Detail)

**Goal:** The reader experience.
**DoD:** Listing page with search/filter/pagination; detail page renders a document via the engine.

- [ ] Routing: `/` (list), `/blog/:id` (detail), `/admin` (editor)
- [ ] Blog Listing page: cards, featured, search, category filter, pagination
- [ ] Blog Detail page: render `BlogDocument` via `DynamicRenderer`
- [ ] Loading states with `Skeleton`
- [ ] Responsive layouts (mobile/tablet/desktop)
- [ ] **Tests:** list filtering/search logic
- [ ] Commit: "feat: blog list + detail"

---

## Sprint 5 — Persistence, Drafts & Mock API

**Goal:** Content survives and the app talks to a (mock) backend.
**DoD:** Create/edit/delete posts, save drafts, autosave; all via MSW-mocked endpoints.

- [ ] Define MSW handlers: list, get, create, update, delete posts
- [ ] Seed mock data (a few posts using multiple block types)
- [ ] Service layer (`src/features/blog/api.ts`) wrapping fetch calls
- [ ] Draft persistence to `localStorage`
- [ ] Debounced autosave in the editor
- [ ] Publish vs. draft status
- [ ] **Tests:** service layer against MSW
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
