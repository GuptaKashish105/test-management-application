/** Only `type: "mcq"` is shown in the API doc's example — the only supported question type. */
type QuestionType = 'mcq'

type CorrectOption = 'option1' | 'option2' | 'option3' | 'option4'

/**
 * Matches the documented `POST /questions/bulk` item shape exactly. The doc's
 * example is a complete object (no `...` truncation, unlike the test
 * endpoints), so fields it doesn't show — topic/sub-topic/media URL, which
 * requirements.md lists as form fields — are treated as unsupported by this
 * endpoint rather than guessed at.
 */
export interface CreateQuestionPayload {
  type: QuestionType
  question: string
  option1: string
  option2: string
  option3: string
  option4: string
  correct_option: CorrectOption
  explanation?: string
  difficulty?: string
  test_id: string
}

export interface BulkCreateQuestionsBody {
  questions: CreateQuestionPayload[]
}

/** Only `id` is confirmed by the doc's truncated (`...`) response example. */
export interface BulkCreateQuestionsResponseItem {
  id: string
}

/**
 * `POST /questions/fetchBulk` shows no response example at all. Shape
 * assumed to mirror what was sent via bulk-create, consistent with every
 * other endpoint's `{ success, data }` envelope.
 */
export interface RawQuestion {
  id: string
  type?: string
  question: string
  option1: string
  option2: string
  option3: string
  option4: string
  correct_option: string
  explanation?: string
  difficulty?: string
  test_id?: string
}
