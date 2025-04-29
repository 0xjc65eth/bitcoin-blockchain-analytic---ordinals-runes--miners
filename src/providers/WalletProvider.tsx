'use client'

import { LaserEyesProvider } from '@omnisat/lasereyes-react'
import { MAINNET, createConfig } from '@omnisat/lasereyes-core'
import { ReactNode } from 'react'

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <LaserEyesProvider
      config={{
        network: MAINNET,
        // Configurações adicionais podem ser adicionadas aqui
      }}
    >
      {children}
    </LaserEyesProvider>
  )
}
