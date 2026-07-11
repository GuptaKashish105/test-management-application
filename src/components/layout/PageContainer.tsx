import { cn } from '@utils/cn'
import type { HTMLAttributes } from 'react'

export function PageContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-6xl p-6', className)} {...props} />
}
