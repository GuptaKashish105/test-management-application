import type { Question } from '@services/questions'

import type { QuestionFormInput } from './questionSchema'
import { EMPTY_QUESTION_FORM_VALUES } from './questionSchema'

type QuestionStatus = 'draft' | 'saved'

/**
 * A question as staged in the Add Questions page. 'draft' questions exist
 * only client-side until "Save & Continue" bulk-creates them; 'saved' ones
 * were rehydrated from an already-persisted test (via fetchBulk) and are
 * read-only, since no single-question update/delete endpoint is documented.
 */
export interface QuestionRecord extends QuestionFormInput {
  clientId: string
  status: QuestionStatus
  persistedId?: string
}

export function createBlankQuestionRecord(): QuestionRecord {
  return {
    ...EMPTY_QUESTION_FORM_VALUES,
    clientId: crypto.randomUUID(),
    status: 'draft',
  }
}

/**
 * topic/sub-topic/media URL aren't part of the documented bulk-create
 * schema, so they were never sent — a rehydrated question has no value to
 * restore them from.
 */
export function questionToRecord(question: Question): QuestionRecord {
  return {
    clientId: question.id,
    status: 'saved',
    persistedId: question.id,
    question: question.question,
    option1: question.option1,
    option2: question.option2,
    option3: question.option3,
    option4: question.option4,
    correctOption: question.correctOption,
    explanation: question.explanation,
    difficulty: question.difficulty ?? '',
    topicId: '',
    subTopicId: '',
    mediaUrl: '',
  }
}
