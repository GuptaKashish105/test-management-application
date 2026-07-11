import { paths } from '@app/router/paths'
import { PageContainer } from '@components/layout'
import type { TestMetadataFormInput, TestMetadataFormValues } from '@features/tests'
import { TestMetadataForm, useCreateTest } from '@features/tests'
import type { CreateTestPayload } from '@services/tests'
import { useNavigate } from 'react-router-dom'

const DEFAULT_VALUES: TestMetadataFormInput = {
  name: '',
  type: 'chapterwise',
  subject: '',
  topics: [],
  subTopics: [],
  difficulty: '',
  // Figma's marking-scheme steppers show these as real starting values, not empty placeholders.
  correctMarks: 5,
  wrongMarks: -1,
  unattemptMarks: 0,
  totalTime: '',
  totalMarks: '',
  totalQuestions: '',
}

export function CreateTestPage() {
  const navigate = useNavigate()
  const createTest = useCreateTest()

  const handleSubmit = (values: TestMetadataFormValues) => {
    const payload: CreateTestPayload = {
      name: values.name,
      type: values.type,
      subject: values.subject,
      topics: values.topics,
      sub_topics: values.subTopics,
      correct_marks: values.correctMarks,
      wrong_marks: values.wrongMarks,
      unattempt_marks: values.unattemptMarks,
      difficulty: values.difficulty,
      total_time: values.totalTime,
      total_marks: values.totalMarks,
      total_questions: values.totalQuestions,
      status: null,
    }

    createTest.mutate(payload, {
      onSuccess: (data) => {
        navigate(paths.addQuestions(data.id))
      },
    })
  }

  return (
    <PageContainer>
      <h1 className="text-xl font-semibold text-neutral-900">Create Test</h1>
      <div className="mt-6 max-w-4xl rounded-lg border border-neutral-200 bg-white p-6">
        <TestMetadataForm
          defaultValues={DEFAULT_VALUES}
          onSubmit={handleSubmit}
          onCancel={() => navigate(paths.dashboard)}
          isSubmitting={createTest.isPending}
          submitLabel="Next: Add Questions"
          submitError={createTest.error?.message}
        />
      </div>
    </PageContainer>
  )
}
