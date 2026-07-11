import { apiRequest } from '../apiClient'
import type { Topic } from './types'

export const topicsApi = {
  getBySubject(subjectId: string): Promise<Topic[]> {
    return apiRequest<Topic[]>({ method: 'GET', url: `/topics/subject/${subjectId}` })
  },
}
