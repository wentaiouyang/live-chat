import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import Aurora from '@/components/ui/aurora'
import { getUserById } from '@/store/userSlices'
import { getFriendsList, getFriendRequests } from '@/store/friendSlices'
import type { AppDispatch, RootState } from '@/store/store'
import { UserSearchDialog } from '@/components/UserSearchDialog'
import { FriendRequestsList } from '@/components/FriendRequestsList'
import { socketService } from '@/utils/socket'
import {
  createChat,
  getMessages,
  setCurrentChat,
  sendMessage,
  addMessage,
  getChats,
  receiveNewChat,
} from '@/store/chatSlices'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useNavigate } from 'react-router-dom'
import type { Message, User as ApiUser, Chat } from '@/types/api'
import { Helpers } from '@/utils'
import { User, LogOut, Search, Plus, MoreVertical, Send, Hash, UserPlus } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export function ChatPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [userInitial, setUserInitial] = useState('U')
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [inputText, setInputText] = useState('')
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false)
  const [isUserSearchOpen, setIsUserSearchOpen] = useState(false)
  const [newChannelName, setNewChannelName] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Get friends list and chats from Redux
  const { friends } = useSelector((state: RootState) => state.friends)
  const { chats, currentChat, messages } = useSelector((state: RootState) => state.chats)
  const { toast } = useToast()

  // Get user name initial from JWT token and fetch user info
  useEffect(() => {
    const fetchUserInitial = async () => {
      const token = Helpers.getToken()
      if (!token) return

      try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
        const json = JSON.parse(atob(base64))
        const id = json.id || ''
        setCurrentUserId(id) // Store current user ID
        if (id) {
          const userInfo = await dispatch(getUserById(id))
          if (getUserById.fulfilled.match(userInfo)) {
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
    // Load friends list
    dispatch(getFriendsList())
    // Load chats list
    dispatch(getChats())

    // Connect to Socket.io
    const token = Helpers.getToken()
    if (token) {
      socketService.connect(token)
      console.log('🔌 Socket 连接已初始化')
    }
  }, [dispatch])

  // Auto scroll to bottom when messages update
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Load messages when current chat changes
  useEffect(() => {
    if (currentChat) {
      console.log('💬 加载聊天消息:', currentChat._id)
      dispatch(getMessages({ chatId: currentChat._id }))
    }
  }, [currentChat, dispatch])

  // Listen for friend requests via Socket.io
  useEffect(() => {
    const handleFriendRequest = (request: { from: { name?: string; username: string } }) => {
      console.log('👥 收到好友请求:', request)
      toast({
        title: '新的好友请求',
        description: `${request.from?.name || request.from?.username} 想添加你为好友`,
      })
      // Refresh friend requests list
      dispatch(getFriendRequests())
    }

    socketService.onFriendRequest(handleFriendRequest)

    return () => {
      socketService.offFriendRequest(handleFriendRequest)
    }
  }, [dispatch, toast])

  // Listen for new messages via Socket.io
  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      console.log('📨 收到新消息:', message)
      dispatch(addMessage(message))
    }

    socketService.onNewMessage(handleNewMessage)

    return () => {
      socketService.offNewMessage(handleNewMessage)
    }
  }, [dispatch])

  // Listen for new chats via Socket.io
  useEffect(() => {
    const handleNewChat = (chat: Chat) => {
      console.log('💬 收到新聊天通知:', chat)
      dispatch(receiveNewChat(chat))
      // Join the new chat room to receive messages immediately
      socketService.joinChats([chat._id])
      toast({
        title: '新聊天',
        description: '您有了一个新的聊天',
      })
    }

    socketService.onNewChat(handleNewChat)

    return () => {
      socketService.offNewChat(handleNewChat)
    }
  }, [dispatch, toast])

  // Join chat rooms when chats are loaded
  useEffect(() => {
    if (chats.length > 0) {
      const chatIds = chats.map((chat) => chat._id)
      console.log('🚪 加入聊天室:', chatIds)
      socketService.joinChats(chatIds)
    }
  }, [chats])

  // 处理好友点击，创建或获取聊天
  const handleFriendClick = async (friendId: string, friendName: string) => {
    try {
      console.log('👥 点击好友:', friendName, friendId)

      // 检查是否已存在与该好友的聊天
      const existingChat = chats.find(
        (chat) => chat.type === 'direct' && chat.participants.some((p) => p._id === friendId)
      )

      if (existingChat) {
        console.log('💬 找到现有聊天:', existingChat._id)
        // 切换到该聊天视图
        dispatch(setCurrentChat(existingChat))
        toast({
          title: '已打开聊天',
          description: `与 ${friendName} 的聊天`,
        })
      } else {
        console.log('➕ 创建新聊天...')
        const result = await dispatch(createChat({ type: 'direct', participantId: friendId }))

        if (createChat.fulfilled.match(result)) {
          console.log('✅ 聊天创建成功:', result.payload)
          // 聊天创建后会自动设置为 currentChat (见 chatSlices.ts line 114)
          toast({
            title: '聊天已创建',
            description: `与 ${friendName} 的聊天`,
          })
        } else {
          toast({
            title: '创建失败',
            description: '无法创建聊天，请稍后重试',
            variant: 'destructive',
          })
        }
      }
    } catch (error) {
      console.error('❗ 处理好友点击失败:', error)
      toast({
        title: '错误',
        description: '无法打开聊天',
        variant: 'destructive',
      })
    }
  }

  const handleLogout = () => {
    Helpers.removeToken()
    navigate('/login')
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !currentChat) return

    const messageContent = inputText.trim()
    setInputText('') // Clear input immediately for better UX

    try {
      console.log('发送消息:', messageContent)

      // 1. Send via Redux (API)
      const result = await dispatch(
        sendMessage({
          chatId: currentChat._id,
          data: { content: messageContent, type: 'text' },
        })
      )

      // 2. Send via Socket.io commented out to prevent double usage
      // socketService.sendMessage({
      //   chatId: currentChat._id,
      //   content: messageContent,
      //   type: 'text',
      // })

      if (sendMessage.fulfilled.match(result)) {
        console.log('✅ 消息发送成功:', result.payload)
        // Message will be automatically added to the messages list via Redux
      } else {
        toast({
          title: '发送失败',
          description: '无法发送消息，请稍后重试',
          variant: 'destructive',
        })
        setInputText(messageContent) // Restore message on failure
      }
    } catch (error) {
      console.error('❗ 发送消息失败:', error)
      toast({
        title: '错误',
        description: '无法发送消息',
        variant: 'destructive',
      })
      setInputText(messageContent) // Restore message on error
    }
  }

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChannelName.trim()) return

    // TODO: Implement channel creation via API
    console.log('➕ 创建频道:', newChannelName)
    toast({
      title: '功能开发中',
      description: '频道创建功能即将上线',
    })

    setIsCreateChannelOpen(false)
    setNewChannelName('')
  }

  return (
    <div className="relative grid h-svh grid-cols-1 bg-background md:grid-cols-[320px_1fr] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <Aurora colorStops={['#5227FF', '#7cff67', '#00D4FF']} amplitude={1.0} blend={0.6} />
      </div>

      {/* Sidebar */}
      <aside className="hidden border-r bg-card/40 backdrop-blur-md p-4 md:flex md:flex-col h-full overflow-hidden z-10">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <h2 className="text-xl font-bold tracking-tight">消息</h2>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-accent/50"
            onClick={() => setIsCreateChannelOpen(true)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索对话..."
            className="w-full rounded-full border bg-background/50 pl-9 pr-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 transition-all"
          />
        </div>

        <div className="flex-1 flex flex-col min-h-0 -mx-2 overflow-hidden">
          {/* Top Section: Friend Requests & Friends List (Scrollable, Max 45% height) */}
          <div className="flex-shrink-0 max-h-[45%] overflow-y-auto px-2 space-y-1 scrollbar-thin [mask-image:linear-gradient(to_bottom,black_80%,transparent)]">
            {/* Friend Requests Section */}
            <FriendRequestsList />

            {/* Friends Section */}
            {friends.length > 0 && (
              <div className="mb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2 sticky top-0 bg-card/95 backdrop-blur-sm z-10 py-1">
                  好友 ({friends.length})
                </h3>
                {friends.map((friend) => (
                  <button
                    key={friend._id}
                    onClick={() => handleFriendClick(friend._id, friend.name || friend.username)}
                    className="w-full cursor-pointer rounded-lg p-3 text-left text-sm transition-all flex items-center gap-3 hover:bg-accent/30"
                  >
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarFallback className="text-sm font-bold bg-muted text-muted-foreground">
                        {friend.name?.charAt(0).toUpperCase() ||
                          friend.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="font-medium truncate">{friend.name || friend.username}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        @{friend.username}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Section: Chats List (Scrollable, takes remaining space) */}
          <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-thin border-t border-border/40 pt-2 relative">
            {chats.length > 0 ? (
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2 sticky top-0 bg-background/50 backdrop-blur-md z-10 py-1">
                  聊天 ({chats.length})
                </h3>
                {chats.map((chat) => {
                  // Robustly find the other participant
                  let otherParticipant = chat.participants.find((p) => {
                    const pId = typeof p === 'string' ? p : p._id
                    return pId !== currentUserId
                  }) as ApiUser | string | undefined

                  // If we only have an ID (string) or unpopulated object, try to find user in friends list
                  if (typeof otherParticipant === 'string') {
                    const foundFriend = friends.find((f) => f._id === otherParticipant)
                    if (foundFriend) otherParticipant = foundFriend
                  } else if (
                    otherParticipant &&
                    typeof otherParticipant !== 'string' &&
                    !otherParticipant.name &&
                    !otherParticipant.username
                  ) {
                    // If object but missing name (incomplete), try to find in friends list
                    const participantId = otherParticipant._id
                    const foundFriend = friends.find((f) => f._id === participantId)
                    if (foundFriend) otherParticipant = foundFriend
                  }

                  const validParticipant =
                    typeof otherParticipant === 'object' ? otherParticipant : undefined
                  const displayName =
                    validParticipant?.name || validParticipant?.username || '未知用户'

                  return (
                    <button
                      key={chat._id}
                      onClick={() => {
                        console.log('💬 选择聊天:', chat._id)
                        dispatch(setCurrentChat(chat))
                      }}
                      className={cn(
                        'w-full cursor-pointer rounded-lg p-3 text-left text-sm transition-all flex items-center gap-3',
                        currentChat?._id === chat._id
                          ? 'bg-accent/60 shadow-sm'
                          : 'hover:bg-accent/30 transparent'
                      )}
                    >
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarFallback className="text-sm font-bold bg-muted text-muted-foreground">
                          {displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-medium truncate">{displayName}</div>
                        <div className="text-xs text-muted-foreground truncate mt-0.5">
                          {chat.type === 'direct' ? '私聊' : '群聊'}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs p-4 text-center opacity-60">
                <p>暂无活跃聊天</p>
                <p>点击好友开始对话</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border ring-2 ring-background">
            <AvatarFallback className="bg-secondary text-sm font-bold">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">当前用户</div>
            <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
              <span className="inline-block size-2 rounded-full bg-green-500"></span> 在线
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/userinfo')}>
                <User className="mr-2 size-4" />
                个人资料
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 size-4" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <main className="relative flex flex-col h-full overflow-hidden bg-background/30 backdrop-blur-sm z-10">
        <header className="flex items-center justify-between border-b bg-card/40 backdrop-blur-md px-6 py-3 h-16 shrink-0 shadow-sm">
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight flex items-center gap-2">
              <Hash className="h-5 w-5 text-primary" /> {currentChat ? '聊天' : '选择一个聊天'}
            </h1>
            <p className="text-xs text-muted-foreground mt-1 ml-7">{messages.length} 条消息</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => setIsUserSearchOpen(true)}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              添加好友
            </Button>
            <div className="md:hidden">
              <Avatar className="size-8">
                <AvatarFallback className="bg-secondary text-xs">{userInitial}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <section
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto p-6 scroll-smooth flex flex-col"
        >
          {currentChat ? (
            messages.length > 0 ? (
              <div className="mt-auto space-y-6 w-full">
                {messages.map((msg) => {
                  const isMe = msg.sender._id === currentUserId
                  return (
                    <div
                      key={msg._id}
                      className={cn(
                        'flex items-start gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-300',
                        isMe ? 'flex-row-reverse' : ''
                      )}
                    >
                      <Avatar className="size-10 border border-border mt-0.5 shadow-sm">
                        <AvatarFallback
                          className={cn(
                            'text-sm font-bold',
                            isMe
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground'
                          )}
                        >
                          {(msg.sender.name || msg.sender.username).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn('flex-1 space-y-1', isMe ? 'text-right' : 'text-left')}>
                        <div
                          className={cn(
                            'flex items-center gap-2',
                            isMe ? 'justify-end' : 'justify-start'
                          )}
                        >
                          {!isMe && (
                            <span className="font-semibold text-sm">
                              {msg.sender.name || msg.sender.username}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {isMe && (
                            <span className="font-semibold text-sm">
                              {msg.sender.name || msg.sender.username}
                            </span>
                          )}
                        </div>
                        <div
                          className={cn(
                            'text-sm leading-relaxed p-3 rounded-2xl shadow-sm inline-block max-w-[85%] break-words text-left',
                            isMe
                              ? 'bg-primary text-primary-foreground rounded-tr-none'
                              : 'bg-card text-card-foreground rounded-tl-none border border-border/50'
                          )}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center m-auto h-full text-muted-foreground">
                <p>暂无消息，开始聊天吧！</p>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center m-auto h-full text-muted-foreground">
              <p>选择一个好友或聊天开始对话</p>
            </div>
          )}
        </section>

        <footer className="border-t bg-card/60 backdrop-blur-md p-4 shrink-0">
          <form className="flex items-center gap-3 max-w-4xl mx-auto" onSubmit={handleSendMessage}>
            <div className="relative flex-1 group">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={currentChat ? '发送消息...' : '选择一个聊天开始对话'}
                disabled={!currentChat}
                className="w-full rounded-full border border-input bg-background/50 pl-5 pr-12 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 shadow-sm transition-all group-hover:bg-background/80 focus:bg-background disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!inputText.trim() || !currentChat}
                className="absolute right-1.5 top-1.5 h-8 w-8 rounded-full transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">发送</span>
              </Button>
            </div>
          </form>
        </footer>
      </main>

      {/* Create Channel Dialog */}
      <Dialog open={isCreateChannelOpen} onOpenChange={setIsCreateChannelOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>创建新频道</DialogTitle>
            <DialogDescription>输入频道名称以创建一个新的聊天组。</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateChannel}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  名称
                </Label>
                <Input
                  id="name"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="col-span-3"
                  placeholder="例如：项目讨论"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateChannelOpen(false)}>
                取消
              </Button>
              <Button type="submit" disabled={!newChannelName.trim()}>
                创建频道
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* User Search Dialog */}
      <UserSearchDialog open={isUserSearchOpen} onOpenChange={setIsUserSearchOpen} />
    </div>
  )
}

export default ChatPage
