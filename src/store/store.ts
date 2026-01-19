import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './authSlices'
import { userSlice } from './userSlices'
import { friendSlice } from './friendSlices'
import { chatSlice } from './chatSlices'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    user: userSlice.reducer,
    friends: friendSlice.reducer,
    chats: chatSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
