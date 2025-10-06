import { AppRoutes } from '@/routes/AppRoutes'
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <div className="min-h-svh bg-background">
      <AppRoutes />
      <Toaster />
    </div>
  )
}

export default App
