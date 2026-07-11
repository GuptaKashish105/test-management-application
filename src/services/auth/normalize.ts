import type { LoginResponseData } from './types'

/** Stable, UI-facing session shape — isolates callers from the raw API response. */
export interface AuthSession {
  token: string
}

export function normalizeLoginResponse(raw: LoginResponseData): AuthSession {
  return { token: raw.token }
}
