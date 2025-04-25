'use client';

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useMarket } from '../contexts/MarketContext';
import { useMempool } from '../contexts/MempoolContext';
import { useMiner } from '../contexts/MinerContext';
import { useNeural } from '../contexts/NeuralContext';
import { useWallet } from '../contexts/WalletContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DisclosureProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Disclosure: React.FC<DisclosureProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-gray-800/80 backdrop-blur-md rounded-lg overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-blue-400 font-orbitron text-xl hover:bg-gray-700/50 transition-colors"
      >
        <span>{title}</span>
        <span className="transform transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </button>
      <div
        className={`transition-all duration-300 ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

interface ChartDataType {
  price: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
      tension: number;
    }[];
  } | null;
  mempool: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
      tension: number;
    }[];
  } | null;
  hashrate: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
      tension: number;
    }[];
  } | null;
  sentiment: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
      tension: number;
    }[];
  } | null;
}

export const DashboardTab: React.FC = () => {
  const { bitcoinPrice, priceChange24h, ordinalsVolume, runesVolume } = useMarket();
  const { mempoolStats } = useMempool();
  const { avgHashrate, difficulty, blockTime } = useMiner();
  const { predictions, whaleActivity, sentimentTrend } = useNeural();
  const { hasPremiumAccess } = useWallet();

  const [chartData, setChartData] = useState<ChartDataType>({
    price: null,
    mempool: null,
    hashrate: null,
    sentiment: null,
  });

  useEffect(() => {
    // Mock data for charts
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const chartDataUpdate: ChartDataType = {
      price: {
        labels: dates,
        datasets: [{
          label: 'Bitcoin Price (USD)',
          data: [58000, 58200, 57900, 58500, 59000, 58800, 58000],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
        }],
      },
      mempool: {
        labels: dates,
        datasets: [{
          label: 'Mempool Size (MB)',
          data: [150, 145, 160, 155, 170, 165, 150],
          borderColor: '#EC4899',
          backgroundColor: 'rgba(236, 72, 153, 0.1)',
          fill: true,
          tension: 0.4,
        }],
      },
      hashrate: {
        labels: dates,
        datasets: [{
          label: 'Network Hashrate (EH/s)',
          data: [340, 345, 350, 348, 355, 360, 358],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
        }],
      },
      sentiment: {
        labels: dates,
        datasets: [{
          label: 'Market Sentiment',
          data: [0.7, 0.65, 0.8, 0.75, 0.85, 0.7, 0.78],
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true,
          tension: 0.4,
        }],
      },
    };

    setChartData(chartDataUpdate);
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#E5E7EB',
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: '#E5E7EB',
        bodyColor: '#E5E7EB',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: '#E5E7EB',
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: '#E5E7EB',
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div className="space-y-6">
      <h1 className="font-orbitron text-3xl text-blue-400 mb-6">CYPHER ORDI FUTURE Dashboard</h1>

      <Disclosure title="Network Overview" defaultOpen={true}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-900/50 p-4 rounded-lg group relative">
            <div className="absolute inset-0 bg-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            <h3 className="font-orbitron text-lg text-blue-400 mb-2">Mempool Stats</h3>
            <div className="space-y-1">
              <p className="font-firaCode text-sm">Size: {mempoolStats?.size || '...'} MB</p>
              <p className="font-firaCode text-sm">Transactions: {mempoolStats?.count || '...'}</p>
              <p className="font-firaCode text-sm">Fee Rate: {mempoolStats?.feeRate || '...'} sat/vB</p>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-blue-400 bg-gray-900/90 px-2 py-1 rounded">
                Unconfirmed transaction pool
              </span>
            </div>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-lg group relative">
            <div className="absolute inset-0 bg-pink-400/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            <h3 className="font-orbitron text-lg text-pink-400 mb-2">Mining Stats</h3>
            <div className="space-y-1">
              <p className="font-firaCode text-sm">Hashrate: {avgHashrate || '...'} EH/s</p>
              <p className="font-firaCode text-sm">Difficulty: {difficulty || '...'} T</p>
              <p className="font-firaCode text-sm">Block Time: {blockTime || '...'} min</p>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-pink-400 bg-gray-900/90 px-2 py-1 rounded">
                Network mining metrics
              </span>
            </div>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-lg group relative">
            <div className="absolute inset-0 bg-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            <h3 className="font-orbitron text-lg text-green-400 mb-2">Market Stats</h3>
            <div className="space-y-1">
              <p className="font-firaCode text-sm">Price: ${bitcoinPrice?.toLocaleString() || '...'}</p>
              <p className={`font-firaCode text-sm ${
                (priceChange24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                24h: {(priceChange24h || 0) >= 0 ? '+' : ''}{priceChange24h?.toFixed(2) || '...'}%
              </p>
              <p className="font-firaCode text-sm">Volume: {((ordinalsVolume || 0) + (runesVolume || 0))?.toFixed(2) || '...'} BTC</p>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-green-400 bg-gray-900/90 px-2 py-1 rounded">
                Current market status
              </span>
            </div>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-lg group relative">
            <div className="absolute inset-0 bg-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            <h3 className="font-orbitron text-lg text-yellow-400 mb-2">Predictions</h3>
            <div className="space-y-1">
              {predictions?.length ? (
                predictions.slice(0, 3).map((pred, i) => (
                  <p key={i} className="font-firaCode text-sm">
                    {pred.type}: {pred.value} ({pred.confidence}%)
                  </p>
                ))
              ) : (
                <p className="font-firaCode text-sm text-gray-400">No predictions available</p>
              )}
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-yellow-400 bg-gray-900/90 px-2 py-1 rounded">
                AI-powered forecasts
              </span>
            </div>
          </div>
        </div>
      </Disclosure>

      <Disclosure title="Market Trends" defaultOpen={true}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900/50 p-4 rounded-lg h-[300px]">
            <h3 className="font-orbitron text-lg text-blue-400 mb-4">Bitcoin Price (7d)</h3>
            {chartData.price && <Line data={chartData.price} options={chartOptions} />}
          </div>
          <div className="bg-gray-900/50 p-4 rounded-lg h-[300px]">
            <h3 className="font-orbitron text-lg text-pink-400 mb-4">Mempool Size (7d)</h3>
            {chartData.mempool && <Line data={chartData.mempool} options={chartOptions} />}
          </div>
          <div className="bg-gray-900/50 p-4 rounded-lg h-[300px]">
            <h3 className="font-orbitron text-lg text-green-400 mb-4">Network Hashrate (7d)</h3>
            {chartData.hashrate && <Line data={chartData.hashrate} options={chartOptions} />}
          </div>
          <div className="bg-gray-900/50 p-4 rounded-lg h-[300px]">
            <h3 className="font-orbitron text-lg text-yellow-400 mb-4">Market Sentiment (7d)</h3>
            {chartData.sentiment && <Line data={chartData.sentiment} options={chartOptions} />}
          </div>
        </div>
      </Disclosure>

      {hasPremiumAccess ? (
        <Disclosure title="Whale Activity">
          <div className="space-y-4">
            {whaleActivity?.length ? (
              whaleActivity.map((activity, index) => (
                <div key={index} className="bg-gray-900/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🐋</span>
                    <div className="flex-1">
                      <p className="font-firaCode text-sm">
                        Bought {activity.items} {activity.collection} for {activity.amount} BTC
                      </p>
                      <p className="font-firaCode text-xs text-gray-400">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No recent whale activity</p>
            )}
          </div>
        </Disclosure>
      ) : (
        <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-lg text-center">
          <h3 className="font-orbitron text-xl text-pink-400 mb-4">Premium Features Locked</h3>
          <p className="text-gray-300 mb-4">
            Upgrade to premium to access whale activity insights and advanced market signals.
          </p>
          <p className="text-sm text-gray-400">
            Available to holders of: OCM Genesis, OCM Katoshis, Seize Ctrl, and other eligible collections.
          </p>
        </div>
      )}
    </div>
  );
}; 