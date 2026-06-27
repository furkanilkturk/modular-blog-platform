import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { scoreQuiz } from '@/blocks/quiz/scoreQuiz'
import { QuizBlockRender } from '@/blocks/quiz/QuizBlockRender'
import type { QuizQuestion } from '@/blocks'

const questions: QuizQuestion[] = [
  { id: 'q1', prompt: '2 + 2?', options: ['3', '4'], correctIndex: 1 },
  { id: 'q2', prompt: 'Capital of France?', options: ['Paris', 'Rome'], correctIndex: 0 },
]

describe('scoreQuiz', () => {
  it('counts correct answers', () => {
    expect(scoreQuiz(questions, { q1: 1, q2: 0 })).toEqual({ correct: 2, total: 2 })
  })

  it('counts partial and wrong answers', () => {
    expect(scoreQuiz(questions, { q1: 0, q2: 0 })).toEqual({ correct: 1, total: 2 })
  })

  it('treats unanswered questions as incorrect', () => {
    expect(scoreQuiz(questions, {})).toEqual({ correct: 0, total: 2 })
  })
})

describe('QuizBlockRender', () => {
  it('is interactive: answering and submitting shows a score', async () => {
    const user = userEvent.setup()
    render(<QuizBlockRender data={{ title: 'Pop quiz', questions }} />)

    // Submit is disabled until every question is answered.
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: '4' }))
    await user.click(screen.getByRole('radio', { name: 'Paris' }))
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(screen.getByRole('status')).toHaveTextContent('2 / 2')
  })
})
