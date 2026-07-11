interface AppEnv {
  apiBaseUrl: string
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
}
