import { paths } from '@app/router/paths'
import { Alert, Spinner } from '@components/ui'
import { createBlankQuestionRecord, questionToRecord, useFetchExistingQuestions } from '@features/questions'
import { useResolvedTestTopics, useTest } from '@features/tests'
import { Navigate, useParams } from 'react-router-dom'

import { AddQuestionsEditor } from './AddQuestionsEditor'

/**
 * Loads the test + any already-persisted questions, then hands off to
 * AddQuestionsEditor (mounted only once data is ready) so its local question
 * list can be lazily initialized from that data without an effect+setState.
 */
export function AddQuestionsPage() {
  const { testId = '' } = useParams<{ testId: string }>()

  const testQuery = useTest(testId)
  const { topics, isLoading: isLoadingTopics } = useResolvedTestTopics(testQuery.data)
  const existingQuestionsQuery = useFetchExistingQuestions(testQuery.data?.questionIds ?? [])

  if (!testId) {
    return <Navigate to={paths.dashboard} replace />
  }

  const needsExistingQuestions = Boolean(testQuery.data && testQuery.data.questionIds.length > 0)
  const isLoading =
    testQuery.isLoading || (needsExistingQuestions && existingQuestionsQuery.isLoading)
  const loadError = testQuery.error ?? (needsExistingQuestions ? existingQuestionsQuery.error : null)

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center gap-2 p-16 text-neutral-500">
        <Spinner />
        <span>Loading questions…</span>
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

  const initialQuestions = needsExistingQuestions
    ? (existingQuestionsQuery.data ?? []).map(questionToRecord)
    : [createBlankQuestionRecord()]

  return (
    <AddQuestionsEditor
      testId={testId}
      test={testQuery.data}
      topics={topics}
      isLoadingTopics={isLoadingTopics}
      initialQuestions={initialQuestions}
    />
  )
}
