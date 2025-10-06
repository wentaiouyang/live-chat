import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Aurora from '@/components/ui/aurora'

export function NotFound() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background px-6 py-12 text-center">
      <div className="pointer-events-none absolute inset-0">
        <Aurora colorStops={['#5227FF', '#7cff67', '#00D4FF']} amplitude={1.0} blend={0.6} />
      </div>
      <div className="mx-auto max-w-2xl z-100">
        <p className="text-6xl font-extrabold tracking-tight text-muted-foreground sm:text-7xl">
          404
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Page not found</h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          Sorry, we couldn’t find the page you’re looking for.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Button asChild>
            <Link to="/">Go back home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
