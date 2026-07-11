import { cn } from '@utils/cn'
import type { HTMLAttributes } from 'react'

import type { Tone } from './tone'

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone
}

const toneClasses: Record<Tone, string> = {
  brand: 'border-brand-200 bg-brand-50 text-brand-800',
  success: 'border-success-200 bg-success-50 text-success-700',
  warning: 'border-warning-300 bg-warning-100 text-warning-700',
  danger: 'border-danger-300 bg-danger-100 text-danger-700',
  neutral: 'border-neutral-200 bg-neutral-50 text-neutral-700',
}

/** Inline banner for request-level errors/empty/info states (as opposed to per-field form errors). */
export function Alert({ tone = 'danger', role, className, ...props }: AlertProps) {
  return (
    <div
      role={role ?? 'alert'}
      className={cn('rounded-md border px-4 py-3 text-sm', toneClasses[tone], className)}
      {...props}
    />
  )
}
