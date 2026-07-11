import type { Topic } from '@services/topics'
import { topicsApi } from '@services/topics'
import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@typings/api'

export const topicsQueryKey = (subjectId: string | null) => ['topics', subjectId] as const

/** Disabled until a subject is chosen — clearing the subject naturally clears these results too. */
export function useTopics(subjectId: string | null) {
  return useQuery<Topic[], ApiError>({
    queryKey: topicsQueryKey(subjectId),
    queryFn: () => topicsApi.getBySubject(subjectId as string),
    enabled: subjectId !== null,
    staleTime: 5 * 60_000,
  })
}
