'use client';

import React from 'react';
import Layout from './layout';
import { useMarket } from '../contexts/MarketContext';
import { useMempool } from '../contexts/MempoolContext';
import { useNeural } from '../contexts/NeuralContext';

export function Runes() {
  const { runesVolume, runesPrice } = useMarket();
  const { mempoolStats } = useMempool();
  const { predictions } = useNeural();

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="font-orbitron text-3xl text-blue-400 mb-6">Runes Analytics</h1>
        
        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-4">Market Overview</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">24h Volume</p>
                <p className="text-2xl font-bold">{runesVolume?.toLocaleString()} BTC</p>
              </div>
              <div>
                <p className="text-gray-400">Average Price</p>
                <p className="text-2xl font-bold">{runesPrice?.toLocaleString()} sats</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-lg">
            <h3 className="text-lg font-medium text-pink-400 mb-4">Network Activity</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Pending Transactions</p>
                <p className="text-2xl font-bold">{mempoolStats?.count || 0}</p>
              </div>
              <div>
                <p className="text-gray-400">Average Fee Rate</p>
                <p className="text-2xl font-bold">{mempoolStats?.feeRate || 0} sat/vB</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-4">Predictions</h3>
            <div className="space-y-4">
              {predictions?.slice(0, 2).map((pred, i) => (
                <div key={i}>
                  <p className="text-gray-400">{pred.type}</p>
                  <p className="text-2xl font-bold">{pred.value}</p>
                  <p className="text-sm text-gray-500">Confidence: {pred.confidence}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional content */}
      </div>
    </Layout>
  );
} 