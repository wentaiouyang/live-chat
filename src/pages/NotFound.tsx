import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Aurora from '@/components/ui/aurora'

export function NotFound() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background px-6 py-12 text-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <Aurora colorStops={['#5227FF', '#7cff67', '#00D4FF']} amplitude={1.0} blend={0.6} />
      </div>
      <div className="mx-auto max-w-2xl z-10 relative">
        <p className="text-8xl font-extrabold tracking-tight text-foreground/20 sm:text-9xl select-none">
          404
        </p>
        <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
          页面未找到
        </h1>
        <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-lg mx-auto">
          抱歉，我们找不到您要访问的页面。它可能已被移动或删除。
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto min-w-[140px]" asChild>
            <Link to="/">返回首页</Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[140px]" asChild>
            <Link to="/login">登录</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
