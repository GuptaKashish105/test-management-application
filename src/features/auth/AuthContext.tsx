import { authStorage } from '@services/auth'
import type { ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'

import { AuthContext, type AuthContextValue } from './authContextInstance'

export interface AuthProviderProps {
  children: ReactNode
}

/**
 * Single in-memory source of truth for auth state, kept in sync with the
 * authStorage abstraction. Components read this instead of touching
 * storage directly, so auth state changes (login/logout) re-render reactively.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => authStorage.getToken())

  const login = useCallback((newToken: string) => {
    authStorage.setToken(newToken)
    setToken(newToken)
  }, [])

  const logout = useCallback(() => {
    authStorage.clearToken()
    setToken(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ token, isAuthenticated: token !== null, login, logout }),
    [token, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
