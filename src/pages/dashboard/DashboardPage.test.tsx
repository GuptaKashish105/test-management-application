import { useTests } from '@features/tests'
import type { Test } from '@services/tests'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DashboardPage } from './DashboardPage'

vi.mock('@features/tests', () => ({
  useTests: vi.fn(),
}))

const mockedUseTests = vi.mocked(useTests)

type UseTestsResult = ReturnType<typeof useTests>

/** Only the fields DashboardPage reads are relevant per test; the rest of react-query's
 * UseQueryResult shape is irrelevant noise, so this is the single cast point. */
function mockUseTests(overrides: Partial<UseTestsResult>) {
  mockedUseTests.mockReturnValue(overrides as unknown as UseTestsResult)
}

function renderDashboard() {
  return render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>,
  )
}

const sampleTests: Test[] = [
  {
    id: 'test-1',
    name: 'Algebra Basics',
    subject: 'Mathematics',
    topics: ['Algebra'],
    status: 'draft',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'test-2',
    name: 'Physics Mock',
    subject: 'Physics',
    topics: ['Mechanics'],
    status: 'live',
    createdAt: '2025-02-01T10:00:00Z',
  },
]

describe('DashboardPage', () => {
  beforeEach(() => {
    mockedUseTests.mockReset()
  })

  it('shows a loading state', () => {
    mockUseTests({ data: undefined, isLoading: true, isError: false, error: null })

    renderDashboard()
    expect(screen.getByText('Loading tests…')).toBeInTheDocument()
  })

  it('shows an error state with a working retry button', async () => {
    const refetch = vi.fn()
    mockUseTests({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { message: 'Failed to load tests.' },
      refetch,
      isFetching: false,
    })

    const user = userEvent.setup()
    renderDashboard()

    expect(screen.getByRole('alert')).toHaveTextContent('Failed to load tests.')
    await user.click(screen.getByRole('button', { name: 'Retry' }))
    expect(refetch).toHaveBeenCalled()
  })

  it('shows an empty state when there are no tests', () => {
    mockUseTests({ data: [], isLoading: false, isError: false, error: null })

    renderDashboard()
    expect(screen.getByText('No tests yet.')).toBeInTheDocument()
  })

  it('lists tests and filters them by search', async () => {
    mockUseTests({ data: sampleTests, isLoading: false, isError: false, error: null })

    const user = userEvent.setup()
    renderDashboard()

    expect(screen.getByText('Algebra Basics')).toBeInTheDocument()
    expect(screen.getByText('Physics Mock')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Search'), 'physics')

    expect(screen.queryByText('Algebra Basics')).not.toBeInTheDocument()
    expect(screen.getByText('Physics Mock')).toBeInTheDocument()
  })

  it('shows a no-match message when the search filters out every test', async () => {
    mockUseTests({ data: sampleTests, isLoading: false, isError: false, error: null })

    const user = userEvent.setup()
    renderDashboard()

    await user.type(screen.getByLabelText('Search'), 'nonexistent')
    expect(screen.getByText('No tests match your search.')).toBeInTheDocument()
  })

  it('opens a delete dialog that explains deletion is not available yet, without calling any API', async () => {
    mockUseTests({ data: sampleTests, isLoading: false, isError: false, error: null })

    const user = userEvent.setup()
    renderDashboard()

    const row = screen.getByText('Algebra Basics').closest('tr')
    expect(row).not.toBeNull()
    await user.click(within(row as HTMLElement).getByRole('button', { name: 'Delete' }))

    expect(screen.getByRole('dialog', { name: 'Delete test' })).toBeInTheDocument()
    expect(screen.getByText(/isn't available yet/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
