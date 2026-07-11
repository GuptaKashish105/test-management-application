import type { CreateTestPayload } from '@services/tests'
import { testsApi } from '@services/tests'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { testsQueryKey } from './useTests'

export function useCreateTest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTestPayload) => testsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testsQueryKey })
    },
  })
}
