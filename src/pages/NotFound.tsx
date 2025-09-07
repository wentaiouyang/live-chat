import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-6 py-12 text-center">
      <div className="mx-auto max-w-2xl">
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
