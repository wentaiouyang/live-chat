import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Aurora from '@/components/ui/aurora'
import config from '@/config'

export function AboutPage() {
  return (
    <div className="relative flex min-h-svh items-center justify-center bg-black text-white px-6 py-12 overflow-hidden">
      {/* Aurora background layer */}
      <div className="pointer-events-none absolute inset-0">
        <Aurora colorStops={['#5227FF', '#7cff67', '#5227FF']} amplitude={1.0} blend={0.6} />
      </div>
      <div className="relative mx-auto w-full max-w-4xl text-center z-10">
        <h1 className="my-6 text-5xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
          Aurora
        </h1>
        <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm transition-colors hover:bg-white/10">
          Live Chat {config.version}
        </span>
        <h2 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent pb-2">
          现代化团队的实时聊天工具
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70 leading-relaxed">
          通过频道和私信即时协作。基于 shadcn 构建的简洁 UI，专为性能和清晰度优化。
          让沟通回归本质，体验前所未有的流畅。
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto text-base font-semibold px-8 h-12" asChild>
            <Link to="/login">开始使用</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-base font-semibold px-8 h-12 border-white/20 hover:bg-white/10 hover:text-white"
            asChild
          >
            <Link className="text-white" to="/signup">
              创建账户
            </Link>
          </Button>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 text-left md:grid-cols-3">
          <div className="group rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-primary/5">
            <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-zap"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div className="text-lg font-semibold text-white">实时同步</div>
            <p className="mt-2 text-sm text-white/60 group-hover:text-white/80 transition-colors">
              基于 WebSocket 的即时消息更新，毫秒级延迟，沟通零距离。
            </p>
          </div>
          <div className="group rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-primary/5">
            <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-hash"
              >
                <line x1="4" x2="20" y1="9" y2="9" />
                <line x1="4" x2="20" y1="15" y2="15" />
                <line x1="10" x2="8" y1="3" y2="21" />
                <line x1="16" x2="14" y1="3" y2="21" />
              </svg>
            </div>
            <div className="text-lg font-semibold text-white">频道管理</div>
            <p className="mt-2 text-sm text-white/60 group-hover:text-white/80 transition-colors">
              按主题和团队组织对话，支持公开和私密频道，井井有条。
            </p>
          </div>
          <div className="group rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-primary/5">
            <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-layout"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <line x1="3" x2="21" y1="9" y2="9" />
                <line x1="9" x2="9" y1="21" y2="9" />
              </svg>
            </div>
            <div className="text-lg font-semibold text-white">流畅体验</div>
            <p className="mt-2 text-sm text-white/60 group-hover:text-white/80 transition-colors">
              简洁的 shadcn 组件与极致的键盘交互体验，让操作行云流水。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
