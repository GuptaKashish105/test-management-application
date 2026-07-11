import type { TestDifficulty } from '@services/tests'
import { z } from 'zod'

/**
 * Only 'easy'/'medium'/'difficult' are shown in the Figma difficulty radio
 * group, and 'medium' is confirmed lowercase by the API doc's create
 * example, so the other two are assumed to follow the same casing.
 */
export const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'difficult', label: 'Difficult' },
] as const

const difficultyValues = DIFFICULTY_OPTIONS.map((option) => option.value) as TestDifficulty[]

export const testMetadataSchema = z.object({
  name: z.string().trim().min(1, 'Test name is required'),
  type: z.literal('chapterwise'),
  subject: z.string().min(1, 'Subject is required'),
  topics: z.array(z.string()).min(1, 'Select at least one topic'),
  subTopics: z.array(z.string()),
  difficulty: z.string().refine((value): value is TestDifficulty => {
    return difficultyValues.includes(value as TestDifficulty)
  }, 'Difficulty is required'),
  correctMarks: z.coerce.number('Required'),
  wrongMarks: z.coerce.number('Required'),
  unattemptMarks: z.coerce.number('Required'),
  totalTime: z.coerce.number('Required').positive('Must be greater than 0'),
  totalMarks: z.coerce.number('Required').positive('Must be greater than 0'),
  totalQuestions: z.coerce
    .number('Required')
    .int('Must be a whole number')
    .positive('Must be greater than 0'),
})

/** Validated/coerced output — what onSubmit receives and the API payload is built from. */
export type TestMetadataFormValues = z.output<typeof testMetadataSchema>

/** Pre-coercion input — what the form fields hold, allowing e.g. empty-string number inputs. */
export type TestMetadataFormInput = z.input<typeof testMetadataSchema>
