import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Aurora from '@/components/ui/aurora'

export function SignUp() {
  return (
    <div className="relative flex min-h-svh items-center justify-center bg-background px-6 py-12">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <Aurora colorStops={['#5227FF', '#7cff67', '#00D4FF']} amplitude={1.0} blend={0.6} />
      </div>
      <div className="w-full max-w-md z-100">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Join Live Chat in seconds</p>
        </div>

        <div className="rounded-lg border bg-card/60 backdrop-blur p-6 shadow-sm">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                required
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
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
                required
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm" className="text-sm font-medium">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                placeholder="••••••••"
                required
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>

            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
