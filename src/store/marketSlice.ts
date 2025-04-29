import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MarketState } from '@/types/store'

const initialState: MarketState = {
  btcPrice: 0,
  btcChange24h: 0,
  volume24h: 0,
  marketCap: 0,
  lastUpdated: new Date().toISOString(),
}

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setBtcPrice: (state, action: PayloadAction<number>) => {
      state.btcPrice = action.payload
    },
    setBtcChange24h: (state, action: PayloadAction<number>) => {
      state.btcChange24h = action.payload
    },
    setVolume24h: (state, action: PayloadAction<number>) => {
      state.volume24h = action.payload
    },
    setMarketCap: (state, action: PayloadAction<number>) => {
      state.marketCap = action.payload
    },
    setMarketData: (state, action: PayloadAction<MarketState>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { setBtcPrice, setBtcChange24h, setVolume24h, setMarketCap, setMarketData } = marketSlice.actions
export default marketSlice.reducer