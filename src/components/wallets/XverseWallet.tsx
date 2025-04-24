import { useState } from 'react';
import { XverseWallet } from '@/lib/wallets/xverse';

interface XverseWalletProps {
  onConnect: (address: string) => void;
  onError: (error: string) => void;
}

export default function XverseWalletComponent({ onConnect, onError }: XverseWalletProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [wallet] = useState(new XverseWallet());

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await wallet.connect();
      const address = await wallet.getAddress();
      onConnect(address);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to connect to Xverse wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="card card-hover p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src="/xverse-logo.png"
            alt="Xverse Wallet"
            className="w-12 h-12"
          />
          <div>
            <h3 className="text-xl font-inter font-bold">Xverse Wallet</h3>
            <p className="text-gray-400 font-roboto-mono">Connect your Xverse wallet to get started</p>
          </div>
        </div>
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="bg-primary hover:bg-opacity-90 text-white px-6 py-2 rounded-lg font-inter transition-all duration-200 glow"
        >
          {isConnecting ? 'Connecting...' : 'Connect'}
        </button>
      </div>
    </div>
  );
} 