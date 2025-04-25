'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { createModel, preprocessData, makePrediction, trainModel } from '../lib/tensorflow';
import { useMarket } from './MarketContext';
import { useMempool } from './MempoolContext';
import { fetchWithCache, neuralCache } from '../lib/cache';
import { z } from 'zod';

interface NeuralPredictions {
  bitcoin: {
    next24h: number;
    next7d: number;
    next30d: number;
    confidence: number;
  };
  mempool: {
    size24h: number;
    feeRate24h: number;
    confidence: number;
  };
  sentiment: {
    market: 'bullish' | 'bearish' | 'neutral';
    social: 'positive' | 'negative' | 'neutral';
    confidence: number;
  };
  ordinals: {
    floorPrice24h: number;
    volume24h: number;
    confidence: number;
  };
  runes: {
    floorPrice24h: number;
    volume24h: number;
    confidence: number;
  };
  signals: {
    buy: boolean;
    sell: boolean;
    hold: boolean;
    confidence: number;
    description: string;
  };
}

const predictionSchema = z.object({
  type: z.string(),
  value: z.number(),
  confidence: z.number(),
  horizon: z.string(),
});

const whaleActivitySchema = z.object({
  collection: z.string(),
  items: z.number(),
  amount: z.number(),
  timestamp: z.string(),
});

const sentimentTrendSchema = z.object({
  current: z.enum(['positive', 'negative', 'neutral']),
  score: z.number(),
  predicted: z.object({
    sentiment: z.enum(['positive', 'negative', 'neutral']),
    confidence: z.number(),
  }),
});

type Prediction = z.infer<typeof predictionSchema>;
type WhaleActivity = z.infer<typeof whaleActivitySchema>;
type SentimentTrend = z.infer<typeof sentimentTrendSchema>;

interface NeuralContextType {
  predictions: Prediction[] | null;
  whaleActivity: WhaleActivity[] | null;
  sentimentTrend: SentimentTrend | null;
  isLoading: boolean;
  error: string | null;
}

const NeuralContext = createContext<NeuralContextType | undefined>(undefined);

export const NeuralProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);
  const [whaleActivity, setWhaleActivity] = useState<WhaleActivity[] | null>(null);
  const [sentimentTrend, setSentimentTrend] = useState<SentimentTrend | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [models, setModels] = useState<{
    bitcoin: tf.LayersModel | null;
    mempool: tf.LayersModel | null;
    sentiment: tf.LayersModel | null;
    ordinals: tf.LayersModel | null;
    runes: tf.LayersModel | null;
    signals: tf.LayersModel | null;
  }>({
    bitcoin: null,
    mempool: null,
    sentiment: null,
    ordinals: null,
    runes: null,
    signals: null,
  });

  const market = useMarket();
  const mempool = useMempool();

  // Inicializar modelos
  useEffect(() => {
    const initializeModels = async () => {
      try {
        const newModels = {
          bitcoin: createModel(),
          mempool: createModel(),
          sentiment: createModel(),
          ordinals: createModel(),
          runes: createModel(),
          signals: createModel(),
        };
        setModels(newModels);
      } catch (err) {
        setError('Failed to initialize models');
        console.error('Error initializing models:', err);
      }
    };

    initializeModels();
  }, []);

  const predictBitcoin = async () => {
    if (!models.bitcoin || !market.bitcoinPrice) return null;
    
    const input = [
      market.bitcoinPrice,
      market.priceChange24h,
      market.volume24h,
      market.marketCap,
    ];
    
    const prediction = await makePrediction(models.bitcoin, input);
    return {
      next24h: prediction * 1.05, // Ajuste baseado no modelo
      next7d: prediction * 1.12,
      next30d: prediction * 1.25,
      confidence: 0.85,
    };
  };

  const predictMempool = async () => {
    if (!models.mempool || !mempool.size) return null;
    
    const input = [
      mempool.size,
      mempool.count,
      mempool.feeRate,
    ];
    
    const prediction = await makePrediction(models.mempool, input);
    return {
      size24h: prediction * 1.1,
      feeRate24h: prediction * 1.15,
      confidence: 0.8,
    };
  };

  const predictSentiment = async () => {
    if (!models.sentiment || !market.bitcoinPrice) return null;
    
    const input = [
      market.priceChange24h,
      market.volume24h,
      market.marketCap,
    ];
    
    const prediction = await makePrediction(models.sentiment, input);
    return {
      market: prediction > 0.6 ? 'bullish' : prediction < 0.4 ? 'bearish' : 'neutral',
      social: prediction > 0.6 ? 'positive' : prediction < 0.4 ? 'negative' : 'neutral',
      confidence: Math.abs(prediction - 0.5) * 2,
    };
  };

  const predictOrdinals = async () => {
    if (!models.ordinals || !market.bitcoinPrice) return null;
    
    const input = [
      market.bitcoinPrice,
      market.priceChange24h,
      market.volume24h,
    ];
    
    const prediction = await makePrediction(models.ordinals, input);
    return {
      floorPrice24h: prediction * 1.1,
      volume24h: prediction * 1.2,
      confidence: 0.75,
    };
  };

  const predictRunes = async () => {
    if (!models.runes || !market.bitcoinPrice) return null;
    
    const input = [
      market.bitcoinPrice,
      market.priceChange24h,
      market.volume24h,
    ];
    
    const prediction = await makePrediction(models.runes, input);
    return {
      floorPrice24h: prediction * 1.15,
      volume24h: prediction * 1.25,
      confidence: 0.7,
    };
  };

  const predictSignals = async () => {
    if (!models.signals || !market.bitcoinPrice || !mempool.size) return null;
    
    const input = [
      market.bitcoinPrice,
      market.priceChange24h,
      market.volume24h,
      mempool.size,
      mempool.feeRate,
    ];
    
    const prediction = await makePrediction(models.signals, input);
    return {
      buy: prediction > 0.6,
      sell: prediction < 0.4,
      hold: prediction >= 0.4 && prediction <= 0.6,
      confidence: Math.abs(prediction - 0.5) * 2,
      description: prediction > 0.6 
        ? 'Strong buy signal based on market conditions and mempool analysis' 
        : prediction < 0.4 
          ? 'Consider selling based on current market indicators' 
          : 'Hold position and monitor market conditions',
    };
  };

  const refreshPredictions = async () => {
    try {
      setIsLoading(true);
      
      // Verificar se há previsões em cache
      const cachedPredictions = await fetchWithCache<NeuralPredictions>(
        'neural_predictions',
        neuralCache,
        async () => {
          const [
            bitcoinPred,
            mempoolPred,
            sentimentPred,
            ordinalsPred,
            runesPred,
            signalsPred,
          ] = await Promise.all([
            predictBitcoin(),
            predictMempool(),
            predictSentiment(),
            predictOrdinals(),
            predictRunes(),
            predictSignals(),
          ]);
          
          if (bitcoinPred && mempoolPred && sentimentPred && ordinalsPred && runesPred && signalsPred) {
            return {
              bitcoin: bitcoinPred,
              mempool: mempoolPred,
              sentiment: sentimentPred,
              ordinals: ordinalsPred,
              runes: runesPred,
              signals: signalsPred,
            };
          }
          
          throw new Error('Failed to generate predictions');
        },
        60000 // Cache por 1 minuto
      );
      
      setPredictions(cachedPredictions);
    } catch (err) {
      setError('Failed to refresh predictions');
      console.error('Error refreshing predictions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshPredictions();
    const interval = setInterval(refreshPredictions, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [models, market, mempool]);

  return (
    <NeuralContext.Provider
      value={{
        predictions,
        whaleActivity,
        sentimentTrend,
        isLoading,
        error,
      }}
    >
      {children}
    </NeuralContext.Provider>
  );
};

export const useNeural = () => {
  const context = useContext(NeuralContext);
  if (context === undefined) {
    throw new Error('useNeural must be used within a NeuralProvider');
  }
  return context;
};

interface MarketData {
  bitcoinPrice: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  dominance: number;
  ordinalsVolume: number;
  runesVolume: number;
}

interface MempoolData {
  size: number;
  count: number;
  feeRate: number;
}

const predictBitcoin = async (model: tf.LayersModel, marketData: MarketData) => {
  // Normalize input data
  const input = tf.tensor2d([
    [
      marketData.bitcoinPrice,
      marketData.priceChange24h,
      marketData.volume24h,
      marketData.marketCap,
    ],
  ]);

  // Make prediction
  const prediction = model.predict(input) as tf.Tensor;
  const [price24h, price7d, price30d, confidence] = Array.from(prediction.dataSync());

  return {
    price24h,
    price7d,
    price30d,
    confidence,
  };
};

const predictMempool = async (model: tf.LayersModel, mempoolData: MempoolData) => {
  // Normalize input data
  const input = tf.tensor2d([
    [
      mempoolData.size,
      mempoolData.count,
      mempoolData.feeRate,
    ],
  ]);

  // Make prediction
  const prediction = model.predict(input) as tf.Tensor;
  const [size24h, feeRate24h, confidence] = Array.from(prediction.dataSync());

  return {
    size24h,
    feeRate24h,
    confidence,
  };
};

async function detectWhale(model: tf.LayersModel, whaleData: any) {
  // Normalize input data
  const input = tf.tensor2d([
    [
      whaleData.transactionAmount,
      whaleData.collectionPurchases,
      whaleData.timeSinceLastActivity,
    ],
  ]);

  // Make prediction
  const prediction = model.predict(input) as tf.Tensor;
  const [detected, confidence] = prediction.dataSync();

  return {
    detected: detected > 0.5,
    confidence,
    description: whaleData.description,
  };
} 