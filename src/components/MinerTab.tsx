import React from 'react';
import { useMiner } from '../contexts/MinerContext';

interface MinerTabProps {
  activeTab: string;
}

const MinerTab: React.FC<MinerTabProps> = ({ activeTab }) => {
  const { minerData } = useMiner();

  if (activeTab !== 'miner') return null;

  return (
    <div className="space-y-6">
      {/* Mining Statistics */}
      <div className="card bg-gradient-to-br from-gray-800 to-gray-900">
        <h2 className="text-xl font-bold mb-4 text-white">Mining Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-400">Hash Rate</p>
            <p className="text-2xl font-bold text-white">{minerData?.hashRate} TH/s</p>
          </div>
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-400">Difficulty</p>
            <p className="text-2xl font-bold text-white">{minerData?.difficulty.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-400">Block Reward</p>
            <p className="text-2xl font-bold text-white">{minerData?.blockReward} BTC</p>
          </div>
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-400">Estimated Earnings</p>
            <p className="text-2xl font-bold text-white">{minerData?.estimatedEarnings.toFixed(8)} BTC/day</p>
          </div>
        </div>
      </div>

      {/* Mining Pool Information */}
      <div className="card bg-gradient-to-br from-gray-800 to-gray-900">
        <h2 className="text-xl font-bold mb-4 text-white">Pool Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-400">Pool Hash Rate</p>
            <p className="text-2xl font-bold text-white">{minerData?.poolHashRate} TH/s</p>
          </div>
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-400">Pool Fee</p>
            <p className="text-2xl font-bold text-white">{minerData?.poolFee}%</p>
          </div>
        </div>
      </div>

      {/* Mining Instructions */}
      <div className="card bg-gradient-to-br from-gray-800 to-gray-900">
        <h2 className="text-xl font-bold mb-4 text-white">Mining Instructions</h2>
        <div className="space-y-4 text-gray-300">
          <div className="flex items-start space-x-3">
            <span className="text-blue-400">1.</span>
            <p>
              Configure your miner with pool address:{' '}
              <code className="bg-gray-700 px-2 py-1 rounded text-sm">stratum+tcp://pool.cypherordi.com:3333</code>
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-blue-400">2.</span>
            <p>Use your Bitcoin address as username</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-blue-400">3.</span>
            <p>Password can be left blank or set to 'x'</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-blue-400">4.</span>
            <p>Payments are processed automatically when reaching 0.001 BTC</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinerTab; 