interface AppEnv {
  apiBaseUrl: string
  /**
   * Local-dev-only switch: when true, apiRequest() serves mock data instead
   * of calling the real backend. See src/services/demoMode. Never enabled by
   * default — off unless VITE_DEMO_MODE=true is explicitly set.
   */
  isDemoMode: boolean
}

function readRequired(key: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable "${key}". Copy .env.example to .env and set it.`,
    )
  }
  return value
}

export const env: AppEnv = {
  apiBaseUrl: readRequired('VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL),
  isDemoMode: import.meta.env.VITE_DEMO_MODE === 'true',
}
