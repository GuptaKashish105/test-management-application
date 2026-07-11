import { AuthProvider } from '@features/auth'
import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { QueryProvider } from './QueryProvider'

export interface AppProvidersProps {
  children: ReactNode
}

/** Composition root for all app-wide providers. */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  )
}
