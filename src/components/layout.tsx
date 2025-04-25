'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '../contexts/WalletContext';
import { useMarket } from '../contexts/MarketContext';
import { useMempool } from '../contexts/MempoolContext';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { walletAddress, connectWallet, disconnectWallet, balance } = useWallet();
  const { marketData } = useMarket();
  const { mempoolData } = useMempool();
  const pathname = usePathname();
  const [copySuccess, setCopySuccess] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/miners', label: 'Miners' },
    { path: '/ordinals', label: 'Ordinals' },
    { path: '/runes', label: 'Runes' },
    { path: '/signals', label: 'Signals' },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('bc1q3ghzvpp0l74q3ntu8actyt0qcvl2u273flg5rs');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  useEffect(() => {
    // Check if wallet should be auto-connected from local storage
    const shouldAutoConnect = localStorage.getItem('autoConnectWallet') === 'true';
    if (shouldAutoConnect && !walletAddress) {
      connectWallet();
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <header className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md z-10">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="font-orbitron text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              CYPHER ORDI FUTURE
            </h1>
          </Link>
          <div className="flex items-center space-x-4">
            {marketData && (
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-sm">
                  <span className="text-gray-400">BTC:</span> ${marketData.bitcoinPrice.toLocaleString()}
                  <span className={`ml-2 ${marketData.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {marketData.priceChange24h >= 0 ? '↑' : '↓'} {Math.abs(marketData.priceChange24h).toFixed(2)}%
                  </span>
                </div>
                {mempoolData && (
                  <div className="text-sm">
                    <span className="text-gray-400">Fee Rate:</span> {mempoolData.feeRate} sat/vB
                  </div>
                )}
              </div>
            )}
            {walletAddress ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col text-sm">
                  <span className="text-gray-300">
                    {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                  </span>
                  {balance && (
                    <span className="text-xs text-green-500">
                      {balance.bitcoin.toFixed(8)} BTC
                    </span>
                  )}
                </div>
                <button
                  onClick={disconnectWallet}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
        <nav className="container mx-auto p-4">
          <ul className="flex space-x-4 overflow-x-auto sm:space-x-6">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link href={link.path}>
                  <span className={`font-orbitron uppercase text-white hover:text-blue-400 border-b-2 ${
                    isActive(link.path) ? 'border-blue-400' : 'border-transparent hover:border-blue-400'
                  }`}>
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="flex-1 pt-32 container mx-auto p-4">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout; 