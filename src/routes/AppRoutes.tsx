import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ChatPage } from '@/pages/ChatPage'
import { AboutPage } from '@/pages/AboutPage'
import { LoginPage } from '@/pages/LoginPage'
import { SignUp } from '@/pages/SignUp'
import { ToastTestPage } from '@/pages/ToastTestPage'
import { UserInfoPage } from '@/pages/UserInfoPage'
import { NotFound } from '@/pages/NotFound'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/userinfo" element={<UserInfoPage />} />
        <Route path="/toast-test" element={<ToastTestPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
