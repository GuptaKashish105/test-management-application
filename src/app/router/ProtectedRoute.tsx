import { useAuth } from '@features/auth'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { paths } from './paths'

export interface ProtectedRouteProps {
  children: ReactNode
}

/** Route guard only — no login flow, token refresh, or user-fetching logic here. */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={paths.login} replace state={{ from: location }} />
  }

  return children
}
