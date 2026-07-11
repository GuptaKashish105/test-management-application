import { apiRequest } from '../apiClient'
import type { Test, TestDetail } from './normalize'
import { normalizeTest, normalizeTestDetail } from './normalize'
import type {
  CreateTestPayload,
  CreateTestResponseData,
  PublishTestPayload,
  RawTestDetail,
  RawTestListItem,
  UpdateTestPayload,
} from './types'

export const testsApi = {
  async getAll(): Promise<Test[]> {
    const data = await apiRequest<RawTestListItem[]>({
      method: 'GET',
      url: '/tests',
    })
    return data.map(normalizeTest)
  },

  async getById(id: string): Promise<TestDetail> {
    const data = await apiRequest<RawTestDetail>({
      method: 'GET',
      url: `/tests/${id}`,
    })
    return normalizeTestDetail(data)
  },

  create(payload: CreateTestPayload): Promise<CreateTestResponseData> {
    return apiRequest<CreateTestResponseData>({
      method: 'POST',
      url: '/tests',
      data: payload,
    })
  },

  async update(id: string, payload: UpdateTestPayload): Promise<void> {
    await apiRequest<unknown>({
      method: 'PUT',
      url: `/tests/${id}`,
      data: payload,
    })
  },

  async publish(id: string): Promise<void> {
    const payload: PublishTestPayload = { status: 'live' }
    await apiRequest<unknown>({
      method: 'PUT',
      url: `/tests/${id}`,
      data: payload,
    })
  },
}
