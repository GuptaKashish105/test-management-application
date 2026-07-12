import { env } from '@config/env'

/**
 * Local-dev-only status note — renders nothing unless VITE_DEMO_MODE=true.
 * Shown only on the Login page (never after authenticating), so it stays a
 * small, low-contrast aside rather than a persistent floating banner.
 */
export function DemoModeBanner() {
  if (!env.isDemoMode) return null

  return (
    <p role="status" className="mt-4 text-center text-xs text-neutral-400">
      Local demo backend active — using mock data, no live API connected.
    </p>
  )
}
