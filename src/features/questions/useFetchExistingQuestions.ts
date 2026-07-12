import type { Question } from '@services/questions'
import { questionsApi } from '@services/questions'
import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@typings/api'

const existingQuestionsQueryKey = (questionIds: string[]) =>
  ['questions', 'fetchBulk', [...questionIds].sort()] as const

/** Rehydrates already-persisted questions when re-entering this step for a test that has some. */
export function useFetchExistingQuestions(questionIds: string[]) {
  return useQuery<Question[], ApiError>({
    queryKey: existingQuestionsQueryKey(questionIds),
    queryFn: () => questionsApi.fetchBulk(questionIds),
    enabled: questionIds.length > 0,
  })
}
