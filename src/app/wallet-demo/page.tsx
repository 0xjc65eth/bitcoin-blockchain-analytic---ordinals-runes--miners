'use client'

import { PremiumExample } from '@/components/premium-example'
import { WalletConnectBasic } from '@/components/wallet-connect-basic'

export default function WalletDemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Wallet Connection & Premium Access Demo</h1>

      <div className="flex justify-end mb-6">
        <WalletConnectBasic />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <div className="p-6 border border-[#3D3D3D] rounded-lg bg-[#121212]">
          <ol className="list-decimal list-inside space-y-4 text-gray-300">
            <li>
              <span className="font-medium text-white">Connect Your Wallet:</span> Click the "Connect Wallet" button above to connect your Bitcoin wallet.
            </li>
            <li>
              <span className="font-medium text-white">Verification Process:</span> After connecting, the system automatically checks if you own any NFTs from our premium collections.
            </li>
            <li>
              <span className="font-medium text-white">Premium Access:</span> If you own a premium collection NFT, you'll see a "Premium Access" badge and gain access to exclusive content.
            </li>
            <li>
              <span className="font-medium text-white">Premium Collections:</span> The following collections grant premium access: OCM GENESIS, OCM KATOSHI PRIME, OCM KATOSHI CLASSIC, MULTIVERSO PASS, SEIZE CTRL, N0 0RDINARY KIND, BITCOIN PUPPETS, THE WIZARDS OF LORDS, YIELD HACKER PASS, STACK SATS.
            </li>
          </ol>
        </div>
      </div>

      <PremiumExample />

      <div className="mt-12 p-6 border border-[#3D3D3D] rounded-lg bg-[#121212]">
        <h2 className="text-xl font-bold mb-4">Technical Implementation</h2>
        <p className="text-gray-400 mb-4">
          This demo uses the LaserEyes wallet integration library to connect to Bitcoin wallets and verify Ordinals ownership.
          The implementation includes:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-400">
          <li>Wallet connection with multiple wallet support (UniSat, Xverse, Magic Eden, OYL, etc.)</li>
          <li>Automatic verification of premium collection ownership</li>
          <li>Real-time updates when wallet status changes</li>
          <li>Premium content gating based on NFT ownership</li>
          <li>Interactive UI with animations and visual feedback</li>
        </ul>
      </div>
    </div>
  )
}
