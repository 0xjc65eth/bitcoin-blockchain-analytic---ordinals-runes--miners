import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import userReducer from './userSlice'
import marketReducer from './marketSlice'
import mempoolReducer from './mempoolSlice'
import miningReducer from './miningSlice'
import { RootState } from '@/types/store'

// Create the store
export const store = configureStore({
  reducer: {
    user: userReducer,
    market: marketReducer,
    mempool: mempoolReducer,
    mining: miningReducer,
  },
})

// Export types
export type AppDispatch = typeof store.dispatch

// Export hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store 