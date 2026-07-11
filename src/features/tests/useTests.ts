import type { Test } from '@services/tests'
import { testsApi } from '@services/tests'
import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@typings/api'

export const testsQueryKey = ['tests'] as const

export function useTests() {
  return useQuery<Test[], ApiError>({
    queryKey: testsQueryKey,
    queryFn: testsApi.getAll,
  })
}
