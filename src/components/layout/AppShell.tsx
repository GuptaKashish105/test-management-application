import type { ReactNode } from 'react'

import { Header } from './Header'
import { Sidebar } from './Sidebar'

export interface AppShellProps {
  children: ReactNode
}

/** Authenticated shell: Sidebar + Header + content outlet. Used by every protected page. */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-svh bg-neutral-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  )
}
