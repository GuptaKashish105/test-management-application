import { apiRequest } from '../apiClient'
import type { Question } from './normalize'
import { normalizeQuestion } from './normalize'
import type {
  BulkCreateQuestionsBody,
  BulkCreateQuestionsResponseItem,
  CreateQuestionPayload,
  RawQuestion,
} from './types'

export const questionsApi = {
  bulkCreate(questions: CreateQuestionPayload[]): Promise<BulkCreateQuestionsResponseItem[]> {
    const body: BulkCreateQuestionsBody = { questions }
    return apiRequest<BulkCreateQuestionsResponseItem[]>({
      method: 'POST',
      url: '/questions/bulk',
      data: body,
    })
  },

  async fetchBulk(questionIds: string[]): Promise<Question[]> {
    const data = await apiRequest<RawQuestion[]>({
      method: 'POST',
      url: '/questions/fetchBulk',
      data: { question_ids: questionIds },
    })
    return data.map(normalizeQuestion)
  },
}
