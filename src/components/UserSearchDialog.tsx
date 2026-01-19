import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/store/store'
import { searchUsers, getUserList } from '@/store/userSlices'
import { sendFriendRequest } from '@/store/friendSlices'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, UserPlus, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface UserSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserSearchDialog({ open, onOpenChange }: UserSearchDialogProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [sendingRequestTo, setSendingRequestTo] = useState<string | null>(null)

  const { users, loading } = useSelector((state: RootState) => state.user)

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await dispatch(searchUsers({ q: searchQuery }))
    } else {
      await dispatch(getUserList())
    }
  }

  const handleSendFriendRequest = async (userId: string, username: string) => {
    setSendingRequestTo(userId)
    try {
      const result = await dispatch(sendFriendRequest(userId))
      if (sendFriendRequest.fulfilled.match(result)) {
        toast({
          title: '好友请求已发送',
          description: `已向 ${username} 发送好友请求`,
        })
      } else {
        // 处理不同的错误情况
        // check result.payload first because we use rejectWithValue
        const errorMessage = (result.payload as string) || result.error?.message || ''

        if (errorMessage.includes('already sent') || errorMessage.includes('已发送')) {
          toast({
            title: '请求已存在',
            description: `您已经向 ${username} 发送过好友请求了`,
            variant: 'destructive',
          })
        } else if (
          errorMessage.includes('already friends') ||
          errorMessage.includes('已经是好友')
        ) {
          toast({
            title: '已经是好友',
            description: `您和 ${username} 已经是好友了`,
            variant: 'destructive',
          })
        } else {
          toast({
            title: '发送失败',
            description: errorMessage || '无法发送好友请求，请稍后重试',
            variant: 'destructive',
          })
        }
      }
    } catch {
      toast({
        title: '发送失败',
        description: '网络错误，请稍后重试',
        variant: 'destructive',
      })
    } finally {
      setSendingRequestTo(null)
    }
  }

  // 当对话框打开时，自动加载所有用户
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      dispatch(getUserList())
    } else {
      setSearchQuery('')
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>搜索用户</DialogTitle>
          <DialogDescription>搜索并添加好友</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索用户名、姓名或邮箱..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : '搜索'}
          </Button>
        </div>

        <div className="max-h-[400px] overflow-y-auto space-y-2">
          {loading && users.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              加载中...
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? '未找到匹配的用户' : '暂无用户'}
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name?.charAt(0).toUpperCase() || user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name || user.username}</div>
                    <div className="text-sm text-muted-foreground">@{user.username}</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleSendFriendRequest(user._id, user.username)}
                  disabled={sendingRequestTo === user._id}
                >
                  {sendingRequestTo === user._id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-1" />
                      添加好友
                    </>
                  )}
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
