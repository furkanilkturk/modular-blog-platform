// Every page is a BlogDocument whose blocks are a discriminated union keyed by
// `type`. A new block type means: extend this union, add a schema, register it.

export interface BaseBlock<TType extends string, TData> {
  id: string
  type: TType
  data: TData
}

// --- Block data shapes -----------------------------------------------------

export interface TextBlockData {
  /** Rich HTML from the inline editor; alignment is encoded here per-paragraph. */
  html: string
}

export interface ImageBlockData {
  src: string
  alt: string
  caption?: string
}

export interface BannerBlockData {
  image: string
  buttonText: string
  link: string
  background?: string
}

export interface QuoteBlockData {
  text: string
  attribution?: string
}

export interface QuizQuestion {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
}

export interface QuizBlockData {
  title: string
  questions: QuizQuestion[]
}

// --- Block union -----------------------------------------------------------

export type TextBlock = BaseBlock<'text', TextBlockData>
export type ImageBlock = BaseBlock<'image', ImageBlockData>
export type BannerBlock = BaseBlock<'banner', BannerBlockData>
export type QuoteBlock = BaseBlock<'quote', QuoteBlockData>
export type QuizBlock = BaseBlock<'quiz', QuizBlockData>

export type Block =
  | TextBlock
  | ImageBlock
  | BannerBlock
  | QuoteBlock
  | QuizBlock

export type BlockType = Block['type']

/** Maps a block `type` to its `data` shape, e.g. `BlockDataMap['text']`. */
export type BlockDataMap = { [B in Block as B['type']]: B['data'] }

// --- Document --------------------------------------------------------------

/** Bump whenever a stored block shape changes; drives migrate(). */
export const CURRENT_DOCUMENT_VERSION = 1

export interface BlogDocument {
  id: string
  version: number
  title: string
  status: 'draft' | 'published'
  blocks: Block[]
}
