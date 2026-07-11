import { cn } from '@utils/cn'
import { useEffect, useId, useRef, useState } from 'react'

export interface MultiSelectOption {
  value: string
  label: string
}

export interface MultiSelectProps {
  label: string
  options: MultiSelectOption[]
  value: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  error?: string
  disabled?: boolean
  className?: string
}

/** Checkbox-panel multi-select with chip display, since native `<select multiple>` is poor UX. */
export function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Choose from Drop-down',
  error,
  disabled = false,
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerId = useId()
  const panelId = useId()
  const errorId = useId()

  useEffect(() => {
    if (!isOpen) return

    const onClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  const toggleValue = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const selectedLabels = options.filter((option) => value.includes(option.value))

  return (
    <div className={cn('flex flex-col gap-1.5', className)} ref={containerRef}>
      <label id={triggerId} className="text-sm font-medium text-neutral-800">
        {label}
      </label>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-labelledby={triggerId}
        aria-describedby={error ? errorId : undefined}
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          'flex min-h-11 w-full flex-wrap items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-2 text-left text-sm',
          'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-500',
          'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-500',
          error && 'border-danger-500',
        )}
      >
        {selectedLabels.length === 0 ? (
          <span className="text-neutral-500">{placeholder}</span>
        ) : (
          selectedLabels.map((option) => (
            <span
              key={option.value}
              className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-800"
            >
              {option.label}
            </span>
          ))
        )}
      </button>

      {isOpen && (
        <fieldset
          id={panelId}
          className="relative z-20 max-h-56 overflow-y-auto rounded-md border border-neutral-200 bg-white p-2 shadow-card"
        >
          <legend className="sr-only">{label}</legend>
          {options.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-neutral-500">No options available.</p>
          ) : (
            options.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-neutral-800 hover:bg-neutral-50"
              >
                <input
                  type="checkbox"
                  checked={value.includes(option.value)}
                  onChange={() => toggleValue(option.value)}
                  className="h-4 w-4 accent-brand-500"
                />
                {option.label}
              </label>
            ))
          )}
        </fieldset>
      )}

      {error && (
        <p id={errorId} className="text-sm text-danger-700">
          {error}
        </p>
      )}
    </div>
  )
}
