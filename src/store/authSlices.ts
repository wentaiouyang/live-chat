import axios from 'axios'
import config from '@/config'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const login = createAsyncThunk('auth/signin', async (payload: any) => {
  try {
    const response = await axios.post(`${config.apiBaseUrl}/api/v1/auth/signin`, payload)
    return response.data
  } catch (error) {
    throw error
  }
})

export const getUserInfo = createAsyncThunk('auth/getUserInfo', async (id: string) => {
  try {
    const response = await axios.get(`${config.apiBaseUrl}/api/v1/user/search/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
})

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload
    })
  },
})
