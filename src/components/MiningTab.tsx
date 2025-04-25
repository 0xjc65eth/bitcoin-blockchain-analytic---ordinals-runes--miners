import React from 'react';
import { useMempool } from '../contexts/MempoolContext';
import { useWallet } from '../contexts/WalletContext';

export function MiningTab() {
  const { mempoolData, loading: mempoolLoading } = useMempool();
  const { hasPremiumAccess } = useWallet();

  if (mempoolLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mining Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">Current Block Height</h3>
          <p className="text-2xl font-bold">{mempoolData?.latestBlocks[0]?.height || 'N/A'}</p>
          <p className="text-sm text-gray-400">Last block: {mempoolData?.latestBlocks[0]?.timestamp ? new Date(mempoolData.latestBlocks[0].timestamp * 1000).toLocaleTimeString() : 'N/A'}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">Network Hash Rate</h3>
          <p className="text-2xl font-bold">450 EH/s</p>
          <p className="text-sm text-gray-400">Estimated</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">Next Difficulty Adjustment</h3>
          <p className="text-2xl font-bold">+5.2%</p>
          <p className="text-sm text-gray-400">In 3 days</p>
        </div>
      </div>

      {/* Mining Predictions */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Mining Predictions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Next Block Fee Rate</h3>
            <p className="text-lg font-bold text-blue-500">{mempoolData?.feeRate} sat/vB</p>
            <p className="text-sm text-gray-400">Based on current mempool</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Block Time Prediction</h3>
            <p className="text-lg font-bold text-green-500">9.8 minutes</p>
            <p className="text-sm text-gray-400">Next block estimate</p>
          </div>
        </div>
      </div>

      {/* Premium Mining Insights */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Premium Mining Insights</h2>
        {hasPremiumAccess ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm">Optimal Fee Rate</h3>
              <p className="text-lg font-bold text-yellow-500">15 sat/vB</p>
              <p className="text-sm text-gray-400">Recommended for next 3 blocks</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm">Mining Pool Analysis</h3>
              <p className="text-lg font-bold text-purple-500">Foundry USA</p>
              <p className="text-sm text-gray-400">Best performing pool</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">Connect wallet with eligible collection to access premium mining insights</p>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm">
              Connect Wallet
            </button>
          </div>
        )}
      </div>

      {/* Mining Statistics */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Mining Statistics</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm text-gray-400">Pool</th>
                <th className="px-4 py-2 text-left text-sm text-gray-400">Hash Rate</th>
                <th className="px-4 py-2 text-left text-sm text-gray-400">Blocks</th>
                <th className="px-4 py-2 text-left text-sm text-gray-400">Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr>
                <td className="px-4 py-2 text-sm">Foundry USA</td>
                <td className="px-4 py-2 text-sm">120 EH/s</td>
                <td className="px-4 py-2 text-sm">45</td>
                <td className="px-4 py-2 text-sm">1%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">Antpool</td>
                <td className="px-4 py-2 text-sm">95 EH/s</td>
                <td className="px-4 py-2 text-sm">38</td>
                <td className="px-4 py-2 text-sm">2%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm">F2Pool</td>
                <td className="px-4 py-2 text-sm">85 EH/s</td>
                <td className="px-4 py-2 text-sm">32</td>
                <td className="px-4 py-2 text-sm">2.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 