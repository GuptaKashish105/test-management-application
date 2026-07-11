import { paths } from '@app/router/paths'
import { WizardLayout } from '@components/layout'
import { Alert, LinkButton, Spinner } from '@components/ui'
import { useFetchExistingQuestions } from '@features/questions'
import { TestSummaryHeader, useTest } from '@features/tests'
import { Navigate, useParams } from 'react-router-dom'

import { PublishPanel } from './PublishPanel'
import { QuestionsReview } from './QuestionsReview'

export function PreviewPublishPage() {
  const { testId = '' } = useParams<{ testId: string }>()

  const testQuery = useTest(testId)
  const questionIds = testQuery.data?.questionIds ?? []
  const questionsQuery = useFetchExistingQuestions(questionIds)

  if (!testId) {
    return <Navigate to={paths.dashboard} replace />
  }

  const needsQuestions = questionIds.length > 0
  const isLoading = testQuery.isLoading || (needsQuestions && questionsQuery.isLoading)
  const loadError = testQuery.error ?? (needsQuestions ? questionsQuery.error : null)

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center gap-2 p-16 text-neutral-500">
        <Spinner />
        <span>Loading test…</span>
      </div>
    )
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

  return (
    <WizardLayout
      header={
        <div className="flex flex-wrap items-center justify-between gap-4">
          <TestSummaryHeader test={test} />
          <div className="flex gap-3">
            <LinkButton to={paths.testEdit(testId)} variant="secondary" size="sm">
              Edit Test
            </LinkButton>
            <LinkButton to={paths.addQuestions(testId)} variant="secondary" size="sm">
              Edit Questions
            </LinkButton>
          </div>
        </div>
      }
      footer={
        <div className="w-full">
          <PublishPanel
            testId={testId}
            testName={test.name}
            isAlreadyLive={isAlreadyLive}
            canPublish={questions.length > 0}
            disabledReason={
              questions.length === 0 ? 'Add at least 1 question before publishing.' : undefined
            }
          />
        </div>
      }
    >
      <QuestionsReview questions={questions} />
    </WizardLayout>
  )
}
