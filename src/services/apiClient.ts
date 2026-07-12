import { env } from '@config/env'
import type { ApiEnvelope, ApiError } from '@typings/api'
import axios, { type AxiosError, type AxiosRequestConfig } from 'axios'

// Imported directly (not via the `auth` barrel) to avoid a circular import:
// the barrel also re-exports authApi, which itself imports this module.
import { authStorage } from './auth/authStorage'

const axiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
})

if (env.isDemoMode) {
  console.info(
    '%c[Demo Mode] Enabled — all API calls are served from local mock data. Set VITE_DEMO_MODE=false (or remove it) to restore the real backend.',
    'color: #7c3aed; font-weight: bold;',
  )
}

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
 *
 * DEMO MODE: when env.isDemoMode is true, requests are routed to the local
 * mock database instead of the network — everything below this branch (real
 * axios instance, interceptors, auth header, 401 handling) is untouched and
 * takes over immediately once VITE_DEMO_MODE is unset. No service file
 * (authApi, testsApi, questionsApi, ...) needs to know this branch exists.
 * The mock module is dynamically imported so it's code-split out of the
 * bundle entirely when demo mode is off (the default, including production).
 */
export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  if (env.isDemoMode) {
    const { demoApiRequest } = await import('./demoMode')
    return demoApiRequest<T>(config)
  }

  const response = await axiosInstance.request<ApiEnvelope<T>>(config)
  return response.data.data
}
