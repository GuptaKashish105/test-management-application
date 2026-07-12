export const paths = {
  login: '/login',
  dashboard: '/dashboard',
  testCreate: '/tests/new',
  addQuestions: (testId: string) => `/tests/${testId}/questions`,
  previewPublish: (testId: string) => `/tests/${testId}/preview`,
} as const
