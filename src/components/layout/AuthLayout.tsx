import type { ReactNode } from 'react'

import loginIllustration from '@/assets/login-illustration.png'

export interface AuthLayoutProps {
  children: ReactNode
}

/**
 * Split-screen shell used by the login page: decorative illustration panel
 * on the left, a flush white form panel on the right (Figma has no card
 * border/shadow around the form — the panel itself is the white area).
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-svh">
      <div className="hidden flex-1 items-center justify-center bg-brand-50 lg:flex">
        <img src={loginIllustration} alt="" className="w-full max-w-md px-8" />
      </div>
      <div className="flex w-full items-center justify-center border-l border-neutral-200 bg-white p-6 lg:w-[480px]">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
