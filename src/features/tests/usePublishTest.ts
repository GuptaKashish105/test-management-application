import { testsApi } from '@services/tests'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { testQueryKey } from './useTest'
import { testsQueryKey } from './useTests'

export function usePublishTest(testId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => testsApi.publish(testId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testsQueryKey })
      queryClient.invalidateQueries({ queryKey: testQueryKey(testId) })
    },
  })
}
