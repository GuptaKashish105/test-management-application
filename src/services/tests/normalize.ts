import type { RawTestDetail, RawTestListItem } from './types'

/**
 * Stable, UI-facing model. `GET /tests` returns `subject`/`topics` as display
 * names (not the ids `POST /tests` expects) — that id-vs-name discrepancy is
 * a Create/Edit Test concern, not a Dashboard one, since this page only reads.
 */
export interface Test {
  id: string
  name: string
  subject: string
  topics: string[]
  status: string | null
  createdAt: string
}

export function normalizeTest(raw: RawTestListItem): Test {
  return {
    id: raw.id,
    name: raw.name,
    subject: raw.subject,
    topics: raw.topics,
    status: raw.status,
    createdAt: raw.created_at,
  }
}

/**
 * Edit-page model. Subject/topics/sub-topics stay as the *names* the API
 * returned — resolving them to the ids the edit form needs is a separate
 * concern (see useEditTestFormData), since it requires cross-referencing the
 * subjects/topics services this module doesn't depend on.
 */
export interface TestDetail {
  id: string
  name: string
  subjectName: string
  topicNames: string[]
  subTopicNames: string[]
  type: string | null
  difficulty: string | null
  correctMarks: number | null
  wrongMarks: number | null
  unattemptMarks: number | null
  totalTime: number | null
  totalMarks: number | null
  totalQuestions: number | null
  status: string | null
  questionIds: string[]
}

export function normalizeTestDetail(raw: RawTestDetail): TestDetail {
  return {
    id: raw.id,
    name: raw.name,
    subjectName: raw.subject,
    topicNames: raw.topics,
    subTopicNames: raw.sub_topics ?? [],
    type: raw.type ?? null,
    difficulty: raw.difficulty ?? null,
    correctMarks: raw.correct_marks ?? null,
    wrongMarks: raw.wrong_marks ?? null,
    unattemptMarks: raw.unattempt_marks ?? null,
    totalTime: raw.total_time ?? null,
    totalMarks: raw.total_marks ?? null,
    totalQuestions: raw.total_questions ?? null,
    status: raw.status ?? null,
    questionIds: raw.questions,
  }
}
