'use client'

import { useState } from 'react'
import { useLaserEyes } from '@omnisat/lasereyes-react'
import { UNISAT } from '@omnisat/lasereyes-core'

export default function WalletTestPage() {
  const { connect, disconnect, connected, address } = useLaserEyes()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      await connect(UNISAT)
      setIsConnecting(false)
    } catch (error) {
      console.error('Error connecting wallet:', error)
      setIsConnecting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Wallet Test Page</h1>
      
      <div className="p-6 border border-gray-300 rounded-lg">
        {connected ? (
          <div>
            <p className="mb-4">Connected: {address}</p>
            <button 
              onClick={disconnect}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button 
            onClick={handleConnect}
            disabled={isConnecting}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
    </div>
  )
}
