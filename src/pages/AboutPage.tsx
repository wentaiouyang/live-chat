import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Aurora from '@/components/ui/aurora'

export function AboutPage() {
  return (
    <div className="relative flex min-h-svh items-center justify-center bg-black text-white px-6 py-12">
      {/* Aurora background layer */}
      <div className="pointer-events-none absolute inset-0">
        <Aurora colorStops={['#5227FF', '#7cff67', '#5227FF']} amplitude={1.0} blend={0.6} />
      </div>
      <div className="relative mx-auto w-full max-w-3xl text-center">
        <h1 className="my-4 text-4xl font-bold tracking-tight sm:text-5xl">Aurora</h1>
        <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white/70">
          Live Chat
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Real‑time chat for modern teams
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-white/70">
          Collaborate instantly with channels and direct messages. Designed with a clean, minimal UI
          powered by shadcn, optimized for performance and clarity.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link to="/login">Get started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link className="text-white" to="/signup">
              Create account
            </Link>
          </Button>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 text-left md:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold">Real-time</div>
            <p className="mt-1 text-sm text-white/70">Instant updates powered by websockets.</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold">Channels</div>
            <p className="mt-1 text-sm text-white/70">
              Organize conversations by topics and teams.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold">Fast UI</div>
            <p className="mt-1 text-sm text-white/70">
              Clean shadcn components with keyboard-friendly UX.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
