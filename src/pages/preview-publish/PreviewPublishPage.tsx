import { paths } from '@app/router/paths'
import { WizardLayout } from '@components/layout'
import { Alert, Badge, Button, LinkButton, LoadingState, Modal } from '@components/ui'
import { useFetchExistingQuestions } from '@features/questions'
import { EditTestModal, TestSummaryHeader, usePublishTest, useTest } from '@features/tests'
import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import { PublishPanel } from './PublishPanel'
import { QuestionsReview } from './QuestionsReview'
import { QuestionsSidebar } from './QuestionsSidebar'

export function PreviewPublishPage() {
  const { testId = '' } = useParams<{ testId: string }>()
  const navigate = useNavigate()

  const testQuery = useTest(testId)
  const questionIds = testQuery.data?.questionIds ?? []
  const questionsQuery = useFetchExistingQuestions(questionIds)
  const publishTest = usePublishTest(testId)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [isEditingTest, setIsEditingTest] = useState(false)

  if (!testId) {
    return <Navigate to={paths.dashboard} replace />
  }

  const needsQuestions = questionIds.length > 0
  const isLoading = testQuery.isLoading || (needsQuestions && questionsQuery.isLoading)
  const loadError = testQuery.error ?? (needsQuestions ? questionsQuery.error : null)

  if (isLoading) {
    return <LoadingState message="Loading test…" fullHeight />
  }

  if (loadError || !testQuery.data) {
    return (
      <div className="p-6">
        <Alert tone="danger">{loadError?.message ?? 'Failed to load this test.'}</Alert>
      </div>
    )
  }

  const test = testQuery.data
  const questions = needsQuestions ? (questionsQuery.data ?? []) : []
  const isAlreadyLive = test.status === 'live'
  const canPublish = questions.length > 0 && !isAlreadyLive

  const handleConfirmPublish = () => {
    publishTest.mutate(undefined, { onSuccess: () => setIsSuccessOpen(true) })
  }

  return (
    <WizardLayout
      sidebar={<QuestionsSidebar questions={questions} />}
      header={
        <div>
          <p className="text-sm text-neutral-500">Test creation</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className="text-base font-semibold text-neutral-900">Test created</p>
            <Badge tone="success">All {questions.length} Questions done</Badge>
          </div>
          <div className="mt-4 rounded-lg border border-neutral-200 p-4">
            <TestSummaryHeader test={test} onEdit={() => setIsEditingTest(true)} />
          </div>
          <div className="mt-3">
            <LinkButton to={paths.addQuestions(testId)} variant="secondary" size="sm">
              Edit Questions
            </LinkButton>
          </div>
        </div>
      }
      footer={
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-neutral-500">
            {!isAlreadyLive &&
              questions.length === 0 &&
              'Add at least 1 question before publishing.'}
            {publishTest.error && (
              <span className="text-danger-700">{publishTest.error.message}</span>
            )}
          </div>
          <div className="ml-auto flex gap-3">
            <Button type="button" variant="secondary" onClick={() => navigate(paths.dashboard)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmPublish}
              disabled={!canPublish}
              isLoading={publishTest.isPending}
            >
              Confirm
            </Button>
          </div>
        </div>
      }
    >
      <PublishPanel isAlreadyLive={isAlreadyLive} />

      <div className="mt-8">
        <h2 className="mb-4 text-sm font-semibold text-neutral-800">Questions</h2>
        <QuestionsReview questions={questions} />
      </div>

      <Modal
        isOpen={isSuccessOpen}
        onClose={() => navigate(paths.dashboard)}
        title="Test published"
      >
        <p className="text-sm text-neutral-700">
          <strong>{test.name}</strong> is now live.
        </p>
        <div className="mt-4 flex justify-end">
          <Button size="sm" onClick={() => navigate(paths.dashboard)}>
            Go to Dashboard
          </Button>
        </div>
      </Modal>

      <EditTestModal
        testId={isEditingTest ? testId : null}
        onClose={() => setIsEditingTest(false)}
      />
    </WizardLayout>
  )
}
