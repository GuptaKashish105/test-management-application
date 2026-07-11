import { useAuth } from '@features/auth'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { paths } from './paths'

export interface PublicOnlyRouteProps {
  children: ReactNode
}

/** Keeps already-authenticated users off public-only pages (e.g. Login). */
export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={paths.dashboard} replace />
  }

  return children
}
