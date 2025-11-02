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
    let result = await dispatch(login({ email, password }))
    if (login.fulfilled.match(result)) {
      Helpers.storeToken(result.payload.token)
      toast({
        title: 'Success Notification',
        description: 'Operation completed successfully!',
        variant: 'success',
      })
      navigate('/chat')
    } else {
      toast({
        title: 'Error',
        description: 'Failed to login',
        variant: 'destructive',
      })
    }
  }
  return (
    <div className="relative flex min-h-svh items-center justify-center bg-background px-6 py-12">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <Aurora colorStops={['#5227FF', '#7cff67', '#00D4FF']} amplitude={1.0} blend={0.6} />
      </div>
      <div className="w-full max-w-md z-100">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to Live Chat</p>
        </div>

        <div className="rounded-lg border bg-card/60 backdrop-blur p-6 shadow-sm">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(e)
            }}
          >
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" className="size-4 rounded border accent-primary" />
                Remember me
              </label>
              <Link to="#" className="text-sm text-primary underline-offset-4 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-primary underline-offset-4 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
