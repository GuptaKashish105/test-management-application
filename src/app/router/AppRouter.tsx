import { AppShell } from '@components/layout'
import { RoutePlaceholder } from '@components/ui'
import { AddQuestionsPage } from '@pages/add-questions'
import { DashboardPage } from '@pages/dashboard'
import { LoginPage } from '@pages/login'
import { PreviewPublishPage } from '@pages/preview-publish'
import { CreateTestPage, EditTestPage } from '@pages/test-creation'
import { Navigate, Route, Routes } from 'react-router-dom'

import { paths } from './paths'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicOnlyRoute } from './PublicOnlyRoute'

/** Every documented page (Login, Dashboard, Create/Edit Test, Add Questions, Preview & Publish) is implemented. */
export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={paths.dashboard} replace />} />

      <Route
        path={paths.login}
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path={paths.dashboard}
        element={
          <ProtectedRoute>
            <AppShell>
              <DashboardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path={paths.testCreate}
        element={
          <ProtectedRoute>
            <AppShell>
              <CreateTestPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path={paths.testEdit(':testId')}
        element={
          <ProtectedRoute>
            <AppShell>
              <EditTestPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path={paths.addQuestions(':testId')}
        element={
          <ProtectedRoute>
            <AppShell>
              <AddQuestionsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path={paths.previewPublish(':testId')}
        element={
          <ProtectedRoute>
            <AppShell>
              <PreviewPublishPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<RoutePlaceholder title="Not Found" />} />
    </Routes>
  )
}
