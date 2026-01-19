import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import apiClient from '@/utils/api-client'
import type { FriendRequest, User } from '@/types/api'

interface FriendState {
  requests: FriendRequest[]
  friends: User[]
  loading: boolean
  error: string | null
}

const initialState: FriendState = {
  requests: [],
  friends: [],
  loading: false,
  error: null,
}

// Thunks
export const getFriendRequests = createAsyncThunk('friends/getRequests', async () => {
  const response = await apiClient.get<FriendRequest[]>('/friends/requests')
  return response.data
})

export const sendFriendRequest = createAsyncThunk(
  'friends/sendRequest',
  async (toUserId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<FriendRequest>('/friends/requests', { toUserId })
      return response.data
    } catch (err) {
      const error = err as AxiosError<{ message: string }>
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to send friend request'
      )
    }
  }
)

export const acceptFriendRequest = createAsyncThunk('friends/acceptRequest', async (id: string) => {
  await apiClient.post<{ message: string }>(`/friends/requests/${id}/accept`)
  return id // Return ID to remove from requests
})

export const rejectFriendRequest = createAsyncThunk('friends/rejectRequest', async (id: string) => {
  await apiClient.post<{ message: string }>(`/friends/requests/${id}/reject`)
  return id
})

export const getFriendsList = createAsyncThunk('friends/list', async () => {
  const response = await apiClient.get<User[]>('/friends')
  return response.data
})

export const friendSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get Requests
    builder.addCase(getFriendRequests.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getFriendRequests.fulfilled, (state, action) => {
      state.loading = false
      state.requests = action.payload
    })
    builder.addCase(getFriendRequests.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Failed to fetch friend requests'
    })

    // Send Request
    builder.addCase(sendFriendRequest.fulfilled, () => {
      // Optimistically add? Or just rely on fetch?
      // API returns the created request, so we can add it to requests list if it's relevant (usually sender doesn't see it in incoming requests though)
    })

    // Accept Request
    builder.addCase(acceptFriendRequest.fulfilled, (state, action) => {
      state.requests = state.requests.filter((req) => req._id !== action.payload)
      // Ideally we should also refetch friends list or add the user to friends list if we had the user object
    })

    // Reject Request
    builder.addCase(rejectFriendRequest.fulfilled, (state, action) => {
      state.requests = state.requests.filter((req) => req._id !== action.payload)
    })

    // Get Friends List
    builder.addCase(getFriendsList.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getFriendsList.fulfilled, (state, action) => {
      state.loading = false
      state.friends = action.payload
    })
  },
})

export default friendSlice.reducer
