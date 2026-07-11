import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PublishPanel } from './PublishPanel'

describe('PublishPanel', () => {
  it('shows an already-live message instead of the tabs and Live Until section', () => {
    render(<PublishPanel isAlreadyLive />)
    expect(screen.getByText('This test is already live.')).toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: 'Publish Now' })).not.toBeInTheDocument()
  })

  it('renders Publish Now as the only enabled tab', () => {
    render(<PublishPanel isAlreadyLive={false} />)
    expect(screen.getByRole('tab', { name: 'Publish Now' })).toBeEnabled()
    expect(screen.getByRole('tab', { name: 'Schedule Publish' })).toBeDisabled()
  })

  it('renders the Live Until options as a disabled fieldset (no scheduling API exists)', () => {
    render(<PublishPanel isAlreadyLive={false} />)
    const alwaysAvailable = screen.getByRole('radio', { name: 'Always Available' })
    expect(alwaysAvailable).toBeDisabled()
    expect(screen.getByRole('radio', { name: 'Custom Duration' })).toBeDisabled()
  })
})
