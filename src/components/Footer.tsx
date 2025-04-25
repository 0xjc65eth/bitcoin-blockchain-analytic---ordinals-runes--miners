import React, { useState } from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const [copySuccess, setCopySuccess] = useState(false);
  const address = 'bc1q3ghzvpp0l74q3ntu8actyt0qcvl2u273flg5rs';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  return (
    <footer className="bg-gray-800/80 backdrop-blur-md mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-orbitron text-blue-400 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/signals" className="hover:text-white transition-colors">
                  Market Signals
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-white transition-colors">
                  Collections
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-orbitron text-blue-400 mb-4">Support Development</h3>
            <div className="flex flex-col space-y-2">
              <p className="text-gray-400 text-sm break-all font-firaCode">
                {address}
              </p>
              <button
                onClick={copyToClipboard}
                className={`${
                  copySuccess ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                } px-4 py-2 rounded-lg text-sm transition-colors w-fit`}
              >
                {copySuccess ? 'Copied!' : 'Copy Address'}
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-orbitron text-blue-400 mb-4">Premium Access</h3>
            <p className="text-gray-400 text-sm mb-2">
              Holders of these collections have free access to all platform tools:
            </p>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>• OCM Katoshi Prime</li>
              <li>• OCM Katoshi Classic</li>
              <li>• OCM Genesis</li>
              <li>• Seize Ctrl</li>
              <li>• The Wizard of Lord</li>
              <li>• Bitcoin Puppets</li>
              <li>• Multiverso Pass</li>
              <li>• Stack Sats</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>© 2025 CYPHER ORDI FUTURE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 