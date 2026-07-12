import { Alert, LoadingState, Modal } from '@components/ui'
import type { UpdateTestPayload } from '@services/tests'

import { TestMetadataForm } from './TestMetadataForm'
import type { TestMetadataFormValues } from './testMetadataSchema'
import { useEditTestFormData } from './useEditTestFormData'
import { useUpdateTest } from './useUpdateTest'

export interface EditTestModalProps {
  /** `null` keeps the modal closed and skips fetching entirely. */
  testId: string | null
  onClose: () => void
}

/**
 * Figma renders Edit Test as a modal, not a routed page — this is mounted
 * once per page that offers an Edit affordance (Dashboard, Add Questions,
 * Preview & Publish) with `testId` toggled via local state.
 */
export function EditTestModal({ testId, onClose }: EditTestModalProps) {
  const { isLoading, isError, errorMessage, defaultValues, warnings } = useEditTestFormData(
    testId ?? '',
  )
  const updateTest = useUpdateTest(testId ?? '')

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

    updateTest.mutate(payload, { onSuccess: onClose })
  }

  return (
    <Modal
      isOpen={testId !== null}
      onClose={onClose}
      title="Edit Test creation"
      className="max-w-4xl"
    >
      {isLoading && <LoadingState message="Loading test…" />}

      {isError && <Alert tone="danger">{errorMessage ?? 'Failed to load this test.'}</Alert>}

      {!isLoading && !isError && defaultValues && (
        <>
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
            onCancel={onClose}
            isSubmitting={updateTest.isPending}
            submitLabel="Save"
            submitError={updateTest.error?.message}
          />
        </>
      )}
    </Modal>
  )
}
