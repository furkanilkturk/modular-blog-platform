import type { QuizQuestion } from '../types'

export interface QuizScore {
  correct: number
  total: number
}

/** Counts how many questions were answered with their correct option. */
export function scoreQuiz(
  questions: QuizQuestion[],
  answers: Record<string, number>,
): QuizScore {
  let correct = 0
  for (const question of questions) {
    if (answers[question.id] === question.correctIndex) correct++
  }
  return { correct, total: questions.length }
}
