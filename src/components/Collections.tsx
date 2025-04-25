'use client';

import React from 'react';
import Layout from './layout';
import { useMarket } from '../contexts/MarketContext';
import { useNeural } from '../contexts/NeuralContext';

export function Collections() {
  const { collections } = useMarket();
  const { predictions } = useNeural();

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="font-orbitron text-3xl text-blue-400 mb-6">Collections Analytics</h1>
        
        {/* Collections Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections?.map((collection, index) => (
            <div key={index} className="bg-gray-800/80 backdrop-blur-md p-6 rounded-lg">
              <h3 className="text-lg font-medium text-blue-400 mb-4">{collection.name}</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400">Floor Price</p>
                  <p className="text-2xl font-bold">{collection.floorPrice?.toLocaleString()} sats</p>
                </div>
                <div>
                  <p className="text-gray-400">Volume (24h)</p>
                  <p className="text-2xl font-bold">{collection.volume24h?.toLocaleString()} BTC</p>
                </div>
                <div>
                  <p className="text-gray-400">Items</p>
                  <p className="text-2xl font-bold">{collection.totalItems?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Market Predictions */}
        <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-lg">
          <h3 className="text-lg font-medium text-green-400 mb-4">Market Predictions</h3>
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
      </div>
    </Layout>
  );
} 