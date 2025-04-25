'use client';

import React from 'react';
import { MarketProvider } from '../contexts/MarketContext';
import { MempoolProvider } from '../contexts/MempoolContext';
import { MinerProvider } from '../contexts/MinerContext';
import { NeuralProvider } from '../contexts/NeuralContext';
import { WalletProvider } from '../contexts/WalletContext';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletProvider>
      <MarketProvider>
        <MempoolProvider>
          <MinerProvider>
            <NeuralProvider>
              {children}
            </NeuralProvider>
          </MinerProvider>
        </MempoolProvider>
      </MarketProvider>
    </WalletProvider>
  );
} 