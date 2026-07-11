import { env } from '@config/env'
import type { ApiEnvelope, ApiError } from '@typings/api'
import axios, { type AxiosError, type AxiosRequestConfig } from 'axios'

// Imported directly (not via the `auth` barrel) to avoid a circular import:
// the barrel also re-exports authApi, which itself imports this module.
import { authStorage } from './auth/authStorage'

const axiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
})

axiosInstance.interceptors.request.use((config) => {
  const token = authStorage.getToken()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      authStorage.clearToken()
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }

    const apiError: ApiError = {
      message: error.response?.data?.message ?? error.message ?? 'Unexpected network error',
      status: error.response?.status,
    }
    return Promise.reject(apiError)
  },
)

/**
 * Issues a request and unwraps the documented `{ success, data, message }`
 * envelope, so callers (services/*) work directly with `T`. This is the only
 * place that knows about the envelope shape.
 */
export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance.request<ApiEnvelope<T>>(config)
  return response.data.data
}

export { axiosInstance as apiClient }
