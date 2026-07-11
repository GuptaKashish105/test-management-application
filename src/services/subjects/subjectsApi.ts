import { apiRequest } from '../apiClient'
import type { Subject } from './types'

export const subjectsApi = {
  getAll(): Promise<Subject[]> {
    return apiRequest<Subject[]>({ method: 'GET', url: '/subjects' })
  },
}
