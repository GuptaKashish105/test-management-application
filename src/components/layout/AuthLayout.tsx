import type { ReactNode } from 'react'

export interface AuthLayoutProps {
  children: ReactNode
}

/** Split-screen shell used by the login page: decorative panel + form card. */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-svh bg-brand-50">
      <div className="hidden flex-1 items-center justify-center lg:flex" aria-hidden="true" />
      <div className="flex w-full items-center justify-center p-6 lg:w-[480px]">
        <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-8 shadow-card">
          {children}
        </div>
      </div>
    </div>
  )
}
