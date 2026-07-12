import { cn } from '@utils/cn'
import { useId } from 'react'

interface RadioGroupOption {
  value: string
  label: string
}

export interface RadioGroupProps {
  name: string
  legend: string
  options: RadioGroupOption[]
  value: string | undefined
  onChange: (value: string) => void
  error?: string
  className?: string
}

export function RadioGroup({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  className,
}: RadioGroupProps) {
  const errorId = useId()

  return (
    <fieldset className={cn('flex flex-col gap-1.5', className)}>
      <legend className="text-sm font-medium text-neutral-800">{legend}</legend>
      <div
        className="flex flex-wrap gap-x-6 gap-y-2"
        role="radiogroup"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      >
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 text-sm text-neutral-800">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="h-4 w-4 accent-brand-500"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-danger-700">
          {error}
        </p>
      )}
    </fieldset>
  )
}
