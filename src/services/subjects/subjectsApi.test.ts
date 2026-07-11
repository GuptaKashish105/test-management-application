import { describe, expect, it, vi } from 'vitest'

import { apiRequest } from '../apiClient'
import { subjectsApi } from './subjectsApi'

vi.mock('../apiClient', () => ({
  apiRequest: vi.fn(),
}))

const mockedApiRequest = vi.mocked(apiRequest)

describe('subjectsApi.getAll', () => {
  it('fetches /subjects', async () => {
    mockedApiRequest.mockResolvedValueOnce([{ id: 'subject-1', name: 'Mathematics' }])

    const subjects = await subjectsApi.getAll()

    expect(mockedApiRequest).toHaveBeenCalledWith({ method: 'GET', url: '/subjects' })
    expect(subjects).toEqual([{ id: 'subject-1', name: 'Mathematics' }])
  })
})
