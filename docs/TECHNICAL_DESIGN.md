# Technical Design Addendum

Companion to the PRD and [`PROJECT_PLAN.md`](./PROJECT_PLAN.md). This file holds the
concrete architectural decisions so every build session follows the same patterns.

---

## 1. The Block Model

The block union **is** the architecture. Every page is `BlogDocument.blocks: Block[]`.

```ts
// src/blocks/types.ts
export type Align = "left" | "center" | "right";

export interface BaseBlock<TType extends string, TData> {
  id: string;
  type: TType;
  data: TData;
}

export type TextBlock   = BaseBlock<"text",   { html: string; align: Align }>;
export type ImageBlock  = BaseBlock<"image",  { src: string; alt: string; caption?: string }>;
export type BannerBlock = BaseBlock<"banner", { image: string; buttonText: string; link: string; background?: string }>;
export type QuoteBlock  = BaseBlock<"quote",  { text: string; attribution?: string }>;

// Interactive (addon proof)
export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}
export type QuizBlock = BaseBlock<"quiz", { title: string; questions: QuizQuestion[] }>;

export type Block =
  | TextBlock | ImageBlock | BannerBlock | QuoteBlock | QuizBlock;

export type BlockType = Block["type"];

export interface BlogDocument {
  id: string;
  version: number;          // bump when block shapes change → migrate()
  title: string;
  status: "draft" | "published";
  blocks: Block[];
}
```

**`version`** exists from day one so stored documents can be migrated as block shapes
evolve. `migrate(doc)` is a switch on `doc.version` that upgrades old content.

---

## 2. The Block Registry - single source of truth ("addon API")

The sidebar palette, the dynamic renderer, the property panel, validation, and defaults
all read from ONE registry. Adding a block = adding one entry. This delivers the
"easily add new blocks / widgets / addons" goal.

```ts
// src/blocks/registry.tsx
import type { ComponentType } from "react";
import type { ZodType } from "zod";
import type { Block, BlockType } from "./types";

export type BlockKind = "static" | "interactive";

export interface BlockDefinition<B extends Block = Block> {
  type: B["type"];
  label: string;
  icon: ComponentType<{ className?: string }>;
  kind: BlockKind;
  schema: ZodType<B["data"]>;        // Zod validation for this block's data
  defaultData: B["data"];            // used by createBlock()
  Edit: ComponentType<{ block: B; onChange: (data: B["data"]) => void }>;  // property panel
  Render: ComponentType<{ data: B["data"] }>;                              // read/canvas view
}

export const blockRegistry: { [K in BlockType]: BlockDefinition } = {
  text:   textDefinition,
  image:  imageDefinition,
  banner: bannerDefinition,
  quote:  quoteDefinition,
  quiz:   quizDefinition,
};

export const blockList = Object.values(blockRegistry); // for the palette
```

> Each block lives in its own folder (`src/blocks/text/`, etc.) exporting its
> `BlockDefinition`. The registry just imports and assembles them - co-location keeps
> each addon self-contained.

---

## 3. Dynamic Renderer

Reads the registry, keys by `block.id`, falls back on unknown types (forward-compat).

```tsx
// src/blocks/DynamicRenderer.tsx
export function DynamicRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block) => {
        const def = blockRegistry[block.type];
        if (!def) return <UnknownBlock key={block.id} type={block.type} />;
        const Render = def.Render;
        return <Render key={block.id} data={block.data} />;
      })}
    </>
  );
}
```

- **Never** `{...block.data}` spread - pass `data` as one typed prop.
- `UnknownBlock` renders a small placeholder instead of crashing.

---

## 3a. Editing model - inline vs. config (Notion + Webflow)

Content is **typed in place on the canvas**; the right panel holds the controls.
A block definition can expose two optional editing surfaces:

- **`InlineEdit`** - in-place editing on the canvas while the block is selected
  (the Notion experience: you type where the content lives). Text mounts a
  focused TipTap instance; Quote uses inline text fields.
- **`Edit`** - right-panel controls. For text this is the **formatting toolbar**
  (bold/italic/H2/align/link), always visible while a text block is selected -
  no floating bubble. For image/banner it's config (upload, alt, link).

| Block  | InlineEdit (canvas, typing) | Edit (right panel)            |
|--------|-----------------------------|-------------------------------|
| text   | TipTap (type inline)        | formatting toolbar            |
| quote  | inline text + attribution   | -                             |
| image  | -                           | upload, alt, caption          |
| banner | -                           | upload, button text, link     |

The text formatting toolbar drives the editor via a tiny `useActiveEditor`
store: `TextBlockInlineEdit` registers its TipTap instance on mount; the
panel's `TextBlockEdit` reads it and issues commands. This keeps formatting
**always visible** (no popup to collide with the panel or hunt for).

`CanvasBlock` renders `InlineEdit` when the block is selected **and not being
dragged** (a dragged block renders statically, so it never stretches or detaches
its toolbar). `PropertyPanel` renders `Edit` if present.

Text alignment is stored **in the HTML** (TipTap TextAlign, per paragraph), so
there is no block-level `align` field.

## 4. TipTap Pattern - per focused text block

**Decision:** one TipTap instance per text block, mounted **only while that block is
focused/selected**. Read view never mounts TipTap.

```
Text block.data = { html: string, align }

Editor canvas:
  - selected text block   → mount <TipTapEditor> (writes data.html)
  - unselected text block → render sanitized data.html (static)

Read view (blog detail):
  - always render sanitized data.html  (DOMPurify) - no TipTap
```

This keeps at most ~1 live editor instance at a time (no dozens-of-instances perf hit),
and keeps dnd-kit in charge of page-level block order while TipTap only handles inline
rich text within a single block. Always sanitize `html` with DOMPurify before rendering.

---

## 5. Editor State - immutable + undo/redo

`zustand` + `immer` for ergonomic immutable updates + `zundo` for history. Designing for
undo/redo now avoids a painful retrofit later.

```ts
// src/features/editor/store.ts (shape)
interface EditorState {
  document: BlogDocument;
  selectedBlockId: string | null;
  addBlock(type: BlockType, index?: number): void;
  removeBlock(id: string): void;
  reorderBlocks(from: number, to: number): void;
  duplicateBlock(id: string): void;
  updateBlockData(id: string, data: unknown): void;
  selectBlock(id: string | null): void;
}
// wrapped with temporal() from zundo → undo()/redo()
```

---

## 6. Images (mock strategy)

- **Uploads:** `const src = URL.createObjectURL(file)` → store in `data.src`. Instant,
  no infra. (Object URLs are lost on refresh - acceptable for a demo.)
- **Seed content:** bundled assets in `src/assets` or `https://picsum.photos/seed/<id>/800/400`.
- **Optional later:** IndexedDB for refresh-persistent uploaded blobs (no localStorage quota issue).

---

## 7. Folder Structure (feature-based)

```
src/
  blocks/                # the engine + every block (the "addon API")
    types.ts
    registry.tsx
    DynamicRenderer.tsx
    factory.ts           # createBlock()
    migrate.ts
    text/  image/  banner/  quote/  quiz/   # each: definition + Edit + Render + schema
  features/
    editor/              # AdminEditor: store, layout, palette, canvas, property panel
    blog/                # list + detail + api service
  components/
    ui/                  # shadcn
    common/  layout/
  lib/                   # utils, sanitize, cn
  mocks/                 # MSW handlers + seed data
  routes/                # router config
  tests/                 # ALL tests live here (setup.ts + *.test.ts(x)), import via @/ alias
  types/  schemas/  assets/
```

> **Test convention:** tests are not co-located next to source. They all live in
> `src/tests/` and import the code under test through the `@/` alias, keeping
> feature folders (especially `blocks/`) clean.

---

## 8. Test Plan

- **Vitest + RTL** (priority):
  - Dynamic renderer: type→component mapping, unknown-type fallback.
  - Registry + `createBlock` defaults.
  - Zod schema validation (valid/invalid) per block.
  - Editor store: add/remove/reorder/duplicate/undo/redo.
  - Quiz scoring logic.
  - Blog list search/filter logic.
  - Service layer against MSW.
- **Playwright** (optional, 1–2 flows): drag-drop reorder; add → edit → preview happy path.
- Don't chase coverage %; cover the engine and store deeply.
