import { z } from 'zod'

export const CORRECT_OPTION_VALUES = ['option1', 'option2', 'option3', 'option4'] as const
export type CorrectOptionValue = (typeof CORRECT_OPTION_VALUES)[number]

/**
 * Only the fields that matter for validity/completeness — question text, 4
 * options, and which one is correct (all 4 options are already required
 * non-empty, so "correct option references a filled option" holds by
 * construction). Explanation/difficulty/topic/sub-topic/media URL are
 * explicitly optional per requirements.md.
 */
export const questionSchema = z.object({
  question: z.string().trim().min(1, 'Question text is required'),
  option1: z.string().trim().min(1, 'Required'),
  option2: z.string().trim().min(1, 'Required'),
  option3: z.string().trim().min(1, 'Required'),
  option4: z.string().trim().min(1, 'Required'),
  correctOption: z.string().refine(
    (value): value is CorrectOptionValue => CORRECT_OPTION_VALUES.includes(value as CorrectOptionValue),
    'Select the correct option',
  ),
  explanation: z.string(),
  difficulty: z.string(),
  topicId: z.string(),
  subTopicId: z.string(),
  mediaUrl: z.union([z.literal(''), z.string().url('Must be a valid URL')]),
})

/** Validated output — used when reading a completed/submittable question. */
export type QuestionFormValues = z.output<typeof questionSchema>

/** Pre-validation input — what the form fields hold, allowing e.g. no correct option chosen yet. */
export type QuestionFormInput = z.input<typeof questionSchema>

export const EMPTY_QUESTION_FORM_VALUES: QuestionFormInput = {
  question: '',
  option1: '',
  option2: '',
  option3: '',
  option4: '',
  correctOption: '',
  explanation: '',
  difficulty: '',
  topicId: '',
  subTopicId: '',
  mediaUrl: '',
}

/** Used for the sidebar's completion indicator — reuses the exact same validity rules as submission. */
export function isQuestionComplete(values: QuestionFormInput): boolean {
  return questionSchema.safeParse(values).success
}
