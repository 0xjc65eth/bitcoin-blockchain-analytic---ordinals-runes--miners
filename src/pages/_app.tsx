'use client';

import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Layout from '../components/layout';
import { WalletProvider } from '../contexts/WalletContext';
import { MarketProvider } from '../contexts/MarketContext';
import { MempoolProvider } from '../contexts/MempoolContext';
import { CollectionsProvider } from '../contexts/CollectionsContext';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const logError = (error: ErrorEvent) => {
      const logMessage = `${new Date().toISOString()} - Runtime Error: ${error.message}\n`;
      console.error(logMessage);
    };
    window.addEventListener('error', logError);
    return () => window.removeEventListener('error', logError);
  }, []);

  return (
    <MarketProvider>
      <MempoolProvider>
        <CollectionsProvider>
          <WalletProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </WalletProvider>
        </CollectionsProvider>
      </MempoolProvider>
    </MarketProvider>
  );
}

export default MyApp; 