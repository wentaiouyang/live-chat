import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '@/utils/api-client'
import type { User, SearchParams, UpdateUserParams } from '@/types/api'

interface UserState {
  users: User[] // For list or search results
  cachedUsers: Record<string, User> // For individual lookups by ID
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  users: [],
  cachedUsers: {},
  loading: false,
  error: null,
}

// Thunks
export const getUserList = createAsyncThunk('user/list', async () => {
  const response = await apiClient.get<User[]>('/user/list')
  return response.data
})

export const searchUsers = createAsyncThunk('user/search', async (params: SearchParams) => {
  const response = await apiClient.get<User[]>('/user/search', { params })
  return response.data
})

export const getUserById = createAsyncThunk('user/getById', async (id: string) => {
  const response = await apiClient.get<User>(`/user/search/${id}`)
  return response.data
})

export const updateUser = createAsyncThunk(
  'user/update',
  async ({ id, data }: { id: string; data: UpdateUserParams }) => {
    await apiClient.put<{ message: string; id: string }>(`/user/update/${id}`, data)
    return { id, ...data }
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // List
    builder.addCase(getUserList.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getUserList.fulfilled, (state, action) => {
      state.loading = false
      state.users = action.payload
    })
    builder.addCase(getUserList.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Failed to fetch users'
    })

    // Search
    builder.addCase(searchUsers.pending, (state) => {
      state.loading = true
    })
    builder.addCase(searchUsers.fulfilled, (state, action) => {
      state.loading = false
      state.users = action.payload
    })
    builder.addCase(searchUsers.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Search failed'
    })

    // Get By ID
    builder.addCase(getUserById.fulfilled, (state, action) => {
      state.cachedUsers[action.payload._id] = action.payload
    })

    // Update
    builder.addCase(updateUser.fulfilled, (state, action) => {
      // Update in cache if exists
      if (state.cachedUsers[action.payload.id]) {
        state.cachedUsers[action.payload.id] = {
          ...state.cachedUsers[action.payload.id],
          ...action.payload,
        }
      }
      // Update in list if exists
      const userIndex = state.users.findIndex((u) => u._id === action.payload.id)
      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], ...action.payload }
      }
    })
  },
})

export default userSlice.reducer
