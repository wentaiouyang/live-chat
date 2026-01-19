import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import apiClient from '@/utils/api-client'
import type {
  Chat,
  Message,
  CreateChatParams,
  UpdateChatParams,
  SendMessageParams,
  GetMessagesParams,
} from '@/types/api'

interface ChatState {
  chats: Chat[]
  currentChat: Chat | null
  messages: Message[]
  loading: boolean
  error: string | null
}

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  messages: [],
  loading: false,
  error: null,
}

// Thunks
export const getChats = createAsyncThunk('chats/list', async () => {
  const response = await apiClient.get<Chat[]>('/chats')
  return response.data
})

export const getChatById = createAsyncThunk('chats/getById', async (chatId: string) => {
  const response = await apiClient.get<Chat>(`/chats/${chatId}`)
  return response.data
})

export const createChat = createAsyncThunk('chats/create', async (params: CreateChatParams) => {
  const response = await apiClient.post<Chat>('/chats', params)
  return response.data
})

export const updateChat = createAsyncThunk(
  'chats/update',
  async ({ chatId, data }: { chatId: string; data: UpdateChatParams }) => {
    const response = await apiClient.patch<Chat>(`/chats/${chatId}`, data)
    return response.data
  }
)

export const getMessages = createAsyncThunk(
  'chats/getMessages',
  async ({ chatId, params }: { chatId: string; params?: GetMessagesParams }) => {
    const response = await apiClient.get<Message[]>(`/chats/${chatId}/messages`, { params })
    return { chatId, messages: response.data }
  }
)

export const sendMessage = createAsyncThunk(
  'chats/sendMessage',
  async ({ chatId, data }: { chatId: string; data: SendMessageParams }) => {
    const response = await apiClient.post<Message>(`/chats/${chatId}/messages`, data)
    return response.data
  }
)

export const markMessageRead = createAsyncThunk(
  'chats/markRead',
  async ({ chatId, messageId }: { chatId: string; messageId: string }) => {
    await apiClient.post<{ message: string }>(`/chats/${chatId}/messages/${messageId}/read`)
    return { chatId, messageId }
  }
)

export const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      // Check if message already exists
      if (state.messages.some((m) => m._id === action.payload._id)) {
        return
      }

      // Only add if it belongs to current chat or update lastMessage in chat list
      if (state.currentChat && state.currentChat._id === action.payload.chat) {
        state.messages.push(action.payload)
      }

      const chatIndex = state.chats.findIndex((c) => c._id === action.payload.chat)
      if (chatIndex !== -1) {
        state.chats[chatIndex].lastMessage = action.payload
        state.chats[chatIndex].updatedAt = action.payload.createdAt
        // Move to top
        const chat = state.chats.splice(chatIndex, 1)[0]
        state.chats.unshift(chat)
      }
    },
    setCurrentChat: (state, action: PayloadAction<Chat | null>) => {
      state.currentChat = action.payload
      state.messages = [] // Clear messages when switching
    },
    receiveNewChat: (state, action: PayloadAction<Chat>) => {
      // Avoid duplicates
      if (state.chats.some((c) => c._id === action.payload._id)) {
        return
      }
      state.chats.unshift(action.payload)
    },
  },
  extraReducers: (builder) => {
    // List Chats
    builder.addCase(getChats.fulfilled, (state, action) => {
      state.chats = action.payload
    })

    // Get Chat By ID
    builder.addCase(getChatById.fulfilled, (state, action) => {
      state.currentChat = action.payload
    })

    // Create Chat
    builder.addCase(createChat.fulfilled, (state, action) => {
      state.chats.unshift(action.payload)
      state.currentChat = action.payload
    })

    // Update Chat
    builder.addCase(updateChat.fulfilled, (state, action) => {
      if (state.currentChat && state.currentChat._id === action.payload._id) {
        state.currentChat = action.payload
      }
      const index = state.chats.findIndex((c) => c._id === action.payload._id)
      if (index !== -1) {
        state.chats[index] = action.payload
      }
    })

    // Get Messages
    builder.addCase(getMessages.fulfilled, (state, action) => {
      state.messages = action.payload.messages.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    })

    // Send Message
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      // Check if message already exists (e.g. added via socket)
      if (!state.messages.some((m) => m._id === action.payload._id)) {
        state.messages.push(action.payload)
      }

      // Update last message in chat list
      const chatIndex = state.chats.findIndex((c) => c._id === action.payload.chat)
      if (chatIndex !== -1) {
        state.chats[chatIndex].lastMessage = action.payload
        state.chats[chatIndex].updatedAt = action.payload.createdAt
        const chat = state.chats.splice(chatIndex, 1)[0]
        state.chats.unshift(chat)
      }
    })
  },
})

export const { addMessage, setCurrentChat, receiveNewChat } = chatSlice.actions
export default chatSlice.reducer
