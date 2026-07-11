/** Raw envelope every documented endpoint responds with. */
export interface ApiEnvelope<T> {
  success: boolean
  data: T
  message?: string
}

/** Normalized error shape the API client throws, regardless of failure cause. */
export interface ApiError {
  message: string
  status?: number
}
