import { AppProviders } from '@app/providers'
import { AppRouter } from '@app/router'
import { DemoModeBanner } from '@components/layout'

function App() {
  return (
    <AppProviders>
      <AppRouter />
      <DemoModeBanner />
    </AppProviders>
  )
}

export default App
