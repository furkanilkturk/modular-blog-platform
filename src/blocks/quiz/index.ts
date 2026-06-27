import { lazy } from 'react'
import { ListChecks } from 'lucide-react'
import { defineBlock } from '../definition'
import { quizBlockDataSchema } from '../schemas'
import { QuizBlockRender } from './QuizBlockRender'

const QuizBlockEdit = lazy(() =>
  import('./QuizBlockEdit').then((m) => ({ default: m.QuizBlockEdit })),
)

export const quizBlock = defineBlock({
  type: 'quiz',
  label: 'Quiz',
  icon: ListChecks,
  kind: 'interactive',
  schema: quizBlockDataSchema,
  defaultData: { title: '', questions: [] },
  Render: QuizBlockRender,
  // Authored in the right panel; the canvas/read view is interactive.
  Edit: QuizBlockEdit,
})
