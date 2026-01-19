import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { AppDispatch } from '@/store/store'
import { Button } from '@/components/ui/button'
import Aurora from '@/components/ui/aurora'
import { login } from '@/store/authSlices'
import { useToast } from '@/hooks/use-toast'
import { Helpers } from '@/utils'

export function LoginPage() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch<AppDispatch>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('登录提交:', { email, password: '***' })

    try {
      console.log('开始调用 dispatch...')
      const result = await dispatch(login({ email, password }))
      console.log('dispatch 完成，结果:', result)

      if (login.fulfilled.match(result)) {
        Helpers.storeToken(result.payload.token)
        toast({
          title: '登录成功',
          description: '欢迎回来！',
        })
        navigate('/chat')
      } else {
        console.error('登录失败:', result)
        toast({
          title: '登录失败',
          description: result.error?.message || '请检查您的邮箱或密码',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('登录异常:', error)
      toast({
        title: '登录错误',
        description: '网络连接失败，请稍后重试',
        variant: 'destructive',
      })
    }
  }
  return (
    <div className="relative flex min-h-svh items-center justify-center bg-background px-6 py-12 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <Aurora colorStops={['#5227FF', '#7cff67', '#00D4FF']} amplitude={1.0} blend={0.6} />
      </div>
      <div className="w-full max-w-md z-10 relative">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60">
            欢迎回来
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">登录以继续使用 Live Chat</p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-xl p-8 shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                电子邮箱
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:bg-background"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                密码
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:bg-background"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <input
                  type="checkbox"
                  className="size-4 rounded border-input bg-background/50 text-primary focus:ring-primary accent-primary"
                />
                记住我
              </label>
              <Link
                to="#"
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                忘记密码？
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-10 font-semibold shadow-md transition-all hover:scale-[1.02]"
            >
              登录
            </Button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          还没有账户？{' '}
          <Link
            to="/signup"
            className="font-medium text-primary underline-offset-4 hover:underline transition-colors"
          >
            立即注册
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
