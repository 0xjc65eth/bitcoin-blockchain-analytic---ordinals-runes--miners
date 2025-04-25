'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { z } from 'zod';
import { fetchWithCache } from '../lib/api';

// Declaração de tipo para a propriedade bitcoin no objeto window
declare global {
  interface Window {
    bitcoin: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

interface WalletTransaction {
  id: string;
  type: 'send' | 'receive';
  asset: 'bitcoin' | 'ordinal' | 'rune';
  amount: number;
  timestamp: number;
  address: string;
  status: 'pending' | 'confirmed' | 'failed';
}

interface WalletBalance {
  bitcoin: number;
  ordinals: number;
  runes: number;
}

interface WalletContextType {
  walletAddress: string | null;
  balance: WalletBalance | null;
  transactions: WalletTransaction[];
  hasPremiumAccess: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  sendBitcoin: (address: string, amount: number) => Promise<string>;
  sendOrdinal: (address: string, ordinalId: string) => Promise<string>;
  sendRune: (address: string, runeId: string, amount: number) => Promise<string>;
  refreshBalance: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);

  const checkWalletConnection = () => {
    try {
      // Check if wallet address is stored in local storage
      const savedAddress = localStorage.getItem('walletAddress');
      if (savedAddress) {
        setWalletAddress(savedAddress);
        // Also set auto-connect flag
        localStorage.setItem('autoConnectWallet', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      return false;
    }
  };

  // Check for premium access
  const checkPremiumAccess = async () => {
    if (!walletAddress) return false;
    
    try {
      // In a real application, we would check the user's wallet for specific NFTs or balance requirements
      // For this example, we'll simulate a server check
      const response = await fetch(`/api/wallet/premium?address=${walletAddress}`);
      
      if (response.ok) {
        const data = await response.json();
        setHasPremiumAccess(data.isPremium);
        return data.isPremium;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking premium access:', error);
      return false;
    }
  };

  const connectWallet = async () => {
    try {
      // Check if window.bitcoin exists (Xverse, Unisat, Hiro, etc.)
      if (typeof window !== 'undefined' && 'bitcoin' in window) {
        // Simulate requesting connection from wallet
        console.log('Requesting connection to Bitcoin wallet...');
        
        // Simulate a wallet address for demo purposes
        // In real implementation, this would be the address returned by the wallet
        const address = 'bc1q3ghzvpp0l74q3ntu8actyt0qcvl2u273flg5rs';
        
        setWalletAddress(address);
        localStorage.setItem('walletAddress', address);
        localStorage.setItem('autoConnectWallet', 'true');
        
        // Fetch initial balance and transactions
        await refreshBalance();
        await refreshTransactions();
        await checkPremiumAccess();
        
        return;
      }
      
      // If no wallet is available, show an alert
      alert('No Bitcoin wallet detected. Please install a compatible wallet extension.');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setBalance(null);
    setTransactions([]);
    setHasPremiumAccess(false);
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('autoConnectWallet');
  };

  const refreshBalance = async () => {
    if (!walletAddress) return;
    
    try {
      // In a real app, we would query the wallet or API for balance
      // For this demo, we'll simulate a response
      const mockBalance: WalletBalance = {
        bitcoin: 0.015,
        ordinals: 3,
        runes: 150
      };
      
      setBalance(mockBalance);
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  };

  const refreshTransactions = async () => {
    if (!walletAddress) return;
    
    try {
      // In a real app, we would fetch transactions from an API
      // For this demo, we'll use mock data
      const mockTransactions: WalletTransaction[] = [
        {
          id: 'tx1',
          type: 'receive',
          asset: 'bitcoin',
          amount: 0.005,
          timestamp: Date.now() - 86400000, // 1 day ago
          address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          status: 'confirmed'
        },
        {
          id: 'tx2',
          type: 'send',
          asset: 'bitcoin',
          amount: 0.002,
          timestamp: Date.now() - 43200000, // 12 hours ago
          address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
          status: 'confirmed'
        },
        {
          id: 'tx3',
          type: 'receive',
          asset: 'ordinal',
          amount: 1,
          timestamp: Date.now() - 21600000, // 6 hours ago
          address: 'bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcvxqfareaj98d9hk5uqq7sq0dq',
          status: 'confirmed'
        }
      ];
      
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error refreshing transactions:', error);
    }
  };

  const sendBitcoin = async (address: string, amount: number): Promise<string> => {
    if (!walletAddress || !balance) {
      throw new Error('Wallet not connected');
    }
    
    if (balance.bitcoin < amount) {
      throw new Error('Insufficient balance');
    }
    
    try {
      // In a real app, this would interact with the wallet to send the transaction
      // For this demo, we'll simulate a successful transaction
      
      // Create a new mock transaction
      const newTransaction: WalletTransaction = {
        id: `tx${Date.now().toString().slice(-6)}`,
        type: 'send',
        asset: 'bitcoin',
        amount,
        timestamp: Date.now(),
        address,
        status: 'pending'
      };
      
      // Update local state with the new transaction
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Update balance (optimistic update)
      setBalance(prev => {
        if (!prev) return null;
        return {
          ...prev,
          bitcoin: prev.bitcoin - amount
        };
      });
      
      // Simulate confirmation after 2 seconds
      setTimeout(() => {
        setTransactions(prev => prev.map(tx => 
          tx.id === newTransaction.id ? { ...tx, status: 'confirmed' } : tx
        ));
      }, 2000);
      
      return newTransaction.id;
    } catch (error) {
      console.error('Error sending Bitcoin:', error);
      throw new Error('Failed to send Bitcoin');
    }
  };

  const sendOrdinal = async (address: string, ordinalId: string): Promise<string> => {
    if (!walletAddress || !balance) {
      throw new Error('Wallet not connected');
    }
    
    if (balance.ordinals < 1) {
      throw new Error('No ordinals available');
    }
    
    try {
      // Similar to sendBitcoin, but for Ordinals
      const newTransaction: WalletTransaction = {
        id: `tx${Date.now().toString().slice(-6)}`,
        type: 'send',
        asset: 'ordinal',
        amount: 1,
        timestamp: Date.now(),
        address,
        status: 'pending'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      setBalance(prev => {
        if (!prev) return null;
        return {
          ...prev,
          ordinals: prev.ordinals - 1
        };
      });
      
      setTimeout(() => {
        setTransactions(prev => prev.map(tx => 
          tx.id === newTransaction.id ? { ...tx, status: 'confirmed' } : tx
        ));
      }, 2000);
      
      return newTransaction.id;
    } catch (error) {
      console.error('Error sending Ordinal:', error);
      throw new Error('Failed to send Ordinal');
    }
  };

  const sendRune = async (address: string, runeId: string, amount: number): Promise<string> => {
    if (!walletAddress || !balance) {
      throw new Error('Wallet not connected');
    }
    
    if (balance.runes < amount) {
      throw new Error('Insufficient runes');
    }
    
    try {
      // Similar to previous methods, but for Runes
      const newTransaction: WalletTransaction = {
        id: `tx${Date.now().toString().slice(-6)}`,
        type: 'send',
        asset: 'rune',
        amount,
        timestamp: Date.now(),
        address,
        status: 'pending'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      setBalance(prev => {
        if (!prev) return null;
        return {
          ...prev,
          runes: prev.runes - amount
        };
      });
      
      setTimeout(() => {
        setTransactions(prev => prev.map(tx => 
          tx.id === newTransaction.id ? { ...tx, status: 'confirmed' } : tx
        ));
      }, 2000);
      
      return newTransaction.id;
    } catch (error) {
      console.error('Error sending Rune:', error);
      throw new Error('Failed to send Rune');
    }
  };

  // Initial setup
  useEffect(() => {
    const isConnected = checkWalletConnection();
    
    if (isConnected) {
      refreshBalance();
      refreshTransactions();
      checkPremiumAccess();
    }
  }, []);

  // Set up periodic updates for balance and transactions
  useEffect(() => {
    if (!walletAddress) return;
    
    const balanceInterval = setInterval(refreshBalance, 30000); // 30 seconds
    const transactionsInterval = setInterval(refreshTransactions, 60000); // 60 seconds
    
    return () => {
      clearInterval(balanceInterval);
      clearInterval(transactionsInterval);
    };
  }, [walletAddress]);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        balance,
        transactions,
        hasPremiumAccess,
        connectWallet,
        disconnectWallet,
        sendBitcoin,
        sendOrdinal,
        sendRune,
        refreshBalance,
        refreshTransactions
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}; 