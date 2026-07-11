/**
 * Temporary stand-in rendered by route definitions until the corresponding
 * feature page is implemented. Not a page itself — just lets routing/layout
 * be verified end-to-end ahead of feature work.
 */
export interface RoutePlaceholderProps {
  title: string
}

export function RoutePlaceholder({ title }: RoutePlaceholderProps) {
  return (
    <div className="flex flex-1 items-center justify-center p-12 text-center">
      <div>
        <p className="text-sm font-medium text-neutral-500">Not implemented yet</p>
        <h1 className="mt-1 text-xl font-semibold text-neutral-900">{title}</h1>
      </div>
    </div>
  )
}
