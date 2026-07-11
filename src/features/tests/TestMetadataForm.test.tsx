import { useSubjects } from '@features/subjects'
import { useSubTopics } from '@features/subTopics'
import { useTopics } from '@features/topics'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TestMetadataForm } from './TestMetadataForm'
import type { TestMetadataFormInput } from './testMetadataSchema'

vi.mock('@features/subjects', () => ({ useSubjects: vi.fn() }))
vi.mock('@features/topics', () => ({ useTopics: vi.fn() }))
vi.mock('@features/subTopics', () => ({ useSubTopics: vi.fn() }))

const mockedUseSubjects = vi.mocked(useSubjects)
const mockedUseTopics = vi.mocked(useTopics)
const mockedUseSubTopics = vi.mocked(useSubTopics)

function asQueryResult<T extends (...args: never[]) => unknown>(overrides: object) {
  return overrides as unknown as ReturnType<T>
}

const DEFAULT_VALUES: TestMetadataFormInput = {
  name: '',
  type: 'chapterwise',
  subject: '',
  topics: [],
  subTopics: [],
  difficulty: '',
  correctMarks: 5,
  wrongMarks: -1,
  unattemptMarks: 0,
  totalTime: '',
  totalMarks: '',
  totalQuestions: '',
}

function renderForm(defaultValues: TestMetadataFormInput = DEFAULT_VALUES) {
  const onSubmit = vi.fn()
  const onCancel = vi.fn()
  render(
    <TestMetadataForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={false}
      submitLabel="Next: Add Questions"
    />,
  )
  return { onSubmit, onCancel }
}

describe('TestMetadataForm', () => {
  beforeEach(() => {
    mockedUseSubjects.mockReturnValue(
      asQueryResult<typeof useSubjects>({
        data: [
          { id: 'subject-1', name: 'Mathematics' },
          { id: 'subject-2', name: 'Physics' },
        ],
        isLoading: false,
        isError: false,
      }),
    )
    mockedUseTopics.mockReturnValue(
      asQueryResult<typeof useTopics>({
        data: [{ id: 'topic-1', name: 'Algebra', subject_id: 'subject-1' }],
        isLoading: false,
        isError: false,
      }),
    )
    mockedUseSubTopics.mockReturnValue(
      asQueryResult<typeof useSubTopics>({
        data: [{ id: 'subtopic-1', name: 'Linear Equations', topic_id: 'topic-1' }],
        isLoading: false,
        isError: false,
      }),
    )
  })

  it('shows validation errors when submitted empty and never calls onSubmit', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.click(screen.getByRole('button', { name: 'Next: Add Questions' }))

    expect(await screen.findByText('Test name is required')).toBeInTheDocument()
    expect(screen.getByText('Subject is required')).toBeInTheDocument()
    expect(screen.getByText('Select at least one topic')).toBeInTheDocument()
    expect(screen.getByText('Difficulty is required')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('clears previously selected topics/sub-topics when the subject changes', async () => {
    const user = userEvent.setup()
    renderForm({
      ...DEFAULT_VALUES,
      subject: 'subject-1',
      topics: ['topic-1'],
      subTopics: ['subtopic-1'],
    })

    expect(screen.getByText('Algebra')).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Subject'), 'subject-2')

    expect(screen.queryByText('Algebra')).not.toBeInTheDocument()
  })

  it('submits validated, coerced values on a complete form', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.type(screen.getByLabelText('Name of Test'), 'My Test')
    await user.selectOptions(screen.getByLabelText('Subject'), 'subject-1')

    await user.click(screen.getByRole('button', { name: 'Topic' }))
    await user.click(screen.getByRole('checkbox', { name: 'Algebra' }))

    await user.click(screen.getByRole('radio', { name: 'Medium' }))

    await user.type(screen.getByLabelText('Duration (Minutes)'), '60')
    await user.type(screen.getByLabelText('No of Questions'), '50')
    await user.type(screen.getByLabelText('Total Marks'), '250')

    await user.click(screen.getByRole('button', { name: 'Next: Add Questions' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        name: 'My Test',
        type: 'chapterwise',
        subject: 'subject-1',
        topics: ['topic-1'],
        difficulty: 'medium',
        correctMarks: 5,
        wrongMarks: -1,
        unattemptMarks: 0,
        totalTime: 60,
        totalMarks: 250,
        totalQuestions: 50,
      }),
    )
  })

  it('calls onCancel when Cancel is clicked', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const onCancel = vi.fn()
    render(
      <TestMetadataForm
        defaultValues={DEFAULT_VALUES}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={false}
        submitLabel="Next: Add Questions"
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalled()
  })
})
