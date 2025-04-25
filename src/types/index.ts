export interface MarketData {
  bitcoinPrice: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  dominance: number;
  ordinalsVolume: number;
  runesVolume: number;
}

export interface MempoolStats {
  size: number;
  count: number;
  feeRate: number;
}

export interface MinerStats {
  avgHashrate: number;
  difficulty: number;
  blockTime: number;
}

export interface WhaleActivity {
  collection: string;
  items: number;
  amount: number;
  timestamp: string;
}

export interface SentimentTrend {
  current: 'positive' | 'negative' | 'neutral';
  score: number;
  predicted: {
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
  };
}

export interface Prediction {
  type: string;
  value: number;
  confidence: number;
  horizon: string;
} 