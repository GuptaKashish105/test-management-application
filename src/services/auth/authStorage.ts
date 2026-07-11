/**
 * Sole seam allowed to touch localStorage/sessionStorage directly
 * (enforced by the no-restricted-globals ESLint rule everywhere else).
 * Swapping the persistence strategy later (cookies, sessionStorage, ...)
 * means changing this file only.
 */
export interface AuthStorage {
  getToken(): string | null
  setToken(token: string): void
  clearToken(): void
}

const TOKEN_KEY = 'tma_auth_token'

class WebAuthStorage implements AuthStorage {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export const authStorage: AuthStorage = new WebAuthStorage()
