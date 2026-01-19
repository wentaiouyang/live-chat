import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import type { AppDispatch } from '@/store/store'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import Aurora from '@/components/ui/aurora'
import { signup } from '@/store/authSlices'

export function SignUp() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('注册提交:', { name, username, email, password: '***' })

    // 验证密码匹配
    if (password !== confirmPassword) {
      toast({
        title: '密码不匹配',
        description: '请确保两次输入的密码相同',
        variant: 'destructive',
      })
      return
    }

    try {
      console.log('开始调用 signup dispatch...')
      const result = await dispatch(signup({ name, username, email, password }))
      console.log('signup dispatch 完成，结果:', result)

      if (signup.fulfilled.match(result)) {
        toast({
          title: '注册成功',
          description: '欢迎加入 Live Chat！请登录',
        })
        navigate('/login')
      } else {
        console.error('注册失败:', result)
        toast({
          title: '注册失败',
          description: result.error?.message || '请检查您的信息',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('注册异常:', error)
      toast({
        title: '注册错误',
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
            创建账户
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">几秒钟内加入 Live Chat</p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-xl p-8 shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                姓名
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="您的姓名"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:bg-background"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                用户名
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="选择一个用户名"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:bg-background"
              />
            </div>

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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:bg-background"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirm"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                确认密码
              </label>
              <input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:bg-background"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-10 font-semibold shadow-md transition-all hover:scale-[1.02]"
            >
              创建账户
            </Button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          已有账户？{' '}
          <Link
            to="/login"
            className="font-medium text-primary underline-offset-4 hover:underline transition-colors"
          >
            立即登录
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
