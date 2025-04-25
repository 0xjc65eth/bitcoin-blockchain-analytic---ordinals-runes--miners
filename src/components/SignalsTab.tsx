import React from 'react';
import { useMarket } from '../contexts/MarketContext';
import { useMempool } from '../contexts/MempoolContext';
import { useWallet } from '../contexts/WalletContext';

export function SignalsTab() {
  const { marketData, loading: marketLoading } = useMarket();
  const { mempoolData, loading: mempoolLoading } = useMempool();
  const { hasPremiumAccess } = useWallet();

  if (marketLoading || mempoolLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Signals */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Market Signals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Buy Signal</h3>
            <p className="text-lg font-bold text-green-500">Strong</p>
            <p className="text-sm text-gray-400">Confidence: 85%</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Sell Signal</h3>
            <p className="text-lg font-bold text-red-500">Weak</p>
            <p className="text-sm text-gray-400">Confidence: 25%</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Hold Signal</h3>
            <p className="text-lg font-bold text-yellow-500">Neutral</p>
            <p className="text-sm text-gray-400">Confidence: 60%</p>
          </div>
        </div>
      </div>

      {/* Mempool Analysis */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Mempool Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Average Fee Rate</h3>
            <p className="text-lg font-bold text-blue-500">{mempoolData?.feeRate} sat/vB</p>
            <p className="text-sm text-gray-400">{mempoolData?.count} pending transactions</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Mempool Size</h3>
            <p className="text-lg font-bold text-purple-500">{mempoolData?.size} MB</p>
            <p className="text-sm text-gray-400">Current backlog</p>
          </div>
        </div>
      </div>

      {/* Price Predictions */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Price Predictions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">24h Prediction</h3>
            <p className="text-lg font-bold text-green-500">
              ${((marketData?.bitcoinPrice || 0) * 1.05).toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">+5% from current</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">7d Prediction</h3>
            <p className="text-lg font-bold text-yellow-500">
              ${((marketData?.bitcoinPrice || 0) * 1.12).toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">+12% from current</p>
          </div>
        </div>
      </div>

      {/* Premium Signals */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Premium Signals</h2>
        {hasPremiumAccess ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm">Entry Point</h3>
              <p className="text-lg font-bold text-green-500">$65,000</p>
              <p className="text-sm text-gray-400">Optimal buy price</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm">Target Price</h3>
              <p className="text-lg font-bold text-red-500">$68,000</p>
              <p className="text-sm text-gray-400">Take profit level</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">Connect wallet with eligible collection to access premium signals</p>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm">
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 
export default SignalsTab; 