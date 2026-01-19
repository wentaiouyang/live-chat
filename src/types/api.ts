export interface User {
  _id: string
  name: string
  username: string
  email: string
  createdAt?: string
  verified?: boolean
}

export interface AuthResponse {
  token: string
  name: string
  createdAt: string
  verified: boolean
  id: string
}

export interface SearchParams {
  q: string
}

export interface UpdateUserParams {
  name?: string
  username?: string
  email?: string
}

// ------------------------------------------------------------------
// Friends
// ------------------------------------------------------------------

export interface FriendRequest {
  _id: string
  from: User
  to: User
  status: 'pending' | 'accepted' | 'rejected' // Assuming status/enum based on context
  createdAt: string
}

// ------------------------------------------------------------------
// Chats
// ------------------------------------------------------------------

export interface Chat {
  _id: string
  type: 'direct' | 'group'
  name?: string
  participants: User[]
  lastMessage?: Message
  lastMessageAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateChatParams {
  type: 'direct' | 'group'
  participantId?: string // for direct
  name?: string // for group
  participantIds?: string[] // for group
}

export interface UpdateChatParams {
  name?: string
  addParticipants?: string[]
  removeParticipants?: string[]
}

// ------------------------------------------------------------------
// Messages
// ------------------------------------------------------------------

export interface Message {
  _id: string
  chat: string
  sender: User
  content: string
  type: 'text' | 'image' | 'video' | 'file' // Expanded common types
  readBy?: string[]
  createdAt: string
  updatedAt: string
}

export interface SendMessageParams {
  content: string
  type?: string
}

export interface GetMessagesParams {
  before?: string
  limit?: number
}
