import { apiRequest } from '../apiClient'
import type { SubTopic } from './types'

export const subTopicsApi = {
  /**
   * Uses `POST /sub-topics/multi-topics` (doc #11) for every case, including a single
   * selected topic — it's the one endpoint built for the cascading multi-select topics
   * UI, so there's no need for a second code path against `GET /sub-topics/topic/:id`.
   * Note: the doc doesn't show a response example for this endpoint, unlike every other
   * list endpoint; it's assumed to follow the same `{ success, data }` envelope every
   * other endpoint in the doc uses, since apiRequest already relies on that consistently.
   */
  getByTopics(topicIds: string[]): Promise<SubTopic[]> {
    return apiRequest<SubTopic[]>({
      method: 'POST',
      url: '/sub-topics/multi-topics',
      data: { topicIds },
    })
  },
}
