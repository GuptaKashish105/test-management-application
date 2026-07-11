import { cn } from '@utils/cn'
import type { ReactNode } from 'react'
import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

/** Generic accessible dialog primitive — reused by ConfirmDialog and future modals (e.g. Edit Test). */
export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    panelRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-neutral-900/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-modal outline-none',
          className,
        )}
      >
        <h2 id={titleId} className="text-lg font-semibold text-neutral-900">
          {title}
        </h2>
        <div className="mt-3">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
