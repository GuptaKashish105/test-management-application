import { cn } from '@utils/cn'

import { Spinner } from './Spinner'

export interface LoadingStateProps {
  message: string
  /** Fills the remaining vertical space — for pages rendering this as their entire content. */
  fullHeight?: boolean
}

export function LoadingState({ message, fullHeight = false }: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 py-16 text-neutral-500',
        fullHeight && 'flex-1 p-16',
      )}
    >
      <Spinner />
      <span>{message}</span>
    </div>
  )
}
