import { AuthProvider } from '@features/auth'
import { authApi, authStorage } from '@services/auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LoginPage } from './LoginPage'

vi.mock('@services/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@services/auth')>()
  return {
    ...actual,
    authApi: { login: vi.fn() },
  }
})

const mockedLogin = vi.mocked(authApi.login)

function renderLoginPage() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: 0 } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<p>Dashboard sentinel</p>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    authStorage.clearToken()
    mockedLogin.mockReset()
  })

  it('shows validation errors when submitted empty and never calls the API', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(await screen.findByText('User ID is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
    expect(mockedLogin).not.toHaveBeenCalled()
  })

  it('logs in with valid credentials, persists the token, and redirects to the dashboard', async () => {
    mockedLogin.mockResolvedValueOnce({ token: 'jwt-token-here' })
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText('User ID'), 'vedant-admin')
    await user.type(screen.getByLabelText('Password'), 'vedant123')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith({ userId: 'vedant-admin', password: 'vedant123' })
    })
    expect(await screen.findByText('Dashboard sentinel')).toBeInTheDocument()
    expect(authStorage.getToken()).toBe('jwt-token-here')
  })

  it('shows the server error message on failed login without redirecting', async () => {
    mockedLogin.mockRejectedValueOnce({ message: 'Invalid credentials', status: 401 })
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText('User ID'), 'vedant-admin')
    await user.type(screen.getByLabelText('Password'), 'wrong-password')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials')
    expect(screen.queryByText('Dashboard sentinel')).not.toBeInTheDocument()
    expect(authStorage.getToken()).toBeNull()
  })
})
