import { z } from 'zod'
import type {
  BannerBlockData,
  BlogDocument,
  ImageBlockData,
  QuizBlockData,
  QuoteBlockData,
  TextBlockData,
} from './types'

/**
 * Runtime validation that mirrors types.ts. Each data schema is checked against
 * its TypeScript interface via `satisfies`, so the two can't silently drift.
 */

export const textBlockDataSchema = z.object({
  html: z.string(),
}) satisfies z.ZodType<TextBlockData>

export const imageBlockDataSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
}) satisfies z.ZodType<ImageBlockData>

export const bannerBlockDataSchema = z.object({
  image: z.string(),
  buttonText: z.string(),
  link: z.string(),
  background: z.string().optional(),
}) satisfies z.ZodType<BannerBlockData>

export const quoteBlockDataSchema = z.object({
  text: z.string(),
  attribution: z.string().optional(),
}) satisfies z.ZodType<QuoteBlockData>

export const quizQuestionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  options: z.array(z.string()).min(2),
  correctIndex: z.number().int().nonnegative(),
})

export const quizBlockDataSchema = z.object({
  title: z.string(),
  questions: z.array(quizQuestionSchema),
}) satisfies z.ZodType<QuizBlockData>

/** Maps each block `type` to its data schema (single source for lookups). */
export const blockDataSchemas = {
  text: textBlockDataSchema,
  image: imageBlockDataSchema,
  banner: bannerBlockDataSchema,
  quote: quoteBlockDataSchema,
  quiz: quizBlockDataSchema,
} as const

const blockBase = { id: z.string() }

/** Discriminated union for a single block (id + type + validated data). */
export const blockSchema = z.discriminatedUnion('type', [
  z.object({ ...blockBase, type: z.literal('text'), data: textBlockDataSchema }),
  z.object({ ...blockBase, type: z.literal('image'), data: imageBlockDataSchema }),
  z.object({ ...blockBase, type: z.literal('banner'), data: bannerBlockDataSchema }),
  z.object({ ...blockBase, type: z.literal('quote'), data: quoteBlockDataSchema }),
  z.object({ ...blockBase, type: z.literal('quiz'), data: quizBlockDataSchema }),
])

export const blogDocumentSchema = z.object({
  id: z.string(),
  version: z.number().int().positive(),
  title: z.string(),
  status: z.enum(['draft', 'published']),
  blocks: z.array(blockSchema),
}) satisfies z.ZodType<BlogDocument>

export const blogTitleSchema = z.string().min(3, 'Title must be at least 3 characters')
