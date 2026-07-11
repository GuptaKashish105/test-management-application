import { describe, expect, it } from 'vitest'

import { getStatusBadgeInfo } from './statusBadge'

describe('getStatusBadgeInfo', () => {
  it('treats null as Draft', () => {
    expect(getStatusBadgeInfo(null)).toEqual({ label: 'Draft', tone: 'neutral' })
  })

  it('treats "draft" as Draft', () => {
    expect(getStatusBadgeInfo('draft')).toEqual({ label: 'Draft', tone: 'neutral' })
  })

  it('treats "live" as Live/success', () => {
    expect(getStatusBadgeInfo('live')).toEqual({ label: 'Live', tone: 'success' })
  })

  it('falls back to a capitalized label for undocumented status values', () => {
    expect(getStatusBadgeInfo('archived')).toEqual({ label: 'Archived', tone: 'brand' })
  })
})
