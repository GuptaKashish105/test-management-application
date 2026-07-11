import type { UpdateTestPayload } from '@services/tests'
import { testsApi } from '@services/tests'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { testQueryKey } from './useTest'
import { testsQueryKey } from './useTests'

export function useUpdateTest(testId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateTestPayload) => testsApi.update(testId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testsQueryKey })
      queryClient.invalidateQueries({ queryKey: testQueryKey(testId) })
    },
  })
}
