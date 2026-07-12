import { cn } from '@utils/cn'
import { useEffect, useId, useRef } from 'react'

export interface RichTextEditorProps {
  label?: string
  value: string
  onChange: (html: string) => void
  onBlur?: () => void
  placeholder?: string
  disabled?: boolean
  error?: string
  className?: string
}

const TOOLBAR_COMMANDS = [
  { command: 'bold', label: 'Bold', icon: 'B', iconClassName: 'font-bold' },
  { command: 'italic', label: 'Italic', icon: 'I', iconClassName: 'italic' },
  { command: 'underline', label: 'Underline', icon: 'U', iconClassName: 'underline' },
  { command: 'insertUnorderedList', label: 'Bullet list', icon: '•', iconClassName: '' },
  { command: 'insertOrderedList', label: 'Numbered list', icon: '1.', iconClassName: '' },
] as const

/**
 * Minimal contentEditable rich text editor (bold/italic/underline/lists/links) — stores
 * its content as an HTML string. Uses the browser's built-in `execCommand`; still
 * broadly supported across evergreen browsers and avoids pulling in an editor library
 * for a single field. Content is set into the DOM once on mount only — the parent
 * remounts this component (via `key`) whenever the underlying question changes, so
 * re-syncing `value` into the DOM on every render isn't needed and would fight the
 * caret position while typing.
 */
export function RichTextEditor({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  error,
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const editorId = useId()
  const errorId = error ? `${editorId}-error` : undefined

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value
    }
    // Intentionally only on mount — see component doc comment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const emitChange = () => {
    onChange(editorRef.current?.innerHTML ?? '')
  }

  const runCommand = (command: string, arg?: string) => {
    if (disabled) return
    editorRef.current?.focus()
    // execCommand isn't implemented in every environment (e.g. jsdom in tests) — guarded
    // rather than assumed, since every evergreen browser still supports it for this use.
    if (typeof document.execCommand === 'function') {
      document.execCommand(command, false, arg)
    }
    emitChange()
  }

  const handleLink = () => {
    if (disabled) return
    const url = window.prompt('Link URL')
    if (!url) return
    runCommand('createLink', url)
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={editorId} className="text-sm font-medium text-neutral-800">
          {label}
        </label>
      )}
      <div
        className={cn(
          'rounded-md border border-neutral-200 bg-white transition-colors',
          'hover:border-neutral-300',
          'focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-brand-500',
          disabled && 'bg-neutral-50',
          error && 'border-danger-500',
        )}
      >
        <div
          role="toolbar"
          aria-label="Text formatting"
          aria-controls={editorId}
          className="flex flex-wrap items-center gap-1 border-b border-neutral-200 px-2 py-1"
        >
          {TOOLBAR_COMMANDS.map((item) => (
            <button
              key={item.command}
              type="button"
              disabled={disabled}
              aria-label={item.label}
              title={item.label}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand(item.command)}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded text-sm text-neutral-600 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50',
                item.iconClassName,
              )}
            >
              {item.icon}
            </button>
          ))}
          <button
            type="button"
            disabled={disabled}
            aria-label="Link"
            title="Link"
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleLink}
            className="flex h-7 w-7 items-center justify-center rounded text-sm text-neutral-600 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            🔗
          </button>
        </div>
        <div
          id={editorId}
          ref={editorRef}
          role="textbox"
          aria-multiline="true"
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          aria-label={label ?? 'Rich text editor'}
          aria-disabled={disabled}
          contentEditable={!disabled}
          suppressContentEditableWarning
          data-placeholder={placeholder}
          onInput={emitChange}
          onBlur={onBlur}
          className={cn(
            'min-h-24 px-3 py-2 text-sm text-neutral-800 outline-none',
            'empty:before:text-neutral-500 empty:before:content-[attr(data-placeholder)]',
            disabled && 'text-neutral-500',
          )}
        />
      </div>
      {error && (
        <p id={errorId} className="text-sm text-danger-700">
          {error}
        </p>
      )}
    </div>
  )
}
