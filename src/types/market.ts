/**
 * Market Data Types
 * 
 * This file defines the types for market data used in the Bitcoin Blockchain Analytics application.
 */

export interface MarketState {
  price: number;
  volume24h: number;
  marketCap: number;
  priceChange24h: number;
  priceChange7d: number;
  priceChange30d: number;
  lastUpdated: string;
}

export interface MarketData {
  id: string;
  timestamp: string;
  symbol: string;
  name: string;
  price: number;
  priceUsd: number;
  volume24h: number;
  volume24hUsd: number;
  marketCap: number;
  marketCapUsd: number;
  fullyDilutedValuation: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number;
  priceChange1h: number;
  priceChange24h: number;
  priceChange7d: number;
  priceChange30d: number;
  priceChange60d: number;
  priceChange90d: number;
  priceChange1y: number;
  athPrice: number;
  athDate: string;
  athPercentage: number;
  atlPrice: number;
  atlDate: string;
  atlPercentage: number;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  };
  lastUpdated: string;
  sparkline: number[];
  marketCapRank: number;
  high24h: number;
  low24h: number;
}

export interface MarketTrend {
  id: string;
  timestamp: string;
  timeframe: '1h' | '24h' | '7d' | '30d' | '90d' | '1y';
  direction: 'bullish' | 'bearish' | 'neutral';
  strength: number; // 0-100%
  indicators: {
    rsi: number;
    macd: {
      line: number;
      signal: number;
      histogram: number;
    };
    bollingerBands: {
      upper: number;
      middle: number;
      lower: number;
      width: number;
    };
    movingAverages: {
      ma50: number;
      ma100: number;
      ma200: number;
    };
  };
  supportLevels: number[];
  resistanceLevels: number[];
  volume: number;
  volumeChange: number;
  sentiment: number; // -100 to 100
  volatility: number;
  dominance: number;
  correlation: {
    sp500: number;
    gold: number;
    dxy: number;
  };
}

export interface MarketPrediction {
  id: string;
  timestamp: string;
  targetTimestamp: string;
  timeframe: '1h' | '24h' | '7d' | '30d' | '90d' | '1y';
  predictedPrice: number;
  predictedPriceRange: [number, number];
  confidence: number; // 0-100%
  factors: {
    name: string;
    impact: number; // -100 to 100
    description: string;
  }[];
  modelId: string;
  modelAccuracy: number;
  previousPredictions: {
    timestamp: string;
    predictedPrice: number;
    actualPrice: number;
    error: number;
  }[];
}

export interface MarketEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'news' | 'regulatory' | 'technical' | 'onchain' | 'macro' | 'other';
  impact: number; // -100 to 100
  source: string;
  url?: string;
  relatedAssets: string[];
  sentiment: number; // -100 to 100
  verified: boolean;
}
