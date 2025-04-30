'use client'

import { LaserEyesProvider } from '@omnisat/lasereyes-react'
import { MAINNET, UNISAT, XVERSE, MAGIC_EDEN, OYL } from '@omnisat/lasereyes-core'
import { ReactNode } from 'react'

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <LaserEyesProvider
      config={{
        network: MAINNET,
        walletProviders: [UNISAT, XVERSE, MAGIC_EDEN, OYL],
        autoConnect: true,
        dataSources: {
          maestro: {
            apiKey: 'e227a764-b31b-43cf-a60c-be5daa50cd2c' // Ordiscan API key
          }
        }
      }}
    >
      {children}
    </LaserEyesProvider>
  )
}
