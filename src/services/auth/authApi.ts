import { apiRequest } from '../apiClient'
import type { AuthSession } from './normalize'
import { normalizeLoginResponse } from './normalize'
import type { LoginRequestBody, LoginResponseData } from './types'

export const authApi = {
  async login(credentials: LoginRequestBody): Promise<AuthSession> {
    const data = await apiRequest<LoginResponseData>({
      method: 'POST',
      url: '/auth/login',
      data: credentials,
    })
    return normalizeLoginResponse(data)
  },
}
