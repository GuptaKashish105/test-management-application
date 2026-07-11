export const paths = {
  login: '/login',
  dashboard: '/dashboard',
  testCreate: '/tests/new',
  testEdit: (testId: string) => `/tests/${testId}/edit`,
  addQuestions: (testId: string) => `/tests/${testId}/questions`,
  previewPublish: (testId: string) => `/tests/${testId}/preview`,
} as const
