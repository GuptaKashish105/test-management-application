import { useFetchExistingQuestions } from '@features/questions'
import { usePublishTest, useTest } from '@features/tests'
import type { Question } from '@services/questions'
import type { TestDetail } from '@services/tests'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PreviewPublishPage } from './PreviewPublishPage'

vi.mock('@features/questions', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@features/questions')>()
  return { ...actual, useFetchExistingQuestions: vi.fn() }
})
vi.mock('@features/tests', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@features/tests')>()
  return { ...actual, useTest: vi.fn(), usePublishTest: vi.fn() }
})

const mockedUseTest = vi.mocked(useTest)
const mockedUseFetchExistingQuestions = vi.mocked(useFetchExistingQuestions)
const mockedUsePublishTest = vi.mocked(usePublishTest)

function mockUseTest(overrides: Partial<ReturnType<typeof useTest>>) {
  mockedUseTest.mockReturnValue(overrides as unknown as ReturnType<typeof useTest>)
}

function mockUseFetchExistingQuestions(overrides: Partial<ReturnType<typeof useFetchExistingQuestions>>) {
  mockedUseFetchExistingQuestions.mockReturnValue(
    overrides as unknown as ReturnType<typeof useFetchExistingQuestions>,
  )
}

const testDetail: TestDetail = {
  id: 'test-1',
  name: 'Sample Test',
  subjectName: 'Mathematics',
  topicNames: ['Algebra'],
  subTopicNames: [],
  type: 'chapterwise',
  difficulty: 'medium',
  correctMarks: 4,
  wrongMarks: -1,
  unattemptMarks: 0,
  totalTime: 60,
  totalMarks: 4,
  totalQuestions: 1,
  status: null,
  questionIds: ['question-1'],
}

const question: Question = {
  id: 'question-1',
  question: 'What is 2 + 2?',
  option1: '3',
  option2: '4',
  option3: '5',
  option4: '6',
  correctOption: 'option2',
  explanation: '',
  difficulty: null,
}

function renderPage() {
  const mutate = vi.fn()
  mockedUsePublishTest.mockReturnValue({
    mutate,
    isPending: false,
    error: null,
  } as unknown as ReturnType<typeof usePublishTest>)

  render(
    <MemoryRouter initialEntries={['/tests/test-1/preview']}>
      <Routes>
        <Route path="/tests/:testId/preview" element={<PreviewPublishPage />} />
        <Route path="/dashboard" element={<p>Dashboard sentinel</p>} />
      </Routes>
    </MemoryRouter>,
  )

  return { mutate }
}

describe('PreviewPublishPage', () => {
  beforeEach(() => {
    mockedUseTest.mockReset()
    mockedUseFetchExistingQuestions.mockReset()
    mockedUsePublishTest.mockReset()
  })

  it('shows a loading state while the test is loading', () => {
    mockUseTest({ data: undefined, isLoading: true, error: null })
    mockUseFetchExistingQuestions({ data: undefined, isLoading: false, error: null })

    renderPage()
    expect(screen.getByText('Loading test…')).toBeInTheDocument()
  })

  it('shows an error state when the test fails to load', () => {
    mockUseTest({ data: undefined, isLoading: false, error: { message: 'Failed to load' } })
    mockUseFetchExistingQuestions({ data: undefined, isLoading: false, error: null })

    renderPage()
    expect(screen.getByText('Failed to load')).toBeInTheDocument()
  })

  it('disables Confirm and shows a hint when the test has no questions', () => {
    mockUseTest({ data: { ...testDetail, questionIds: [] }, isLoading: false, error: null })
    mockUseFetchExistingQuestions({ data: [], isLoading: false, error: null })

    renderPage()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
    expect(screen.getByText('Add at least 1 question before publishing.')).toBeInTheDocument()
  })

  it('shows all questions with options', () => {
    mockUseTest({ data: testDetail, isLoading: false, error: null })
    mockUseFetchExistingQuestions({ data: [question], isLoading: false, error: null })

    renderPage()
    expect(screen.getByText('1. What is 2 + 2?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeEnabled()
  })

  it('confirming publish calls the mutation and shows a success modal that redirects to the dashboard', async () => {
    const user = userEvent.setup()
    mockUseTest({ data: testDetail, isLoading: false, error: null })
    mockUseFetchExistingQuestions({ data: [question], isLoading: false, error: null })
    const { mutate } = renderPage()

    await user.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(mutate).toHaveBeenCalledTimes(1)

    const onSuccess = mutate.mock.calls[0][1].onSuccess
    onSuccess()

    expect(await screen.findByRole('dialog', { name: 'Test published' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Go to Dashboard' }))
    expect(await screen.findByText('Dashboard sentinel')).toBeInTheDocument()
  })

  it('Cancel navigates to the dashboard without publishing', async () => {
    const user = userEvent.setup()
    mockUseTest({ data: testDetail, isLoading: false, error: null })
    mockUseFetchExistingQuestions({ data: [question], isLoading: false, error: null })
    const { mutate } = renderPage()

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(mutate).not.toHaveBeenCalled()
    expect(await screen.findByText('Dashboard sentinel')).toBeInTheDocument()
  })

  it('shows an already-live message and disables Confirm when the test is already published', () => {
    mockUseTest({ data: { ...testDetail, status: 'live' }, isLoading: false, error: null })
    mockUseFetchExistingQuestions({ data: [question], isLoading: false, error: null })

    renderPage()
    expect(screen.getByText('This test is already live.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
  })
})
