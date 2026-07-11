import { createBlankQuestionRecord, useSaveQuestions } from '@features/questions'
import { useSubTopics } from '@features/subTopics'
import type { TestDetail } from '@services/tests'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AddQuestionsEditor } from './AddQuestionsEditor'

vi.mock('@features/subTopics', () => ({ useSubTopics: vi.fn() }))
vi.mock('@features/questions', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@features/questions')>()
  return { ...actual, useSaveQuestions: vi.fn() }
})

const mockedUseSubTopics = vi.mocked(useSubTopics)
const mockedUseSaveQuestions = vi.mocked(useSaveQuestions)

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
  totalMarks: 200,
  totalQuestions: 50,
  status: null,
  questionIds: [],
}

function renderEditor(initialQuestions = [createBlankQuestionRecord()]) {
  const mutate = vi.fn()
  mockedUseSaveQuestions.mockReturnValue({
    mutate,
    isPending: false,
    error: null,
  } as unknown as ReturnType<typeof useSaveQuestions>)

  mockedUseSubTopics.mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
  } as unknown as ReturnType<typeof useSubTopics>)

  render(
    <MemoryRouter>
      <AddQuestionsEditor
        testId="test-1"
        test={testDetail}
        topics={[{ id: 'topic-1', name: 'Algebra', subject_id: 'subject-1' }]}
        isLoadingTopics={false}
        initialQuestions={initialQuestions}
      />
    </MemoryRouter>,
  )

  return { mutate }
}

describe('AddQuestionsEditor', () => {
  beforeEach(() => {
    mockedUseSaveQuestions.mockReset()
    mockedUseSubTopics.mockReset()
  })

  it('starts with one blank (incomplete) draft question and Save & Continue disabled', () => {
    renderEditor()

    expect(screen.getByRole('heading', { name: 'Question 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save & Continue' })).toBeDisabled()
    expect(screen.getByText('1 question(s) still need required fields filled.')).toBeInTheDocument()
  })

  it('"Add Another Question" appends and selects a new blank question', async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.click(screen.getByRole('button', { name: 'Add Another Question' }))

    expect(screen.getAllByText('Question 1')).toHaveLength(1)
    expect(screen.getByRole('heading', { name: 'Question 2' })).toBeInTheDocument()
    expect(screen.getByLabelText('Question')).toHaveValue('')
  })

  it('deleting a draft question removes it from the sidebar', async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.click(screen.getByRole('button', { name: 'Add Another Question' }))
    expect(screen.getByRole('heading', { name: 'Question 2' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Delete Question 2' }))
    expect(screen.queryByText('Question 2')).not.toBeInTheDocument()
  })

  it('completing the current question enables Save & Continue and submits the right payload', async () => {
    const user = userEvent.setup()
    const { mutate } = renderEditor()

    await user.type(screen.getByLabelText('Question'), 'What is 2 + 2?')
    const optionInputs = screen.getAllByPlaceholderText('Type Option here')
    await user.type(optionInputs[0], '3')
    await user.type(optionInputs[1], '4')
    await user.type(optionInputs[2], '5')
    await user.type(optionInputs[3], '6')
    await user.click(screen.getByRole('radio', { name: 'Option 2 is correct' }))

    const saveButton = screen.getByRole('button', { name: 'Save & Continue' })
    expect(saveButton).toBeEnabled()

    await user.click(saveButton)

    expect(mutate).toHaveBeenCalledTimes(1)
    const [input] = mutate.mock.calls[0]
    expect(input.testId).toBe('test-1')
    expect(input.totalQuestionCount).toBe(1)
    expect(input.correctMarksPerQuestion).toBe(4)
    expect(input.draftQuestions).toHaveLength(1)
    expect(input.draftQuestions[0].correctOption).toBe('option2')
  })

  it('shows already-saved questions as read-only with no delete action', () => {
    const savedRecord = {
      ...createBlankQuestionRecord(),
      clientId: 'question-1',
      status: 'saved' as const,
      persistedId: 'question-1',
      question: 'Existing question',
      option1: 'a',
      option2: 'b',
      option3: 'c',
      option4: 'd',
      correctOption: 'option1' as const,
    }

    renderEditor([savedRecord])

    expect(screen.getByText('Saved')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete Question 1' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('Question')).toBeDisabled()
  })
})
