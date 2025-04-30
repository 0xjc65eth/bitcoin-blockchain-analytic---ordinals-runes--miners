// Definições de tipos globais para o projeto

// Tipo para insights de mercado
interface MarketInsight {
  id: string;
  title: string;
  description: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  impact: 'High' | 'Medium' | 'Low';
  assets: string[];
  source: string;
  timestamp: string;
}

// Tipo para dados de trading
interface TradingData {
  marketInsights: MarketInsight[];
  lastUpdated: string;
}

// Tipo para preços de criptomoedas
interface CryptoPrice {
  symbol: string;
  price: number;
  percentChange24h: number;
  lastUpdated: string;
}

// Tipo para sinais de trading
interface TradingSignal {
  id: string;
  pair: string;
  direction: 'Long' | 'Short';
  status: 'Pending' | 'Triggered' | 'Invalidated';
  entryPrice: number;
  stopLoss: number;
  riskReward: number;
  winRate: number;
  timeframe: string;
  structure: string;
  entryTime: string;
  keyLevels: {
    type: string;
    level: number;
  }[];
  takeProfits: {
    level: number;
    id: number;
  }[];
  isBreaker: boolean;
  isRetestSignal: boolean;
}

// Tipo para dados do Bitcoin
interface BitcoinData {
  btcPrice: number;
  btcChange24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: string;
}
