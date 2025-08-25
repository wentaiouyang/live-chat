import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

function Home() {
  return <h2>Home Page</h2>
}

function About() {
  return <h2>About Page</h2>
}

function NotFound() {
  return <h2>404 Not Found</h2>
}

function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="flex min-h-svh flex-col items-center justify-center">
        <Button>Click me</Button>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          {/* 通配符：兜底 404 页面 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
