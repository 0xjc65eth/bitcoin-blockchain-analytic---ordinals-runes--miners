import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  address: string | null
  nftData: {
    id: string
    name: string
    collection: string
    image: string
    verified: boolean
    tier: string
    version: string
    benefits: string[]
  } | null
  subscription: 'free' | 'basic' | 'pro' | 'enterprise' | null
}

const initialState: UserState = {
  address: null,
  nftData: null,
  subscription: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<string | null>) => {
      state.address = action.payload
    },
    setNftData: (state, action: PayloadAction<UserState['nftData']>) => {
      state.nftData = action.payload
    },
    setSubscription: (state, action: PayloadAction<UserState['subscription']>) => {
      state.subscription = action.payload
    },
  },
})

export const { setAddress, setNftData, setSubscription } = userSlice.actions
export default userSlice.reducer 