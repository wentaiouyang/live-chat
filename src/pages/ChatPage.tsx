import { useDispatch } from 'react-redux'
import { Button } from '@/components/ui/button'
import Aurora from '@/components/ui/aurora'
import { getUserInfo } from '@/store/authSlices'
import type { AppDispatch } from '@/store/store'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'
import { Helpers } from '@/utils'
import { User, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'

export function ChatPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [userInitial, setUserInitial] = useState('U')

  // Get user name initial from JWT token and fetch user info
  useEffect(() => {
    const fetchUserInitial = async () => {
      const token = Helpers.getToken()
      if (!token) return

      try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
        const json = JSON.parse(atob(base64))
        const id = json.id || ''
        if (id) {
          const userInfo = await dispatch(getUserInfo(id))
          if (getUserInfo.fulfilled.match(userInfo)) {
            const name = userInfo.payload.name || ''
            if (name) {
              setUserInitial(name.charAt(0).toUpperCase())
            }
          }
        }
      } catch {
        // If token parsing fails, keep default 'U'
      }
    }

    fetchUserInitial()
  }, [dispatch])

  const handleLogout = () => {
    Helpers.removeToken()
    navigate('/login')
  }

  return (
    <div className="relative grid min-h-svh grid-cols-1 bg-background md:grid-cols-[320px_1fr]">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <Aurora colorStops={['#5227FF', '#7cff67', '#00D4FF']} amplitude={1.0} blend={0.6} />
      </div>
      <aside className="hidden border-r bg-card/60 backdrop-blur p-4 md:block">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Chats</h2>
          <Button size="sm" variant="outline">
            New
          </Button>
        </div>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search conversations"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </div>
        <div className="mt-4 space-y-2">
          <button className="w-full cursor-pointer rounded-md p-3 text-left text-sm hover:bg-accent">
            General
          </button>
          <button className="w-full cursor-pointer rounded-md p-3 text-left text-sm hover:bg-accent">
            Product Support
          </button>
          <button className="w-full cursor-pointer rounded-md p-3 text-left text-sm hover:bg-accent">
            Random
          </button>
        </div>
      </aside>

      <main className="relative flex flex-col">
        <header className="flex items-center justify-between border-b bg-background/60 backdrop-blur px-4 py-3">
          <div>
            <h1 className="text-lg font-semibold leading-none tracking-tight">General</h1>
            <p className="text-sm text-muted-foreground">3 participants, 12 unread</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Invite
            </Button>
            <Button size="sm">New Message</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative flex size-9 items-center justify-center rounded-full bg-secondary outline-none ring-offset-2 ring-offset-background transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-secondary text-sm font-medium">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => navigate('/userinfo')}>
                  <User className="mr-2 size-4" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} variant="destructive">
                  <LogOut className="mr-2 size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <section className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-xs font-medium">
              A
            </div>
            <div>
              <div className="text-sm font-medium">Alice</div>
              <div className="mt-1 max-w-prose rounded-md bg-accent/50 p-3 text-sm">
                Hey team, welcome to the new chat!
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-xs font-medium">
              Y
            </div>
            <div>
              <div className="text-sm font-medium">You</div>
              <div className="mt-1 max-w-prose rounded-md bg-primary/10 p-3 text-sm">
                Looks great — let’s start building.
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t px-4 py-3">
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <input
              type="text"
              placeholder="Type a message"
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
            <Button type="submit">Send</Button>
          </form>
        </footer>
      </main>
    </div>
  )
}

export default ChatPage
