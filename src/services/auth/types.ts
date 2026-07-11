/** Raw request/response DTOs matching the documented `/auth/login` contract exactly. */
export interface LoginRequestBody {
  userId: string
  password: string
}

/**
 * The API doc leaves `user` as an undocumented `{ ... }` — no field names are
 * specified, so it's typed as `unknown` rather than guessed. Only `token` is
 * relied on until the real shape is confirmed against a live response.
 */
export interface LoginResponseData {
  token: string
  user: unknown
}
