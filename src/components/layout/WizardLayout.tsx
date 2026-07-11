import type { ReactNode } from 'react'

export interface WizardLayoutProps {
  /** Collapsible question-list style panel used by Add Questions / Preview steps. */
  sidebar?: ReactNode
  /** Test summary header shared across the 3 wizard steps. */
  header?: ReactNode
  /** Step-specific form/content. */
  children: ReactNode
  /** Step navigation actions (Cancel/Next/Save & Continue/Publish...). */
  footer?: ReactNode
}

/**
 * Shared chrome for the Create Test / Add Questions / Preview & Publish
 * steps, so each step page only supplies its own content. Purely
 * structural — no wizard/business logic lives here.
 */
export function WizardLayout({ sidebar, header, children, footer }: WizardLayoutProps) {
  return (
    <div className="flex flex-1">
      {sidebar && (
        <aside className="hidden w-72 shrink-0 border-r border-neutral-200 bg-white p-4 lg:block">
          {sidebar}
        </aside>
      )}
      <div className="flex flex-1 flex-col">
        {header && <div className="border-b border-neutral-200 bg-white p-6">{header}</div>}
        <div className="flex-1 p-6">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-neutral-200 bg-white p-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
