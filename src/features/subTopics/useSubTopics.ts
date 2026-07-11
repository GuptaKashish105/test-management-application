import type { SubTopic } from '@services/subTopics'
import { subTopicsApi } from '@services/subTopics'
import { useQuery } from '@tanstack/react-query'
import type { ApiError } from '@typings/api'

export const subTopicsQueryKey = (topicIds: string[]) =>
  ['subTopics', [...topicIds].sort()] as const

/** Disabled until at least one topic is selected. */
export function useSubTopics(topicIds: string[]) {
  return useQuery<SubTopic[], ApiError>({
    queryKey: subTopicsQueryKey(topicIds),
    queryFn: () => subTopicsApi.getByTopics(topicIds),
    enabled: topicIds.length > 0,
    staleTime: 5 * 60_000,
  })
}
