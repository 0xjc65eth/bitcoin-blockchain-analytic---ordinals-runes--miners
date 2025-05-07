/**
 * Mempool Data Types
 * 
 * This file defines the types for mempool data used in the Bitcoin Blockchain Analytics application.
 */

export interface MempoolData {
  timestamp: string;
  count: number;
  vsize: number;
  totalFees: number;
  feeRate: {
    fastestFee: number;
    halfHourFee: number;
    hourFee: number;
    economyFee: number;
    minimumFee: number;
  };
  transactions: MempoolTransaction[];
}

export interface MempoolTransaction {
  txid: string;
  fee: number;
  vsize: number;
  value: number;
  inputs: number;
  outputs: number;
  age: number; // seconds in mempool
  feeRate: number; // sats/vB
  isRBF: boolean;
}

export interface MempoolBlock {
  blockHeight: number;
  nTx: number;
  totalFees: number;
  medianFee: number;
  feeRange: [number, number, number, number, number, number, number];
}

export interface MempoolStats {
  pending: number;
  confirmed: number;
  totalFees24h: number;
  averageFeeRate24h: number;
  averageBlockSize24h: number;
  averageTransactionsPerBlock24h: number;
}
