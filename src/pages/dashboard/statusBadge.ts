import type { Tone } from '@components/ui'

export interface StatusBadgeInfo {
  label: string
  tone: Tone
}

/**
 * `status` comes straight from the API as a loosely-typed string (or null).
 * Only 'draft' / null / 'live' are documented; anything else falls back to a
 * neutral, capitalized label instead of throwing, since the backend could
 * introduce new values without notice.
 */
export function getStatusBadgeInfo(status: string | null): StatusBadgeInfo {
  if (status === null || status === 'draft') {
    return { label: 'Draft', tone: 'neutral' }
  }
  if (status === 'live') {
    return { label: 'Live', tone: 'success' }
  }
  return { label: status.charAt(0).toUpperCase() + status.slice(1), tone: 'brand' }
}
