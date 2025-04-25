'use client';

import React from 'react';
import Layout from './layout';
import { useMiner } from '../contexts/MinerContext';
import { useMempool } from '../contexts/MempoolContext';
import { useNeural } from '../contexts/NeuralContext';

export function Miners() {
  const { avgHashrate, difficulty, blockTime } = useMiner();
  const { mempoolStats } = useMempool();
  const { predictions } = useNeural();

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="font-orbitron text-3xl text-blue-400 mb-6">Mining Analytics</h1>
        
        {/* Mining Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-4">Network Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Hash Rate</p>
                <p className="text-2xl font-bold">{avgHashrate?.toLocaleString()} EH/s</p>
              </div>
              <div>
                <p className="text-gray-400">Difficulty</p>
                <p className="text-2xl font-bold">{difficulty?.toLocaleString()} T</p>
              </div>
              <div>
                <p className="text-gray-400">Block Time</p>
                <p className="text-2xl font-bold">{blockTime} min</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-lg">
            <h3 className="text-lg font-medium text-pink-400 mb-4">Mempool Status</h3>
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