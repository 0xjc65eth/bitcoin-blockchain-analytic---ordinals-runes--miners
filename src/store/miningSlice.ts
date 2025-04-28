import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MiningState } from '@/types/store'

const initialState: MiningState = {
  hashRate: 0,
  difficulty: 0,
  blockTime: 0,
  lastUpdated: new Date().toISOString()
}

const miningSlice = createSlice({
  name: 'mining',
  initialState,
  reducers: {
    setHashRate: (state, action: PayloadAction<number>) => {
      state.hashRate = action.payload
    },
    setDifficulty: (state, action: PayloadAction<number>) => {
      state.difficulty = action.payload
    },
    setBlockTime: (state, action: PayloadAction<number>) => {
      state.blockTime = action.payload
    },
    setMiningData: (state, action: PayloadAction<MiningState>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { setHashRate, setDifficulty, setBlockTime, setMiningData } = miningSlice.actions
export default miningSlice.reducer 