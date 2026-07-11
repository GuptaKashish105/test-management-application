import { cn } from '@utils/cn'
import type { HTMLAttributes } from 'react'

import type { Tone } from './tone'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

const toneClasses: Record<Tone, string> = {
  brand: 'bg-brand-100 text-brand-800',
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  danger: 'bg-danger-100 text-danger-700',
  neutral: 'bg-neutral-100 text-neutral-700',
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  )
}
