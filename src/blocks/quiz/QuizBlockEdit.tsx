import { Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { generateId } from '@/lib/id'
import type { BlockEditProps } from '../definition'
import type { QuizQuestion } from '../types'

export function QuizBlockEdit({ data, onChange }: BlockEditProps<'quiz'>) {
  function setQuestions(questions: QuizQuestion[]) {
    onChange({ ...data, questions })
  }

  function patchQuestion(id: string, patch: Partial<QuizQuestion>) {
    setQuestions(data.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)))
  }

  function addQuestion() {
    setQuestions([
      ...data.questions,
      { id: generateId(), prompt: '', options: ['', ''], correctIndex: 0 },
    ])
  }

  function removeOption(q: QuizQuestion, index: number) {
    const options = q.options.filter((_, i) => i !== index)
    let correctIndex = q.correctIndex
    if (index === q.correctIndex) correctIndex = 0
    else if (index < q.correctIndex) correctIndex -= 1
    patchQuestion(q.id, { options, correctIndex })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="quiz-title">Quiz title</Label>
        <Input
          id="quiz-title"
          value={data.title}
          placeholder="Quiz title"
          onChange={(e) => onChange({ ...data, title: e.target.value })}
        />
      </div>

      {data.questions.map((q, qi) => (
        <div key={q.id} className="space-y-2 rounded-md border p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Question {qi + 1}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Remove question"
              onClick={() => setQuestions(data.questions.filter((x) => x.id !== q.id))}
            >
              <Trash2 className="size-3.5 text-destructive" />
            </Button>
          </div>

          <Input
            value={q.prompt}
            placeholder="Question prompt"
            onChange={(e) => patchQuestion(q.id, { prompt: e.target.value })}
          />

          <p className="text-xs text-muted-foreground">
            Select the radio to mark the correct answer.
          </p>
          {q.options.map((option, oi) => (
            <div key={oi} className="flex items-center gap-2">
              <input
                type="radio"
                name={`correct-${q.id}`}
                aria-label={`Mark option ${oi + 1} correct`}
                checked={q.correctIndex === oi}
                onChange={() => patchQuestion(q.id, { correctIndex: oi })}
              />
              <Input
                value={option}
                placeholder={`Option ${oi + 1}`}
                onChange={(e) =>
                  patchQuestion(q.id, {
                    options: q.options.map((o, i) => (i === oi ? e.target.value : o)),
                  })
                }
              />
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={`Remove option ${oi + 1}`}
                disabled={q.options.length <= 2}
                onClick={() => removeOption(q, oi)}
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => patchQuestion(q.id, { options: [...q.options, ''] })}
          >
            <Plus className="mr-1 size-3.5" />
            Add option
          </Button>
        </div>
      ))}

      <Button variant="outline" className="w-full" onClick={addQuestion}>
        <Plus className="mr-1 size-4" />
        Add question
      </Button>
    </div>
  )
}
