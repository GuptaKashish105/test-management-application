import { paths } from '@app/router/paths'
import { PageContainer } from '@components/layout'
import { Alert, LoadingState } from '@components/ui'
import type { TestMetadataFormValues } from '@features/tests'
import { TestMetadataForm, useEditTestFormData, useUpdateTest } from '@features/tests'
import type { UpdateTestPayload } from '@services/tests'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

export function EditTestPage() {
  const { testId = '' } = useParams<{ testId: string }>()
  const navigate = useNavigate()

  const { isLoading, isError, errorMessage, defaultValues, warnings } = useEditTestFormData(testId)
  const updateTest = useUpdateTest(testId)

  if (!testId) {
    return <Navigate to={paths.dashboard} replace />
  }

  const handleSubmit = (values: TestMetadataFormValues) => {
    const payload: UpdateTestPayload = {
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
    }

    updateTest.mutate(payload, {
      onSuccess: () => navigate(paths.dashboard),
    })
  }

  return (
    <PageContainer>
      <h1 className="text-xl font-semibold text-neutral-900">Edit Test creation</h1>

      <div className="mt-6 max-w-4xl">
        {isLoading && <LoadingState message="Loading test…" />}

        {isError && <Alert tone="danger">{errorMessage ?? 'Failed to load this test.'}</Alert>}

        {!isLoading && !isError && defaultValues && (
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            {warnings.length > 0 && (
              <Alert tone="warning" className="mb-6">
                <ul className="list-disc pl-4">
                  {warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </Alert>
            )}
            <TestMetadataForm
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              onCancel={() => navigate(paths.dashboard)}
              isSubmitting={updateTest.isPending}
              submitLabel="Save"
              submitError={updateTest.error?.message}
            />
          </div>
        )}
      </div>
    </PageContainer>
  )
}
