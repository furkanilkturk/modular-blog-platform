# Modular Blog Platform

A block-based content platform that feels like a lightweight **Medium + Notion + Webflow**:
a Medium-style reading experience, Notion-style inline editing, and Webflow-style
modular page building. Pages aren't fixed templates — they're assembled from reusable,
typed **content blocks** rendered dynamically.

Built as a React case study to demonstrate architecture, scalability, and maintainable
frontend engineering — not just feature coverage.

## Highlights

- **Block engine** — every page is a discriminated union of typed blocks rendered by a
  single dynamic renderer. A central **block registry is the "addon API"**: adding a
  block type (static *or* interactive) is one registry entry.
- **Notion-style editor** — type content in place on the canvas; a properties panel holds
  configuration. Rich text via TipTap (headings, bold/italic, alignment, color, links),
  drag-and-drop reordering (mouse **and** keyboard), undo/redo, and draft autosave.
- **Reader** — blog list with search, category filters, a featured hero, and pagination;
  a detail page that renders the same blocks the editor produced.
- **Interactive blocks** — a Quiz block proves the registry hosts stateful, interactive
  addons (answer → score), not just static content.
- **Mock backend** — MSW serves a REST API (list/get/create/update/delete) so the editor
  and reader share one real data flow, with no server to run.
- **Typed end-to-end** — TypeScript + Zod schemas that are compile-time checked against
  the TS types, so validation and types can't drift.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui · Zustand (+ zundo, Immer) ·
React Router · React Hook Form · Zod · TipTap · dnd-kit · MSW · Vitest + Testing Library.

## Getting started

```bash
npm install
npm run dev        # start the app (MSW boots automatically)
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview the production build |
| `npm run test` | Vitest (watch) |
| `npm run test:run` | Vitest once |
| `npm run typecheck` | `tsc` no-emit |
| `npm run lint` | oxlint |

### Try the full loop

`/` (read) → **Write** → add blocks and type a post → **Publish** → land on the live post
→ **Edit** → change it → **Save draft**. Reload mid-edit to see the local draft restore.

## Architecture

### The block engine (`src/blocks/`)

The block model *is* the architecture.

- `types.ts` — the `Block` discriminated union (`text · image · banner · quote · quiz`)
  and `BlogDocument` (with a `version` field for future migrations).
- `schemas.ts` — Zod schemas per block + a discriminated-union document schema,
  `satisfies`-checked against the TS types.
- `definition.ts` + `registry.ts` — the **registry**: each block contributes a
  `BlockDefinition` (label, icon, schema, defaults, and views). The palette, dynamic
  renderer, property panel, validation, and factory all read from this one place.
- `DynamicRenderer.tsx` — looks each block up in the registry, keyed by `block.id`,
  passing `data` as a single typed prop. Unknown/unregistered types fall back to
  `UnknownBlock` (forward-compatible).
- `factory.ts` / `migrate.ts` — create blocks from registry defaults; version-stamp
  stored documents.

Each block lives in its own folder (`blocks/text/`, `blocks/quiz/`, …) exporting its
definition — self-contained "addons."

### Editing model — inline (Notion) + config (Webflow)

A block can expose two optional surfaces:

| | `InlineEdit` (canvas) | `Edit` (right panel) |
| --- | --- | --- |
| text | type inline (TipTap) | formatting toolbar |
| quote | inline text + attribution | — |
| image | — | upload, alt, caption |
| banner | — | upload, button, link |
| quiz | — | author questions/options |

Content is edited **where it lives**; the panel is for configuration. The text
formatting toolbar drives the focused editor via a small `useActiveEditor` store.

### Editor state (`src/features/editor/`)

Zustand + Immer for ergonomic immutable updates, + **zundo** for undo/redo. History
tracks only the document (a reference-equality check keeps selection changes out of the
undo stack). dnd-kit provides sortable reordering with a keyboard sensor and a non-drag
fallback (move up/down) for accessibility.

### Data flow (`src/mocks/`, `src/features/blog/`)

MSW intercepts `/api/posts*` against an in-memory db seeded from fixtures; the server
derives post metadata (slug, excerpt, cover, reading time) from the editor's title and
blocks. The reader fetches through a thin `api.ts` service; the editor saves/publishes/
deletes through it. In-progress new posts autosave to `localStorage` for crash recovery.

### Performance

Route-level code splitting plus lazy block editors keep TipTap and the editor out of the
reader bundle — they load only on `/admin`.

## Adding a new block (the addon story)

1. Add the block to the `Block` union (`types.ts`) and a Zod schema (`schemas.ts`).
2. Create `blocks/<name>/` with a `Render` and (optionally) `InlineEdit` / `Edit`.
3. Export a `defineBlock({...})` and add it to the `registry`.

It now appears in the palette, renders on the canvas and in the reader, validates, and
gets defaults — no other wiring.

## Project structure

```
src/
  blocks/        # block engine: types, schemas, registry, renderer + each block
  features/
    editor/      # 3-panel editor: store, canvas, palette, property panel, persistence
    blog/        # reader: list/detail pages, api service, filter logic, fixtures
  components/    # layout, shared UI (shadcn in components/ui)
  mocks/         # MSW handlers + in-memory db
  lib/           # utils (cn, sanitize, id, format)
  tests/         # all tests live here
docs/            # PRD, PROJECT_PLAN, TECHNICAL_DESIGN
```

## Testing

54 tests (Vitest + Testing Library) focused on the engine and behavior: the dynamic
renderer, registry/factory, Zod schemas, the editor store (add/remove/reorder/duplicate/
undo-redo), inline-editing wiring, quiz scoring + interaction, blog filter/pagination,
and the API service against MSW.

```bash
npm run test:run
```

## Notable decisions & limitations

- **Mock-only backend.** MSW *is* the API (no server). It's bundled in every environment
  for the demo; a real build would gate it to dev.
- **Image "uploads"** use in-memory object URLs (no storage), so uploaded images don't
  survive a refresh — fine for a demo; IndexedDB/object storage would be the next step.
- **No SSR/SEO.** A client-side SPA, by design for this case study.
- shadcn/ui here is the **Base UI** variant (the current default), not Radix.

See [`docs/`](./docs) for the PRD, sprint plan, and technical design.
