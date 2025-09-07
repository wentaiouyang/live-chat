import { Button } from '@/components/ui/button'

export function HomePage() {
  return (
    <div className="grid min-h-svh grid-cols-1 bg-background md:grid-cols-[320px_1fr]">
      <aside className="hidden border-r bg-card p-4 md:block">
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

      <main className="flex flex-col">
        <header className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h1 className="text-lg font-semibold leading-none tracking-tight">General</h1>
            <p className="text-sm text-muted-foreground">3 participants, 12 unread</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Invite
            </Button>
            <Button size="sm">New Message</Button>
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

export default HomePage
