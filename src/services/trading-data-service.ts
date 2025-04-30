// Serviço para gerar dados de trading, arbitragem e análises SMC

export interface ArbitrageOpportunity {
  id: string;
  sourceExchange: string;
  targetExchange: string;
  asset: string;
  priceDifference: number;
  percentageDifference: number;
  volume24h: number;
  estimatedProfit: number;
  risk: 'Low' | 'Medium' | 'High';
  timeToExecute: string;
  confidence: number;
  status: 'New' | 'Active' | 'Closing' | 'Expired';
  timestamp: string;
}

export interface SmcTradeSetup {
  id: string;
  asset: string;
  timeframe: string;
  direction: 'Long' | 'Short';
  entry: number;
  stopLoss: number;
  takeProfits: {
    tp1: number;
    tp2: number;
    tp3: number;
    tp4: number;
  };
  riskRewardRatio: number;
  winRate: number;
  setup: string;
  confidence: number;
  status: 'Pending' | 'Active' | 'Triggered' | 'Completed' | 'Invalidated';
  keyLevels: {
    name: string;
    price: number;
    type: 'Support' | 'Resistance' | 'OB' | 'FVG' | 'BOS';
  }[];
  timestamp: string;
  expectedTimeInTrade: string;
  marketStructure: string;
  orderBlocks: {
    price: string;
    type: 'Bullish' | 'Bearish';
    strength: number;
  }[];
  fairValueGaps: {
    price: string;
    type: 'Bullish' | 'Bearish';
    status: string;
  }[];
}

export interface NeuralMetric {
  name: string;
  value: number;
  interpretation: string;
  trend: 'Up' | 'Down' | 'Neutral';
  confidence: number;
  timeframe: string;
}

export interface MarketInsight {
  id: string;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  assets: string[];
  source: string;
  timestamp: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}

export interface TradingData {
  arbitrageOpportunities: ArbitrageOpportunity[];
  smcTradeSetups: SmcTradeSetup[];
  neuralMetrics: NeuralMetric[];
  marketInsights: MarketInsight[];
  lastUpdated: string;
}

// Função para gerar oportunidades de arbitragem com foco em Ordinals e Runes
function generateArbitrageOpportunities(count: number = 10): ArbitrageOpportunity[] {
  const exchanges = ['Magic Eden', 'Gamma.io', 'Ordinals Market', 'Ordswap', 'Unisat', 'Ordinals Wallet', 'OrdinalHub', 'Xverse'];
  const assets = [
    'Ordinal Punks', 'Bitcoin Puppets', 'Ordinal Maxi', 'Rune20/PEPE', 'Rune20/MEME', 'Rune20/TRAC',
    'BTC/USDT', 'Ordinal Satoshi', 'OCM Genesis', 'Taproot Wizards', 'Rune20/ORDI', 'Rune20/SATS'
  ];
  const statuses = ['New', 'Active', 'Closing', 'Expired'];
  const risks = ['Low', 'Medium', 'High'];

  return Array.from({ length: count }, (_, index) => {
    const sourceExchange = exchanges[Math.floor(Math.random() * exchanges.length)];
    let targetExchange = sourceExchange;
    while (targetExchange === sourceExchange) {
      targetExchange = exchanges[Math.floor(Math.random() * exchanges.length)];
    }

    const asset = assets[Math.floor(Math.random() * assets.length)];

    // Higher spreads for Ordinals and Runes due to market inefficiency
    const percentageDifference = asset.includes('Ordinal') || asset.includes('Rune')
      ? Math.random() * 12 + 2 // 2% to 14% for Ordinals/Runes
      : Math.random() * 3 + 0.3; // 0.3% to 3.3% for BTC

    const volume24h = Math.floor(Math.random() * 5000000) + 100000; // $100K to $5.1M
    const estimatedProfit = (percentageDifference * volume24h) / 100 * (Math.random() * 0.15 + 0.05); // Higher profit margin

    // Higher risk for higher percentage differences
    let risk: 'Low' | 'Medium' | 'High';
    if (percentageDifference > 10) {
      risk = 'High';
    } else if (percentageDifference > 5) {
      risk = 'Medium';
    } else {
      risk = 'Low';
    }

    const timeToExecute = `${Math.floor(Math.random() * 15) + 5}m`; // 5m to 20m
    const confidence = Math.floor(Math.random() * 25) + 70; // 70% to 94%
    const status = statuses[Math.floor(Math.random() * statuses.length)] as 'New' | 'Active' | 'Closing' | 'Expired';

    // More recent timestamps for better relevance
    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 1800000)).toISOString(); // Within the last 30 minutes

    return {
      id: `ARB-${index + 1}`,
      sourceExchange,
      targetExchange,
      asset,
      priceDifference: asset.includes('BTC')
        ? Math.random() * 500 + 10 // $10 to $510 for BTC
        : Math.random() * 0.5 + 0.05, // $0.05 to $0.55 for Ordinals/Runes
      percentageDifference,
      volume24h,
      estimatedProfit,
      risk,
      timeToExecute,
      confidence,
      status,
      timestamp
    };
  });
}

// Função para gerar setups de trade SMC
function generateSmcTradeSetups(count: number = 8): SmcTradeSetup[] {
  const assets = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'BNB/USD', 'XRP/USD', 'DOGE/USD', 'ADA/USD', 'AVAX/USD'];
  const timeframes = ['15m', '1h', '4h', 'Daily'];
  const setups = ['OB Retest', 'FVG Fill', 'BOS Retest', 'Liquidity Sweep', 'Equal Highs/Lows', 'Breaker', 'Swing Failure', 'Imbalance'];
  const statuses = ['Pending', 'Active', 'Triggered', 'Completed', 'Invalidated'];
  const marketStructures = ['Uptrend', 'Downtrend', 'Range', 'Accumulation', 'Distribution', 'Wyckoff Spring', 'Wyckoff Upthrust'];

  return Array.from({ length: count }, (_, index) => {
    const asset = assets[Math.floor(Math.random() * assets.length)];
    const direction = Math.random() > 0.5 ? 'Long' : 'Short';

    // Base price around BTC price range
    const basePrice = 65000 + (Math.random() * 10000 - 5000);

    // For long setups, entry > stop loss, for shorts entry < stop loss
    let entry, stopLoss;
    if (direction === 'Long') {
      entry = basePrice;
      stopLoss = entry * (1 - (Math.random() * 0.05 + 0.01)); // 1% to 6% below entry
    } else {
      entry = basePrice;
      stopLoss = entry * (1 + (Math.random() * 0.05 + 0.01)); // 1% to 6% above entry
    }

    // Calculate take profits
    let tp1, tp2, tp3, tp4;
    if (direction === 'Long') {
      tp1 = entry * (1 + (Math.random() * 0.03 + 0.01)); // 1% to 4% above entry
      tp2 = tp1 * (1 + (Math.random() * 0.03 + 0.01));
      tp3 = tp2 * (1 + (Math.random() * 0.03 + 0.01));
      tp4 = tp3 * (1 + (Math.random() * 0.03 + 0.01));
    } else {
      tp1 = entry * (1 - (Math.random() * 0.03 + 0.01)); // 1% to 4% below entry
      tp2 = tp1 * (1 - (Math.random() * 0.03 + 0.01));
      tp3 = tp2 * (1 - (Math.random() * 0.03 + 0.01));
      tp4 = tp3 * (1 - (Math.random() * 0.03 + 0.01));
    }

    // Calculate risk/reward ratio
    const risk = Math.abs(entry - stopLoss);
    const reward = Math.abs(tp2 - entry); // Using TP2 for R:R calculation
    const riskRewardRatio = reward / risk;

    // Generate win rate
    const winRate = Math.floor(Math.random() * 30) + 60; // 60% to 89%

    // Generate confidence
    const confidence = Math.floor(Math.random() * 30) + 70; // 70% to 99%

    // Generate key levels
    const keyLevelsCount = Math.floor(Math.random() * 3) + 2; // 2 to 4 key levels
    const keyLevelTypes = ['Support', 'Resistance', 'OB', 'FVG', 'BOS'];
    const keyLevels = Array.from({ length: keyLevelsCount }, (_, i) => {
      const type = keyLevelTypes[Math.floor(Math.random() * keyLevelTypes.length)] as 'Support' | 'Resistance' | 'OB' | 'FVG' | 'BOS';
      let price;
      if (type === 'Support') {
        price = direction === 'Long' ? stopLoss * (1 - Math.random() * 0.02) : entry * (1 - Math.random() * 0.05);
      } else if (type === 'Resistance') {
        price = direction === 'Long' ? tp2 * (1 + Math.random() * 0.02) : stopLoss * (1 + Math.random() * 0.02);
      } else {
        price = basePrice * (1 + (Math.random() * 0.1 - 0.05)); // Random price around base price
      }
      return {
        name: `${type} ${i+1}`,
        price,
        type
      };
    });

    // Generate order blocks
    const orderBlocksCount = Math.floor(Math.random() * 2) + 1; // 1 to 2 order blocks
    const orderBlocks = Array.from({ length: orderBlocksCount }, (_, i) => {
      const type = Math.random() > 0.5 ? 'Bullish' : 'Bearish';
      const price = type === 'Bullish'
        ? `${(stopLoss * 0.97).toFixed(0)}-${(stopLoss * 0.99).toFixed(0)}`
        : `${(tp2 * 1.01).toFixed(0)}-${(tp2 * 1.03).toFixed(0)}`;
      return {
        price,
        type,
        strength: Math.floor(Math.random() * 30) + 70 // 70 to 99
      };
    });

    // Generate fair value gaps
    const fvgCount = Math.floor(Math.random() * 2) + 1; // 1 to 2 FVGs
    const fvgStatuses = ['Filled', 'Unfilled', 'Mitigated'];
    const fairValueGaps = Array.from({ length: fvgCount }, (_, i) => {
      const type = Math.random() > 0.5 ? 'Bullish' : 'Bearish';
      const price = type === 'Bullish'
        ? `${(entry * 0.98).toFixed(0)}-${(entry * 0.99).toFixed(0)}`
        : `${(entry * 1.01).toFixed(0)}-${(entry * 1.02).toFixed(0)}`;
      return {
        price,
        type,
        status: fvgStatuses[Math.floor(Math.random() * fvgStatuses.length)]
      };
    });

    return {
      id: `SMC-${index + 1}`,
      asset,
      timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
      direction,
      entry,
      stopLoss,
      takeProfits: {
        tp1,
        tp2,
        tp3,
        tp4
      },
      riskRewardRatio,
      winRate,
      setup: setups[Math.floor(Math.random() * setups.length)],
      confidence,
      status: statuses[Math.floor(Math.random() * statuses.length)] as 'Pending' | 'Active' | 'Triggered' | 'Completed' | 'Invalidated',
      keyLevels,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(),
      expectedTimeInTrade: `${Math.floor(Math.random() * 48) + 1}h`,
      marketStructure: marketStructures[Math.floor(Math.random() * marketStructures.length)],
      orderBlocks,
      fairValueGaps
    };
  }).sort((a, b) => b.confidence - a.confidence);
}

// Função para gerar métricas neurais com foco em Bitcoin, Ordinals e Runes
function generateNeuralMetrics(): NeuralMetric[] {
  const metricNames = [
    'Bitcoin On-Chain Activity',
    'Ordinals Inscription Rate',
    'Runes Adoption Metric',
    'BTC Institutional Flow',
    'Bitcoin Whale Activity',
    'Ordinals Market Liquidity',
    'Runes Trading Volume',
    'Bitcoin Hash Rate Impact',
    'BTC UTXO Age Distribution',
    'Ordinals & Runes Correlation'
  ];

  const timeframes = ['1h', '4h', '1D', '1W'];

  return metricNames.map(name => {
    // Adjust value ranges based on metric type
    let value: number;
    if (name.includes('Ordinals')) {
      value = Math.random() * 30 + 60; // 60-90 range for Ordinals (bullish bias)
    } else if (name.includes('Runes')) {
      value = Math.random() * 40 + 50; // 50-90 range for Runes (bullish bias)
    } else if (name.includes('Bitcoin') || name.includes('BTC')) {
      value = Math.random() * 50 + 40; // 40-90 range for Bitcoin (moderate bullish bias)
    } else {
      value = Math.random() * 100; // 0-100 range for other metrics
    }

    let interpretation = '';
    let trend: 'Up' | 'Down' | 'Neutral' = 'Neutral';

    if (value > 70) {
      if (name.includes('Ordinals')) {
        interpretation = `Strong inscription activity and growing collector interest in Ordinals.`;
      } else if (name.includes('Runes')) {
        interpretation = `Significant adoption growth and positive sentiment for Runes tokens.`;
      } else if (name.includes('Bitcoin') || name.includes('BTC')) {
        interpretation = `Strong on-chain fundamentals and institutional interest in Bitcoin.`;
      } else {
        interpretation = `Strong positive reading, indicating bullish momentum.`;
      }
      trend = 'Up';
    } else if (value > 50) {
      if (name.includes('Ordinals')) {
        interpretation = `Moderate inscription growth with stable collector interest.`;
      } else if (name.includes('Runes')) {
        interpretation = `Steady adoption metrics with positive development activity.`;
      } else if (name.includes('Bitcoin') || name.includes('BTC')) {
        interpretation = `Healthy on-chain metrics with balanced accumulation patterns.`;
      } else {
        interpretation = `Moderately positive, suggesting cautious optimism.`;
      }
      trend = 'Up';
    } else if (value > 40) {
      if (name.includes('Ordinals')) {
        interpretation = `Neutral inscription rate, market in consolidation phase.`;
      } else if (name.includes('Runes')) {
        interpretation = `Balanced token flows, neither bullish nor bearish signals.`;
      } else if (name.includes('Bitcoin') || name.includes('BTC')) {
        interpretation = `Neutral on-chain activity, awaiting catalyst for direction.`;
      } else {
        interpretation = `Neutral reading, market in equilibrium.`;
      }
      trend = 'Neutral';
    } else if (value > 20) {
      if (name.includes('Ordinals')) {
        interpretation = `Declining inscription rate, potential market saturation.`;
      } else if (name.includes('Runes')) {
        interpretation = `Slowing adoption metrics, cautious outlook advised.`;
      } else if (name.includes('Bitcoin') || name.includes('BTC')) {
        interpretation = `Weakening on-chain fundamentals, distribution patterns observed.`;
      } else {
        interpretation = `Moderately negative, suggesting caution.`;
      }
      trend = 'Down';
    } else {
      if (name.includes('Ordinals')) {
        interpretation = `Significant drop in inscription activity, bearish market conditions.`;
      } else if (name.includes('Runes')) {
        interpretation = `Negative adoption trends, declining interest in Runes ecosystem.`;
      } else if (name.includes('Bitcoin') || name.includes('BTC')) {
        interpretation = `Concerning on-chain metrics, potential for further downside.`;
      } else {
        interpretation = `Strong negative reading, indicating bearish pressure.`;
      }
      trend = 'Down';
    }

    // Higher confidence for Bitcoin metrics
    const confidence = name.includes('Bitcoin') || name.includes('BTC')
      ? Math.floor(Math.random() * 15) + 80 // 80-94% for Bitcoin
      : Math.floor(Math.random() * 25) + 70; // 70-94% for others

    return {
      name,
      value,
      interpretation,
      trend,
      confidence,
      timeframe: timeframes[Math.floor(Math.random() * timeframes.length)]
    };
  });
}

// Função para gerar insights de mercado com foco em Bitcoin, Ordinals e Runes
function generateMarketInsights(): MarketInsight[] {
  const insights = [
    {
      title: 'Bitcoin Institutional Accumulation',
      description: 'On-chain analysis shows large wallets accumulating BTC in the $64K-$66K range over the past 48 hours, suggesting strong institutional interest.',
      impact: 'High',
      assets: ['BTC'],
      source: 'On-chain Analysis',
      sentiment: 'Bullish'
    },
    {
      title: 'Ordinals Inscription Rate Surging',
      description: 'Daily Ordinals inscription rate has increased by 35% in the past week, with premium collections seeing higher floor prices and trading volume.',
      impact: 'Medium',
      assets: ['Ordinals'],
      source: 'Ordiscan API',
      sentiment: 'Bullish'
    },
    {
      title: 'Runes Adoption Milestone',
      description: 'Runes protocol has surpassed 100,000 unique holders, marking a significant adoption milestone for the Bitcoin-based token standard.',
      impact: 'Medium',
      assets: ['Runes'],
      source: 'Runes Explorer',
      sentiment: 'Bullish'
    },
    {
      title: 'Whale Alert: Large BTC Transfer',
      description: 'Whale wallet transferred 2,500 BTC from cold storage to exchange, potential selling pressure ahead. Monitor closely for distribution patterns.',
      impact: 'High',
      assets: ['BTC'],
      source: 'Blockchain Data',
      sentiment: 'Bearish'
    },
    {
      title: 'Premium Ordinals Collections Trend',
      description: 'Top-tier Ordinals collections like Bitcoin Puppets and OCM Genesis showing increased buying activity from whale wallets in the past 72 hours.',
      impact: 'Medium',
      assets: ['Ordinals'],
      source: 'Marketplace Data',
      sentiment: 'Bullish'
    },
    {
      title: 'Runes Liquidity Expansion',
      description: 'Major Runes tokens seeing significant liquidity expansion across decentralized exchanges, particularly for RUNE20/ORDI and RUNE20/SATS pairs.',
      impact: 'Medium',
      assets: ['Runes'],
      source: 'DEX Analytics',
      sentiment: 'Bullish'
    },
    {
      title: 'Bitcoin Options Sentiment',
      description: 'Options market showing increased demand for BTC calls at $70K strike price for June expiry, indicating bullish sentiment among derivatives traders.',
      impact: 'Medium',
      assets: ['BTC'],
      source: 'Options Chain Analysis',
      sentiment: 'Bullish'
    },
    {
      title: 'Ordinals Market Consolidation',
      description: 'Ordinals market entering consolidation phase after recent rally, with trading volumes normalizing and price discovery stabilizing across collections.',
      impact: 'Low',
      assets: ['Ordinals'],
      source: 'Market Analysis',
      sentiment: 'Neutral'
    }
  ];

  // Create more recent timestamps for better relevance
  return insights.map((insight, index) => ({
    id: `INS-${index + 1}`,
    title: insight.title,
    description: insight.description,
    impact: insight.impact as 'High' | 'Medium' | 'Low',
    assets: insight.assets,
    source: insight.source,
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 43200000)).toISOString(), // Within the last 12 hours
    sentiment: insight.sentiment as 'Bullish' | 'Bearish' | 'Neutral'
  }));
}

// Função principal para gerar todos os dados
export function generateTradingData(): TradingData {
  return {
    arbitrageOpportunities: generateArbitrageOpportunities(),
    smcTradeSetups: generateSmcTradeSetups(),
    neuralMetrics: generateNeuralMetrics(),
    marketInsights: generateMarketInsights(),
    lastUpdated: new Date().toISOString()
  };
}

// Singleton para manter os dados consistentes entre chamadas
let tradingDataInstance: TradingData | null = null;

export function getTradingData(): TradingData {
  if (!tradingDataInstance) {
    tradingDataInstance = generateTradingData();
  }
  return tradingDataInstance;
}

// Função para atualizar os dados (simula uma atualização real)
export function refreshTradingData(): TradingData {
  // Atualiza apenas alguns dados aleatoriamente para simular mudanças parciais
  if (tradingDataInstance) {
    // Atualiza algumas oportunidades de arbitragem
    const updatedArbitrageOpportunities = [...tradingDataInstance.arbitrageOpportunities];
    for (let i = 0; i < Math.min(3, updatedArbitrageOpportunities.length); i++) {
      const randomIndex = Math.floor(Math.random() * updatedArbitrageOpportunities.length);
      const opportunity = updatedArbitrageOpportunities[randomIndex];

      // Atualiza alguns campos
      updatedArbitrageOpportunities[randomIndex] = {
        ...opportunity,
        percentageDifference: opportunity.percentageDifference * (1 + (Math.random() * 0.2 - 0.1)),
        estimatedProfit: opportunity.estimatedProfit * (1 + (Math.random() * 0.2 - 0.1)),
        confidence: Math.min(99, Math.max(70, opportunity.confidence + (Math.random() * 10 - 5))),
        status: Math.random() > 0.7 ?
          (opportunity.status === 'New' ? 'Active' :
           opportunity.status === 'Active' ? 'Closing' :
           opportunity.status === 'Closing' ? 'Expired' : 'New') :
          opportunity.status,
        timestamp: new Date().toISOString()
      };
    }

    // Atualiza alguns setups SMC
    const updatedSmcTradeSetups = [...tradingDataInstance.smcTradeSetups];
    for (let i = 0; i < Math.min(2, updatedSmcTradeSetups.length); i++) {
      const randomIndex = Math.floor(Math.random() * updatedSmcTradeSetups.length);
      const setup = updatedSmcTradeSetups[randomIndex];

      // Atualiza alguns campos
      updatedSmcTradeSetups[randomIndex] = {
        ...setup,
        confidence: Math.min(99, Math.max(70, setup.confidence + (Math.random() * 10 - 5))),
        status: Math.random() > 0.7 ?
          (setup.status === 'Pending' ? 'Active' :
           setup.status === 'Active' ? 'Triggered' :
           setup.status === 'Triggered' ? 'Completed' :
           setup.status === 'Completed' ? 'Invalidated' : 'Pending') :
          setup.status,
        timestamp: new Date().toISOString()
      };
    }

    // Atualiza algumas métricas neurais
    const updatedNeuralMetrics = tradingDataInstance.neuralMetrics.map(metric => {
      const newValue = Math.max(0, Math.min(100, metric.value + (Math.random() * 10 - 5)));
      let interpretation = '';
      let trend: 'Up' | 'Down' | 'Neutral' = 'Neutral';

      if (newValue > 70) {
        interpretation = `Strong positive reading, indicating bullish momentum.`;
        trend = 'Up';
      } else if (newValue > 50) {
        interpretation = `Moderately positive, suggesting cautious optimism.`;
        trend = 'Up';
      } else if (newValue > 40) {
        interpretation = `Neutral reading, market in equilibrium.`;
        trend = 'Neutral';
      } else if (newValue > 20) {
        interpretation = `Moderately negative, suggesting caution.`;
        trend = 'Down';
      } else {
        interpretation = `Strong negative reading, indicating bearish pressure.`;
        trend = 'Down';
      }

      return {
        ...metric,
        value: newValue,
        interpretation,
        trend,
        confidence: Math.min(99, Math.max(70, metric.confidence + (Math.random() * 10 - 5)))
      };
    });

    // Atualiza o tradingDataInstance
    tradingDataInstance = {
      arbitrageOpportunities: updatedArbitrageOpportunities,
      smcTradeSetups: updatedSmcTradeSetups,
      neuralMetrics: updatedNeuralMetrics,
      marketInsights: tradingDataInstance.marketInsights, // Mantém os insights inalterados
      lastUpdated: new Date().toISOString()
    };
  } else {
    // Se não existir, cria uma nova instância
    tradingDataInstance = generateTradingData();
  }

  return tradingDataInstance;
}
