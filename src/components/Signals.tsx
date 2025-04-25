'use client';

import React from 'react';
import Layout from './layout';
import { useNeural } from '../contexts/NeuralContext';
import { useMarket } from '../contexts/MarketContext';

export function Signals() {
  const { predictions, whaleActivity, sentimentTrend } = useNeural();
  const { bitcoinPrice, priceChange24h } = useMarket();

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="font-orbitron text-3xl text-blue-400 mb-6">Market Signals</h1>
        
        {/* Current Market Status */}
        <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-lg">
          <h3 className="text-lg font-medium text-blue-400 mb-4">Market Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400">Bitcoin Price</p>
              <p className="text-2xl font-bold">${bitcoinPrice?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400">24h Change</p>
              <p className={`text-2xl font-bold ${priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange24h >= 0 ? '+' : ''}{priceChange24h?.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-gray-400">Market Sentiment</p>
              <p className="text-2xl font-bold">{sentimentTrend?.current || 'Neutral'}</p>
            </div>
          </div>
        </div>

        {/* Predictions */}
        <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-lg">
          <h3 className="text-lg font-medium text-pink-400 mb-4">AI Predictions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {predictions?.map((pred, i) => (
              <div key={i} className="p-4 bg-gray-700/50 rounded-lg">
                <p className="text-gray-400">{pred.type}</p>
                <p className="text-2xl font-bold">{pred.value}</p>
                <p className="text-sm text-gray-500">Confidence: {pred.confidence}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Whale Activity */}
        <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-lg">
          <h3 className="text-lg font-medium text-green-400 mb-4">Whale Activity</h3>
          <div className="space-y-4">
            {whaleActivity?.map((activity, i) => (
              <div key={i} className="p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🐋</span>
                  <div>
                    <p className="font-medium">
                      {activity.type} {activity.amount} BTC
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
} 