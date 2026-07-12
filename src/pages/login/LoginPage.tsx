import { paths } from '@app/router/paths'
import { AuthLayout, DemoModeBanner, Logo } from '@components/layout'
import { Alert, Button, Input } from '@components/ui'
import type { LoginFormValues } from '@features/auth'
import { loginSchema, useLogin } from '@features/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ApiError } from '@typings/api'
import { useForm } from 'react-hook-form'
import type { Location } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'

interface LoginLocationState {
  from?: Location
}

function isLoginLocationState(state: unknown): state is LoginLocationState {
  return typeof state === 'object' && state !== null
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        const state = isLoginLocationState(location.state) ? location.state : undefined
        const redirectTo = state?.from
          ? `${state.from.pathname}${state.from.search}`
          : paths.dashboard
        navigate(redirectTo, { replace: true })
      },
    })
  })

  const serverError = loginMutation.error as ApiError | null

  return (
    <AuthLayout>
      <div className="mb-6">
        <Logo className="h-6" />
        <h1 className="mt-4 text-xl font-semibold text-neutral-900">Login</h1>
        <p className="mt-1 text-sm text-neutral-500">Use your company provided Login credentials</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {serverError && <Alert tone="danger">{serverError.message}</Alert>}

        <Input
          label="User ID"
          placeholder="Enter User ID"
          autoComplete="username"
          error={errors.userId?.message}
          {...register('userId')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter Password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        {/* Figma shows this link, but no password-reset endpoint is documented — kept visually
            accurate and inert rather than wired to invented behavior. aria-disabled (rather than
            the native disabled attribute) preserves the Figma styling while still telling
            assistive tech it isn't currently actionable. */}
        <button
          type="button"
          aria-disabled="true"
          title="Password reset isn't available yet"
          className="self-start text-sm text-brand-600 hover:underline"
        >
          Forgot password?
        </button>

        <Button type="submit" className="mt-2 w-full" isLoading={loginMutation.isPending}>
          Login
        </Button>
      </form>

      <DemoModeBanner />
    </AuthLayout>
  )
}
