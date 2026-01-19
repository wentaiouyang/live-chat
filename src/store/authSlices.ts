import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '@/utils/api-client'
import type { AuthResponse } from '@/types/api'

// Define State Interface
interface AuthState {
  isAuthenticated: boolean
  user: {
    id: string
    name: string
    email?: string // AuthResponse doesn't always strictly have email depending on endpoint return but signup does.
    // Based on API Doc: signin returns token, name, createdAt, verified, id
  } | null
  token: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem('token'),
  user: null, // You might want to persist user info or fetch on load
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/signin',
  async (payload: { email: string; password: string }) => {
    console.log('Redux thunk: 开始登录请求', payload.email)
    try {
      const response = await apiClient.post<AuthResponse>('/auth/signin', payload)
      console.log('Redux thunk: 登录响应', response.data)
      return response.data
    } catch (error) {
      console.error('Redux thunk: 登录错误', error)
      throw error
    }
  }
)

export const signup = createAsyncThunk(
  'auth/signup',
  async (payload: { username: string; email: string; password: string; name?: string }) => {
    const response = await apiClient.post<{ message: string }>('/auth/signup', payload)
    return response.data
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false
      state.isAuthenticated = true
      state.user = {
        id: action.payload.id,
        name: action.payload.name,
      }
      state.token = action.payload.token // Although API Login response has token
      localStorage.setItem('token', action.payload.token)
    })
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Login failed'
    })

    // Signup
    builder.addCase(signup.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(signup.fulfilled, (state) => {
      state.loading = false
      // Signup usually doesn't auto login unless specified. Doc says returns message.
    })
    builder.addCase(signup.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Signup failed'
    })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
