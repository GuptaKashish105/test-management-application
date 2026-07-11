import { cn } from '@utils/cn'
import { forwardRef, type TextareaHTMLAttributes, useId } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className, rows = 4, ...props }, ref) => {
    const generatedId = useId()
    const textareaId = id ?? generatedId
    const errorId = error ? `${textareaId}-error` : undefined

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-neutral-800">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn(
            'rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800',
            'placeholder:text-neutral-500',
            'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-500',
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

Textarea.displayName = 'Textarea'
