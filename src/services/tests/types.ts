/** Raw list-item DTO matching the documented `GET /tests` response exactly. */
export interface RawTestListItem {
  id: string
  name: string
  subject: string
  topics: string[]
  status: string | null
  created_at: string
}

/**
 * Only `type: "chapterwise"` is confirmed by the API doc's example. The Figma
 * PYQ/Mock Test tabs exist visually but their wire values are unconfirmed, so
 * this stays a single-value literal until that's verified.
 */
type TestType = 'chapterwise'

export type TestDifficulty = 'easy' | 'medium' | 'difficult'

/** Matches the documented `POST /tests` request body exactly. */
export interface CreateTestPayload {
  name: string
  type: TestType
  subject: string
  topics: string[]
  sub_topics: string[]
  correct_marks: number
  wrong_marks: number
  unattempt_marks: number
  difficulty: TestDifficulty
  total_time: number
  total_marks: number
  total_questions: number
  status: null
}

/**
 * `PUT /tests/:id`'s doc example only updates a few fields (name, questions,
 * total_questions, total_marks), implying partial-update support. The
 * Create/Edit Test page only ever touches metadata fields; the Add Questions
 * page only ever touches `questions`/`total_questions`/`total_marks` — never
 * `status` (Publish page's job).
 */
export type UpdateTestPayload = Partial<Omit<CreateTestPayload, 'status'>> & {
  questions?: string[]
}

/** Matches the documented `PUT /tests/:id` publish payload exactly — nothing else. */
export interface PublishTestPayload {
  status: 'live'
}

/** Only `id`/`name` are shown explicitly in the `POST /tests` response example (rest is `...`). */
export interface CreateTestResponseData {
  id: string
  name: string
}

/**
 * `GET /tests/:id`'s doc example only shows id/name/subject/topics/questions
 * explicitly (rest is `...`). The remaining fields are presumed present since
 * they mirror what's set via `POST /tests` and a REST GET typically echoes
 * back what was written — but they're optional here so normalization can
 * degrade gracefully if any turn out to be genuinely absent.
 */
export interface RawTestDetail {
  id: string
  name: string
  subject: string
  topics: string[]
  questions: string[]
  sub_topics?: string[]
  type?: string
  correct_marks?: number
  wrong_marks?: number
  unattempt_marks?: number
  difficulty?: string
  total_time?: number
  total_marks?: number
  total_questions?: number
  status?: string | null
  created_at?: string
}
