import { AppRoutes } from '@/routes/AppRoutes'
import { Toaster } from '@/components/ui/toaster'
import { Provider } from 'react-redux'
import { store } from '@/store/store'

function App() {
  return (
    <div className="min-h-svh bg-background">
      <Provider store={store}>
        <AppRoutes />
        <Toaster />
      </Provider>
    </div>
  )
}

export default App
