import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MempoolState } from '@/types/store'

const initialState: MempoolState = {
  pendingTransactions: 0,
  averageFeeRate: 0,
  mempoolSize: 0,
  lastUpdated: new Date().toISOString(),
  transactions: [],
  feeRates: {
    low: 0,
    medium: 0,
    high: 0
  },
  blocks: []
}

const mempoolSlice = createSlice({
  name: 'mempool',
  initialState,
  reducers: {
    setPendingTransactions: (state, action: PayloadAction<number>) => {
      state.pendingTransactions = action.payload
    },
    setAverageFeeRate: (state, action: PayloadAction<number>) => {
      state.averageFeeRate = action.payload
    },
    setMempoolSize: (state, action: PayloadAction<number>) => {
      state.mempoolSize = action.payload
    },
    setMempoolData: (state, action: PayloadAction<MempoolState>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { setPendingTransactions, setAverageFeeRate, setMempoolSize, setMempoolData } = mempoolSlice.actions
export default mempoolSlice.reducer 