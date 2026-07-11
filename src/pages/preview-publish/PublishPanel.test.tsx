import { usePublishTest } from '@features/tests'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PublishPanel } from './PublishPanel'

vi.mock('@features/tests', () => ({ usePublishTest: vi.fn() }))

const mockedUsePublishTest = vi.mocked(usePublishTest)

function renderPanel(props: Partial<ComponentProps<typeof PublishPanel>> = {}) {
  const mutate = vi.fn()
  mockedUsePublishTest.mockReturnValue({
    mutate,
    isPending: false,
    error: null,
  } as unknown as ReturnType<typeof usePublishTest>)

  render(
    <MemoryRouter initialEntries={['/tests/test-1/preview']}>
      <Routes>
        <Route
          path="/tests/:testId/preview"
          element={
            <PublishPanel
              testId="test-1"
              testName="Sample Test"
              isAlreadyLive={false}
              canPublish
              {...props}
            />
          }
        />
        <Route path="/dashboard" element={<p>Dashboard sentinel</p>} />
      </Routes>
    </MemoryRouter>,
  )

  return { mutate }
}

describe('PublishPanel', () => {
  beforeEach(() => {
    mockedUsePublishTest.mockReset()
  })

  it('shows an already-live message instead of publish controls', () => {
    renderPanel({ isAlreadyLive: true })
    expect(screen.getByText('This test is already live.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Publish Test' })).not.toBeInTheDocument()
  })

  it('renders Schedule Publish as a disabled tab', () => {
    renderPanel()
    expect(screen.getByRole('tab', { name: 'Schedule Publish' })).toBeDisabled()
    expect(screen.getByRole('tab', { name: 'Publish Now' })).toBeEnabled()
  })

  it('disables the Publish button and shows the reason when canPublish is false', () => {
    renderPanel({ canPublish: false, disabledReason: 'Add at least 1 question before publishing.' })
    expect(screen.getByRole('button', { name: 'Publish Test' })).toBeDisabled()
    expect(screen.getByText('Add at least 1 question before publishing.')).toBeInTheDocument()
  })

  it('confirms before publishing, then shows success and navigates to the dashboard', async () => {
    const user = userEvent.setup()
    const { mutate } = renderPanel()

    await user.click(screen.getByRole('button', { name: 'Publish Test' }))
    expect(screen.getByRole('dialog', { name: 'Publish test' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(mutate).toHaveBeenCalledTimes(1)

    const onSuccess = mutate.mock.calls[0][1].onSuccess
    onSuccess()

    expect(await screen.findByRole('dialog', { name: 'Test published' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Go to Dashboard' }))
    expect(await screen.findByText('Dashboard sentinel')).toBeInTheDocument()
  })
})
