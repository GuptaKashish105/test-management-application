import type { RawQuestion } from './types'

/** Stable, UI-facing model for a persisted question. */
export interface Question {
  id: string
  question: string
  option1: string
  option2: string
  option3: string
  option4: string
  correctOption: string
  explanation: string
  difficulty: string | null
}

export function normalizeQuestion(raw: RawQuestion): Question {
  return {
    id: raw.id,
    question: raw.question,
    option1: raw.option1,
    option2: raw.option2,
    option3: raw.option3,
    option4: raw.option4,
    correctOption: raw.correct_option,
    explanation: raw.explanation ?? '',
    difficulty: raw.difficulty ?? null,
  }
}
