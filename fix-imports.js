const fs = require('fs');
const path = require('path');

// Lista de páginas e componentes a serem criados
const componentsToCreate = [
  {
    page: 'direct-demo',
    component: 'wallet-connect-direct',
    content: `'use client'

import React, { useState } from 'react'

export function WalletConnectDirect() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')

  const connectWallet = () => {
    // Simulação de conexão de carteira
    setIsConnected(true)
    setWalletAddress('bc1q...xyz')
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress('')
  }

  return (
    <div className="bg-gradient-to-br from-[#181F3A] to-[#2A3A5A] border-none shadow-xl p-6 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">Wallet Connect Direct</h2>

      {!isConnected ? (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Connected Wallet:</span>
            <span className="text-white font-medium">{walletAddress}</span>
          </div>

          <button
            onClick={disconnectWallet}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}`
  },
  {
    page: 'mock-demo',
    component: 'wallet-connect-mock',
    content: `'use client'

import React, { useState } from 'react'

export function WalletConnectMock() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')

  const connectWallet = () => {
    // Simulação de conexão de carteira
    setIsConnected(true)
    setWalletAddress('bc1q...xyz')
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress('')
  }

  return (
    <div className="bg-gradient-to-br from-[#181F3A] to-[#2A3A5A] border-none shadow-xl p-6 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">Wallet Connect Mock</h2>

      {!isConnected ? (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Connect Wallet (Mock)
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Connected Wallet:</span>
            <span className="text-white font-medium">{walletAddress}</span>
          </div>

          <button
            onClick={disconnectWallet}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}`
  },
  {
    page: 'mock-demo',
    component: 'premium-content-mock',
    content: `'use client'

import React from 'react'
import { Card, Title, Text } from '@tremor/react'

export function PremiumContentMock() {
  return (
    <Card className="bg-gradient-to-br from-[#181F3A] to-[#2A3A5A] border-none shadow-xl p-6">
      <Title className="text-white text-xl mb-4">Premium Content (Mock)</Title>
      <div className="space-y-4">
        <Text className="text-gray-400">
          This is a mock of premium content that would be shown to users who have connected their wallet and own specific NFTs.
        </Text>
        <div className="bg-[#F7931A]/10 p-4 rounded-lg border border-[#F7931A]/20">
          <Text className="text-white font-medium">Premium Analysis</Text>
          <Text className="text-gray-400 text-sm mt-2">
            This section would contain premium analysis and insights.
          </Text>
        </div>
      </div>
    </Card>
  )
}`
  },
  {
    page: 'app',
    component: 'error-fallback',
    content: `'use client'

import React from 'react'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto my-8">
      <h2 className="text-xl font-bold text-red-800 mb-2">Something went wrong</h2>
      <div className="bg-white p-4 rounded border border-red-100 mb-4">
        <p className="text-red-600 font-mono text-sm overflow-auto">{error.message}</p>
      </div>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}`
  },
  {
    page: 'legal',
    component: 'ui/card',
    content: `'use client'

import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={\`bg-white rounded-lg shadow-md p-6 \${className}\`}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: CardProps) {
  return (
    <div className={\`pb-4 border-b border-gray-200 \${className}\`}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }: CardProps) {
  return (
    <h3 className={\`text-xl font-bold \${className}\`}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = '' }: CardProps) {
  return (
    <p className={\`text-gray-500 text-sm \${className}\`}>
      {children}
    </p>
  )
}

export function CardContent({ children, className = '' }: CardProps) {
  return (
    <div className={\`py-4 \${className}\`}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '' }: CardProps) {
  return (
    <div className={\`pt-4 border-t border-gray-200 \${className}\`}>
      {children}
    </div>
  )
}`
  },
  {
    page: 'miners',
    component: 'header',
    content: `'use client'

import React from 'react'

export function Header() {
  return (
    <header className="bg-[#0F172A] border-b border-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-white">Bitcoin Analytics</h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="text-gray-300 hover:text-white">Dashboard</a>
          <a href="/miners" className="text-gray-300 hover:text-white">Miners</a>
          <a href="/ordinals" className="text-gray-300 hover:text-white">Ordinals</a>
        </nav>
      </div>
    </header>
  )
}`
  },
  {
    page: 'miners',
    component: 'navbar',
    content: `'use client'

import React from 'react'

export function Navbar() {
  return (
    <nav className="bg-[#1E293B] py-3">
      <div className="container mx-auto px-4">
        <ul className="flex space-x-6 overflow-x-auto pb-2">
          <li>
            <a
              href="/"
              className="text-gray-300 hover:text-white whitespace-nowrap"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="/miners"
              className="text-blue-400 border-b-2 border-blue-400 pb-1 whitespace-nowrap"
            >
              Miners
            </a>
          </li>
          <li>
            <a
              href="/network"
              className="text-gray-300 hover:text-white whitespace-nowrap"
            >
              Network
            </a>
          </li>
          <li>
            <a
              href="/ordinals"
              className="text-gray-300 hover:text-white whitespace-nowrap"
            >
              Ordinals
            </a>
          </li>
          <li>
            <a
              href="/runes"
              className="text-gray-300 hover:text-white whitespace-nowrap"
            >
              Runes
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}`
  },
  {
    page: 'miners',
    component: 'enhanced-mining-card',
    content: `'use client'

import React from 'react'
import { Card, Title, Text } from '@tremor/react'

export function EnhancedMiningCard() {
  return (
    <Card className="bg-gradient-to-br from-[#181F3A] to-[#2A3A5A] border-none shadow-xl p-6">
      <Title className="text-white text-xl mb-4">Bitcoin Mining Statistics</Title>
      <div className="space-y-4">
        <Text className="text-gray-400">
          Mining statistics will be displayed here. This is a placeholder component.
        </Text>
        <div className="bg-[#F7931A]/10 p-4 rounded-lg border border-[#F7931A]/20">
          <Text className="text-white font-medium">Mining Pools Distribution</Text>
          <Text className="text-gray-400 text-sm mt-2">
            This section will show the distribution of mining power across different pools.
          </Text>
        </div>
        <div className="bg-[#F7931A]/10 p-4 rounded-lg border border-[#F7931A]/20">
          <Text className="text-white font-medium">Network Hashrate</Text>
          <Text className="text-gray-400 text-sm mt-2">
            This section will show the current network hashrate and historical trends.
          </Text>
        </div>
        <div className="bg-[#F7931A]/10 p-4 rounded-lg border border-[#F7931A]/20">
          <Text className="text-white font-medium">Difficulty Adjustment</Text>
          <Text className="text-gray-400 text-sm mt-2">
            This section will show information about the next difficulty adjustment.
          </Text>
        </div>
      </div>
    </Card>
  )
}`
  },
  {
    page: 'network',
    component: 'header',
    content: `'use client'

import React from 'react'

export function Header() {
  return (
    <header className="bg-[#0F172A] border-b border-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-white">Bitcoin Analytics</h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="text-gray-300 hover:text-white">Dashboard</a>
          <a href="/network" className="text-gray-300 hover:text-white">Network</a>
          <a href="/ordinals" className="text-gray-300 hover:text-white">Ordinals</a>
        </nav>
      </div>
    </header>
  )
}`
  },
  {
    page: 'network',
    component: 'enhanced-market-analysis-card',
    content: `'use client'

import React from 'react'
import { Card, Title, Text } from '@tremor/react'

export function EnhancedMarketAnalysisCard() {
  return (
    <Card className="bg-gradient-to-br from-[#181F3A] to-[#2A3A5A] border-none shadow-xl p-6">
      <Title className="text-white text-xl mb-4">Market Analysis</Title>
      <div className="space-y-4">
        <Text className="text-gray-400">
          Market analysis will be displayed here. This is a placeholder component.
        </Text>
        <div className="bg-[#F7931A]/10 p-4 rounded-lg border border-[#F7931A]/20">
          <Text className="text-white font-medium">Price Analysis</Text>
          <Text className="text-gray-400 text-sm mt-2">
            This section will show price analysis and trends.
          </Text>
        </div>
        <div className="bg-[#F7931A]/10 p-4 rounded-lg border border-[#F7931A]/20">
          <Text className="text-white font-medium">Volume Analysis</Text>
          <Text className="text-gray-400 text-sm mt-2">
            This section will show volume analysis and trends.
          </Text>
        </div>
      </div>
    </Card>
  )
}`
  },
  {
    page: 'network',
    component: 'enhanced-network-health-card',
    content: `'use client'

import React from 'react'
import { Card, Title, Text } from '@tremor/react'

export function EnhancedNetworkHealthCard() {
  return (
    <Card className="bg-gradient-to-br from-[#181F3A] to-[#2A3A5A] border-none shadow-xl p-6">
      <Title className="text-white text-xl mb-4">Network Health</Title>
      <div className="space-y-4">
        <Text className="text-gray-400">
          Network health metrics will be displayed here. This is a placeholder component.
        </Text>
        <div className="bg-[#F7931A]/10 p-4 rounded-lg border border-[#F7931A]/20">
          <Text className="text-white font-medium">Node Distribution</Text>
          <Text className="text-gray-400 text-sm mt-2">
            This section will show the distribution of nodes across the network.
          </Text>
        </div>
        <div className="bg-[#F7931A]/10 p-4 rounded-lg border border-[#F7931A]/20">
          <Text className="text-white font-medium">Transaction Throughput</Text>
          <Text className="text-gray-400 text-sm mt-2">
            This section will show transaction throughput metrics.
          </Text>
        </div>
      </div>
    </Card>
  )
}`
  }
];

// Função para criar diretórios recursivamente
function createDirectoryIfNotExists(dirPath) {
  const parts = dirPath.split(path.sep);
  let currentPath = '';

  for (const part of parts) {
    currentPath = path.join(currentPath, part);
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath);
      console.log(`Created directory: ${currentPath}`);
    }
  }
}

// Função para criar um componente
function createComponent(page, component, content) {
  const basePath = path.join('src', 'app');
  let componentDir;
  let componentPath;

  if (page === 'app') {
    // Componentes globais para o app
    componentDir = path.join(basePath, 'components');
    componentPath = path.join(componentDir, `${component}.tsx`);
  } else {
    // Componentes específicos da página
    componentDir = path.join(basePath, page, 'components', path.dirname(component));
    componentPath = path.join(basePath, page, 'components', `${component}.tsx`);
  }

  createDirectoryIfNotExists(componentDir);

  if (!fs.existsSync(componentPath)) {
    fs.writeFileSync(componentPath, content);
    console.log(`Created component: ${componentPath}`);
    return true;
  } else {
    console.log(`Component already exists: ${componentPath}`);
    return false;
  }
}

// Função para atualizar importações em um arquivo
function updateImports(filePath, componentName, newPath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Padrão para encontrar importações com @/components
  const importPattern = new RegExp(`import\\s+\\{\\s*([^}]*${componentName}[^}]*)\\}\\s+from\\s+['"]@/components.*['"]`, 'g');

  // Substituir importações
  const newContent = content.replace(importPattern, (match, importedComponents) => {
    return `import { ${importedComponents} } from '${newPath}'`;
  });

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated imports in: ${filePath}`);
    return true;
  } else {
    console.log(`No imports to update in: ${filePath}`);
    return false;
  }
}

// Criar componentes e atualizar importações
for (const { page, component, content } of componentsToCreate) {
  const created = createComponent(page, component, content);

  if (created) {
    // Atualizar importações na página correspondente
    let pagePath;
    let importPath;

    if (page === 'app') {
      // Para componentes globais
      pagePath = path.join('src', 'app', 'error.tsx');
      importPath = './components/error-fallback';
    } else {
      // Para componentes específicos da página
      pagePath = path.join('src', 'app', page, 'page.tsx');
      importPath = './components/' + component;
    }

    updateImports(pagePath, component.split('/').pop(), importPath);
  }
}

console.log('Component creation and import updates completed!');
