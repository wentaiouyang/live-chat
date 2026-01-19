import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/store/store'
import {
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendsList,
} from '@/store/friendSlices'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Check, X, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

export function FriendRequestsList() {
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()
  const { requests: friendRequests = [], loading } = useSelector(
    (state: RootState) => state.friends
  )
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    console.log('加载好友请求列表...')
    dispatch(getFriendRequests())

    // 获取当前用户 ID
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
        const json = JSON.parse(atob(base64))
        const userId = json.id || ''
        setCurrentUserId(userId)
        console.log('👤 当前用户 ID:', userId)
      } catch (error) {
        console.error('❗ 解析 token 失败:', error)
      }
    }
  }, [dispatch])

  // 添加调试日志
  useEffect(() => {
    console.log('好友请求原始数据:', friendRequests)
    console.log('原始请求数量:', friendRequests?.length || 0)

    if (currentUserId) {
      // 过滤：只显示发送给当前用户的待处理请求
      const incomingRequests =
        friendRequests?.filter((req) => req.status === 'pending' && req.to._id === currentUserId) ||
        []
      console.log('接收到的待处理请求:', incomingRequests)
      console.log('待处理请求数量:', incomingRequests.length)
    }
  }, [friendRequests, currentUserId])

  // 过滤出接收到的待处理请求
  const incomingRequests = currentUserId
    ? friendRequests?.filter((req) => req.status === 'pending' && req.to._id === currentUserId) ||
      []
    : []

  const handleAccept = async (requestId: string, username: string) => {
    setProcessingId(requestId)
    try {
      const result = await dispatch(acceptFriendRequest(requestId))
      if (acceptFriendRequest.fulfilled.match(result)) {
        toast({
          title: '已接受好友请求',
          description: `您和 ${username} 现在是好友了`,
        })
        // 刷新好友列表
        dispatch(getFriendsList())
      } else {
        toast({
          title: '操作失败',
          description: '无法接受好友请求，请稍后重试',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: '操作失败',
        description: '网络错误，请稍后重试',
        variant: 'destructive',
      })
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (requestId: string, username: string) => {
    setProcessingId(requestId)
    try {
      const result = await dispatch(rejectFriendRequest(requestId))
      if (rejectFriendRequest.fulfilled.match(result)) {
        toast({
          title: '已拒绝好友请求',
          description: `已拒绝 ${username} 的好友请求`,
        })
      } else {
        toast({
          title: '操作失败',
          description: '无法拒绝好友请求，请稍后重试',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: '操作失败',
        description: '网络错误，请稍后重试',
        variant: 'destructive',
      })
    } finally {
      setProcessingId(null)
    }
  }

  if (loading && incomingRequests.length === 0) {
    return (
      <div className="flex items-center justify-center py-4 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        加载中...
      </div>
    )
  }

  if (!incomingRequests || incomingRequests.length === 0) {
    return null
  }

  return (
    <div className="mb-4 space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
        好友请求 ({incomingRequests.length})
      </h3>
      {incomingRequests.map((request) => (
        <div
          key={request._id}
          className="rounded-lg p-3 bg-accent/30 border border-border/50 space-y-2"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarFallback className="text-sm font-bold bg-muted text-muted-foreground">
                {request.from.name?.charAt(0).toUpperCase() ||
                  request.from.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <div className="font-medium truncate">
                {request.from.name || request.from.username}
              </div>
              <div className="text-xs text-muted-foreground truncate">@{request.from.username}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => handleAccept(request._id, request.from.username)}
              disabled={processingId === request._id}
            >
              {processingId === request._id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  接受
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => handleReject(request._id, request.from.username)}
              disabled={processingId === request._id}
            >
              {processingId === request._id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <X className="h-4 w-4 mr-1" />
                  拒绝
                </>
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
