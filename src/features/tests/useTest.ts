import type { TestDetail } from '@services/tests'
import { testsApi } from '@services/tests'
import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@typings/api'

export const testQueryKey = (testId: string) => ['tests', testId] as const

export function useTest(testId: string) {
  return useQuery<TestDetail, ApiError>({
    queryKey: testQueryKey(testId),
    queryFn: () => testsApi.getById(testId),
    enabled: testId !== '',
  })
}
