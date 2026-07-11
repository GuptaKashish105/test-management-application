import { describe, expect, it, vi } from 'vitest'

import { apiRequest } from '../apiClient'
import { subTopicsApi } from './subTopicsApi'

vi.mock('../apiClient', () => ({
  apiRequest: vi.fn(),
}))

const mockedApiRequest = vi.mocked(apiRequest)

describe('subTopicsApi.getByTopics', () => {
  it('posts topicIds to /sub-topics/multi-topics', async () => {
    mockedApiRequest.mockResolvedValueOnce([
      { id: 'subtopic-1', name: 'Linear Equations', topic_id: 'topic-1' },
    ])

    const subTopics = await subTopicsApi.getByTopics(['topic-1', 'topic-2'])

    expect(mockedApiRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/sub-topics/multi-topics',
      data: { topicIds: ['topic-1', 'topic-2'] },
    })
    expect(subTopics).toEqual([{ id: 'subtopic-1', name: 'Linear Equations', topic_id: 'topic-1' }])
  })
})
