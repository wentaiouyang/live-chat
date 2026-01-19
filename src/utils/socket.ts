import { io, Socket } from 'socket.io-client'
import config from '@/config'
import type { Message, FriendRequest, User, Chat } from '@/types/api'

class SocketService {
  private socket: Socket | null = null

  connect(token: string) {
    if (this.socket?.connected) return

    this.socket = io(config.apiBaseUrl, {
      auth: { token },
      transports: ['websocket'],
    })

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id)
    })

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected')
    })

    this.socket.on('error', (error) => {
      console.error('❌ Socket error:', error)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Chat related methods
  joinChats(chatIds: string[]) {
    this.socket?.emit('chats:join', { chatIds })
  }

  sendMessage(payload: { chatId: string; content: string; type?: string }) {
    this.socket?.emit('message:send', payload)
  }

  onNewMessage(callback: (message: Message) => void) {
    this.socket?.on('message:new', callback)
  }

  offNewMessage(callback: (message: Message) => void) {
    this.socket?.off('message:new', callback)
  }

  onNewChat(callback: (chat: Chat) => void) {
    this.socket?.on('chat:new', callback)
  }

  offNewChat(callback: (chat: Chat) => void) {
    this.socket?.off('chat:new', callback)
  }

  // Friend request related methods
  onFriendRequest(callback: (request: FriendRequest) => void) {
    this.socket?.on('friend:request', callback)
  }

  offFriendRequest(callback: (request: FriendRequest) => void) {
    this.socket?.off('friend:request', callback)
  }

  onFriendRequestAccepted(callback: (data: { requestId: string; friend: User }) => void) {
    this.socket?.on('friend:accepted', callback)
  }

  offFriendRequestAccepted(callback: (data: { requestId: string; friend: User }) => void) {
    this.socket?.off('friend:accepted', callback)
  }

  onFriendRequestRejected(callback: (data: { requestId: string }) => void) {
    this.socket?.on('friend:rejected', callback)
  }

  offFriendRequestRejected(callback: (data: { requestId: string }) => void) {
    this.socket?.off('friend:rejected', callback)
  }

  // Check connection status
  isConnected(): boolean {
    return this.socket?.connected || false
  }
}

export const socketService = new SocketService()
