import type { LoginRequestBody } from '@services/auth'
import { authApi } from '@services/auth'
import { useMutation } from '@tanstack/react-query'

import { useAuth } from './useAuth'

export function useLogin() {
  const { login } = useAuth()

  return useMutation({
    mutationFn: (credentials: LoginRequestBody) => authApi.login(credentials),
    onSuccess: (session) => {
      login(session.token)
    },
  })
}
