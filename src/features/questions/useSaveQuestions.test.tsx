import { questionsApi } from '@services/questions'
import { testsApi } from '@services/tests'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createBlankQuestionRecord } from './questionRecord'
import { useSaveQuestions } from './useSaveQuestions'

vi.mock('@services/questions', () => ({
  questionsApi: { bulkCreate: vi.fn() },
}))
vi.mock('@services/tests', () => ({
  testsApi: { update: vi.fn() },
}))

const mockedBulkCreate = vi.mocked(questionsApi.bulkCreate)
const mockedUpdate = vi.mocked(testsApi.update)

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: 0 } } })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

function draftQuestion() {
  return {
    ...createBlankQuestionRecord(),
    question: 'What is 2 + 2?',
    option1: '3',
    option2: '4',
    option3: '5',
    option4: '6',
    correctOption: 'option2' as const,
  }
}

describe('useSaveQuestions', () => {
  beforeEach(() => {
    mockedBulkCreate.mockReset()
    mockedUpdate.mockReset()
  })

  it('bulk-creates only draft questions, then links existing + new ids with total_marks = count * correctMarks', async () => {
    mockedBulkCreate.mockResolvedValueOnce([{ id: 'new-question-1' }, { id: 'new-question-2' }])
    mockedUpdate.mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useSaveQuestions(), { wrapper })

    act(() => {
      result.current.mutate({
        testId: 'test-1',
        draftQuestions: [draftQuestion(), draftQuestion()],
        existingPersistedIds: ['existing-question-1'],
        totalQuestionCount: 3,
        correctMarksPerQuestion: 4,
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockedBulkCreate).toHaveBeenCalledTimes(1)
    expect(mockedBulkCreate.mock.calls[0][0]).toHaveLength(2)
    expect(mockedUpdate).toHaveBeenCalledWith('test-1', {
      questions: ['existing-question-1', 'new-question-1', 'new-question-2'],
      total_questions: 3,
      total_marks: 12,
    })
  })

  it('skips bulk-create entirely when there are no draft questions (all already saved)', async () => {
    mockedUpdate.mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useSaveQuestions(), { wrapper })

    act(() => {
      result.current.mutate({
        testId: 'test-1',
        draftQuestions: [],
        existingPersistedIds: ['existing-question-1', 'existing-question-2'],
        totalQuestionCount: 2,
        correctMarksPerQuestion: 5,
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockedBulkCreate).not.toHaveBeenCalled()
    expect(mockedUpdate).toHaveBeenCalledWith('test-1', {
      questions: ['existing-question-1', 'existing-question-2'],
      total_questions: 2,
      total_marks: 10,
    })
  })

  it('surfaces an error and does not call update when bulk-create fails', async () => {
    mockedBulkCreate.mockRejectedValueOnce({ message: 'Bulk create failed' })

    const { result } = renderHook(() => useSaveQuestions(), { wrapper })

    act(() => {
      result.current.mutate({
        testId: 'test-1',
        draftQuestions: [draftQuestion()],
        existingPersistedIds: [],
        totalQuestionCount: 1,
        correctMarksPerQuestion: 4,
      })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(mockedUpdate).not.toHaveBeenCalled()
  })
})
