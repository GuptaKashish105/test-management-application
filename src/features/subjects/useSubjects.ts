import type { Subject } from '@services/subjects'
import { subjectsApi } from '@services/subjects'
import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@typings/api'

export const subjectsQueryKey = ['subjects'] as const

export function useSubjects() {
  return useQuery<Subject[], ApiError>({
    queryKey: subjectsQueryKey,
    queryFn: subjectsApi.getAll,
    staleTime: 5 * 60_000,
  })
}
