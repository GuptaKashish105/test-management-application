import { describe, expect, it, vi } from 'vitest'

import { apiRequest } from '../apiClient'
import { topicsApi } from './topicsApi'

vi.mock('../apiClient', () => ({
  apiRequest: vi.fn(),
}))

const mockedApiRequest = vi.mocked(apiRequest)

describe('topicsApi.getBySubject', () => {
  it('fetches /topics/subject/:subjectId', async () => {
    mockedApiRequest.mockResolvedValueOnce([
      { id: 'topic-1', name: 'Algebra', subject_id: 'subject-1' },
    ])

    const topics = await topicsApi.getBySubject('subject-1')

    expect(mockedApiRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/topics/subject/subject-1',
    })
    expect(topics).toEqual([{ id: 'topic-1', name: 'Algebra', subject_id: 'subject-1' }])
  })
})
