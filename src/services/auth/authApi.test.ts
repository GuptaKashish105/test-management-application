import { describe, expect, it, vi } from 'vitest'

import { apiRequest } from '../apiClient'
import { authApi } from './authApi'

vi.mock('../apiClient', () => ({
  apiRequest: vi.fn(),
}))

const mockedApiRequest = vi.mocked(apiRequest)

describe('authApi.login', () => {
  it('posts credentials to /auth/login and normalizes the response to just the token', async () => {
    mockedApiRequest.mockResolvedValueOnce({
      token: 'jwt-token-here',
      user: { anything: 'the API doc leaves this undocumented' },
    })

    const session = await authApi.login({ userId: 'vedant-admin', password: 'vedant123' })

    expect(mockedApiRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/auth/login',
      data: { userId: 'vedant-admin', password: 'vedant123' },
    })
    expect(session).toEqual({ token: 'jwt-token-here' })
  })

  it('propagates errors from the API layer', async () => {
    mockedApiRequest.mockRejectedValueOnce({ message: 'Invalid credentials', status: 401 })

    await expect(authApi.login({ userId: 'bad', password: 'bad' })).rejects.toEqual({
      message: 'Invalid credentials',
      status: 401,
    })
  })
})
