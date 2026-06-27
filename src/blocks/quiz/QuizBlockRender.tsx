import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { QuizBlockData } from '../types'
import { scoreQuiz } from './scoreQuiz'

/** Interactive read view: answer the questions, submit, and see a score. */
export function QuizBlockRender({ data }: { data: QuizBlockData }) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)

  if (data.questions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        Quiz — add questions in the panel.
      </div>
    )
  }

  const result = submitted ? scoreQuiz(data.questions, answers) : null
  const allAnswered = data.questions.every((q) => answers[q.id] !== undefined)

  return (
    <section className="space-y-5 rounded-lg border bg-card p-5">
      <h3 className="text-lg font-semibold">{data.title || 'Quiz'}</h3>

      {data.questions.map((question, qi) => (
        <fieldset key={question.id} className="space-y-2" disabled={submitted}>
          <legend className="mb-1 font-medium">
            {qi + 1}. {question.prompt}
          </legend>
          {question.options.map((option, oi) => {
            const checked = answers[question.id] === oi
            const isAnswer = oi === question.correctIndex
            return (
              <label
                key={oi}
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-md border p-2 text-sm',
                  !submitted && checked && 'border-primary',
                  submitted && isAnswer && 'border-green-600 bg-green-50 dark:bg-green-950/30',
                  submitted && checked && !isAnswer && 'border-destructive bg-destructive/5',
                )}
              >
                <input
                  type="radio"
                  name={question.id}
                  checked={checked}
                  onChange={() =>
                    setAnswers((prev) => ({ ...prev, [question.id]: oi }))
                  }
                />
                <span className="flex-1">{option}</span>
                {submitted && isAnswer ? <Check className="size-4 text-green-600" /> : null}
                {submitted && checked && !isAnswer ? (
                  <X className="size-4 text-destructive" />
                ) : null}
              </label>
            )
          })}
        </fieldset>
      ))}

      {result ? (
        <div className="flex items-center justify-between">
          <p className="font-medium" role="status">
            You scored {result.correct} / {result.total}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSubmitted(false)
              setAnswers({})
            }}
          >
            Try again
          </Button>
        </div>
      ) : (
        <Button disabled={!allAnswered} onClick={() => setSubmitted(true)}>
          Submit
        </Button>
      )}
    </section>
  )
}
