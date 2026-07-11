import { cn } from '@utils/cn'
import { forwardRef, type InputHTMLAttributes, useId } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const errorId = error ? `${inputId}-error` : undefined

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-neutral-800">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn(
            'h-11 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-800 transition-colors',
            'placeholder:text-neutral-500',
            'hover:border-neutral-300',
            'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-500',
            'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-500 disabled:hover:border-neutral-200',
            error && 'border-danger-500',
            className,
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-danger-700">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
