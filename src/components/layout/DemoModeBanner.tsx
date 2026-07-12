import { env } from '@config/env'

/** Local-dev-only status indicator — renders nothing unless VITE_DEMO_MODE=true. */
export function DemoModeBanner() {
  if (!env.isDemoMode) return null

  return (
    <div
      role="status"
      className="pointer-events-none fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-brand-700 px-4 py-2 text-xs font-semibold text-white shadow-modal"
    >
      Demo Mode — mock data, no live backend
    </div>
  )
}
