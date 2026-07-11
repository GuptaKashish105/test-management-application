import { cn } from '@utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
export type ButtonSize = 'sm' | 'md'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600 disabled:bg-brand-300',
  secondary: 'bg-neutral-50 text-brand-700 border border-brand-200 hover:bg-brand-50',
  danger: 'bg-danger-500 text-white hover:bg-danger-700 disabled:bg-danger-300',
  ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
}

/** Shared visual styling for Button and LinkButton, so the two never drift apart. */
export function buttonClassNames(variant: ButtonVariant, size: ButtonSize, className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
    'disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    className,
  )
}
