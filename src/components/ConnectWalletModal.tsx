"use client"

import { useState } from 'react'
import { useLaserEyes } from '../libs/lasereyes-mono/lib/providers/context'

const WALLETS = [
  { id: 'xverse', name: 'Xverse' },
  { id: 'unisat', name: 'Unisat' },
  { id: 'oyl', name: 'OYL Wallet' },
  { id: 'magiceden', name: 'Magic Eden' },
]

type Props = {
  open: boolean,
  onClose: () => void,
  premiumCollections: string[],
  onAccessChange: (hasAccess: boolean, nfts: any[]) => void
}

export function ConnectWalletModal({ open, onClose, premiumCollections, onAccessChange }: Props) {
  const { methods, client } = useLaserEyes()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleConnect(walletType: string) {
    setLoading(true)
    setError('')
    try {
      await methods.connect(walletType)
      let nfts: any[] = []
      let address = client?.address || (client && (await client.getAddress?.()))
      if (client?.ordinals && address) {
        nfts = await client.ordinals.getOrdinals(address)
      }
      const hasAccess = nfts.some(nft => premiumCollections.includes(nft.collectionId))
      onAccessChange(hasAccess, nfts)
      onClose()
    } catch (e) {
      setError('Erro ao conectar carteira.')
    }
    setLoading(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-[#222] rounded-lg p-6 w-full max-w-xs">
        <h2 className="text-xl font-bold mb-4 text-white">Escolha sua carteira</h2>
        <div className="space-y-2">
          {WALLETS.map(w => (
            <button
              key={w.id}
              className="w-full py-2 px-4 rounded bg-[#8B5CF6] hover:bg-[#7C4DFF] text-white font-semibold"
              onClick={() => handleConnect(w.id)}
              disabled={loading}
            >
              {w.name}
            </button>
          ))}
        </div>
        {error && <div className="text-red-400 mt-2">{error}</div>}
        <button className="mt-4 text-gray-400 hover:text-white" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  )
} 