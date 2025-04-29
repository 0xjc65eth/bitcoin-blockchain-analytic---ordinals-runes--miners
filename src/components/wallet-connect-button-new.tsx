'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useLaserEyes } from '@omnisat/lasereyes-react'
import {
  UNISAT,
  XVERSE,
  MAGIC_EDEN,
  OYL
} from '@omnisat/lasereyes-core'
import { RiWallet3Line, RiCloseLine, RiCheckLine, RiLoader4Line } from 'react-icons/ri'

// Lista de coleções para verificar para acesso premium
const COLLECTIONS_TO_CHECK = [
  'OCM Genesis',
  'OCM Katoshi Prime',
  'OCM Katoshi Classic',
  'Multiverse Pass',
  'MULTIVERSE PASS',
  'Seize CTRL',
  'SEIZE CTRL',
  'No Ordinary Kind',
  'N0 0RDINARY KIND',
  'Bitcoin Puppets',
  'BITCOIN PUPPETS',
  'The Wizards of Lords',
  'THE WIZARDS OF LORDS',
  'Yield Hacker Pass',
  'YIELD HACKER PASS',
  'Stack Sats',
  'STACK SATS'
]

export function WalletConnectButton() {
  const {
    connect,
    disconnect,
    address,
    isConnected,
    isConnecting,
    getOrdinals
  } = useLaserEyes()

  // Declaração dos estados
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isHolder, setIsHolder] = useState(false)
  const [holderCollection, setHolderCollection] = useState<string | null>(null)
  const [availableWallets, setAvailableWallets] = useState<string[]>([])
  const [isBrowser, setIsBrowser] = useState(false)

  // Verificar se estamos no navegador para usar o portal
  useEffect(() => {
    setIsBrowser(true)
  }, [])

  // Verificar carteiras disponíveis
  useEffect(() => {
    const checkAvailableWallets = () => {
      // Verificar manualmente se cada carteira está disponível
      const isWalletAvailable = (walletId: string) => {
        if (typeof window === 'undefined') return false;

        try {
          switch (walletId) {
            case 'unisat':
              return !!window.unisat && typeof window.unisat.requestAccounts === 'function';
            case 'xverse':
              return !!window.xverse && typeof window.xverse.bitcoin !== 'undefined';
            case 'magic-eden':
              return !!window.magicEden && typeof window.magicEden.bitcoin !== 'undefined';
            case 'oyl':
              return !!window.oyl && typeof window.oyl.bitcoin !== 'undefined';
            default:
              return false;
          }
        } catch (error) {
          console.error('Error checking wallet availability:', error);
          return false;
        }
      };

      const walletIds = ['unisat', 'xverse', 'magic-eden', 'oyl'];
      const available = walletIds.filter(id => isWalletAvailable(id));

      console.log('Available wallets:', available);

      // Se nenhuma carteira estiver disponível, mostrar todas as opções
      if (available.length === 0) {
        setAvailableWallets(walletIds);
      } else {
        setAvailableWallets(available);
      }
    };

    if (typeof window !== 'undefined') {
      checkAvailableWallets();
    }
  }, [])

  // Verificar se o usuário possui Ordinals das coleções listadas
  const verifyOrdinals = async () => {
    if (!address) return

    try {
      setIsVerifying(true)

      // Buscar Ordinals do usuário
      const ordinals = await getOrdinals(address)
      console.log('User ordinals:', ordinals)

      // Verificar se algum Ordinal pertence às coleções listadas
      let found = false
      let foundCollection = null

      // Função para normalizar nomes de coleções para comparação
      const normalizeCollectionName = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]/g, '');
      };

      // Normalizar nomes das coleções que estamos procurando
      const normalizedCollectionsToCheck = COLLECTIONS_TO_CHECK.map(normalizeCollectionName);

      for (const ordinal of ordinals) {
        // Verificar em vários campos possíveis onde o nome da coleção pode estar

        // 1. Verificar no campo collection.name dos metadados
        if (ordinal.metadata && ordinal.metadata.collection && ordinal.metadata.collection.name) {
          const collectionName = ordinal.metadata.collection.name;
          const normalizedName = normalizeCollectionName(collectionName);

          if (normalizedCollectionsToCheck.some(name => normalizedName.includes(name)) ||
              COLLECTIONS_TO_CHECK.includes(collectionName)) {
            found = true;
            foundCollection = collectionName;
            break;
          }
        }

        // 2. Verificar no campo name dos metadados
        if (ordinal.metadata && ordinal.metadata.name) {
          const name = ordinal.metadata.name;
          const normalizedName = normalizeCollectionName(name);

          // Verificar se o nome contém alguma das coleções que estamos procurando
          for (const collection of COLLECTIONS_TO_CHECK) {
            if (name.includes(collection) || normalizedName.includes(normalizeCollectionName(collection))) {
              found = true;
              foundCollection = collection;
              break;
            }
          }
          if (found) break;
        }
      }

      console.log('Verification result:', { found, foundCollection });
      setIsHolder(found);
      setHolderCollection(foundCollection);
    } catch (error) {
      console.error('Error verifying ordinals:', error);
    } finally {
      setIsVerifying(false);
    }
  }

  // Verificar Ordinals quando o usuário conectar a carteira
  useEffect(() => {
    if (isConnected && address) {
      verifyOrdinals()
    } else {
      setIsHolder(false)
      setHolderCollection(null)
    }
  }, [isConnected, address])

  // Função para conectar carteira seguindo as recomendações oficiais do LaserEyes
  const handleConnect = async (walletId: string) => {
    try {
      let provider;

      switch (walletId) {
        case 'unisat':
          provider = UNISAT;
          break;
        case 'xverse':
          provider = XVERSE;
          break;
        case 'magic-eden':
          provider = MAGIC_EDEN;
          break;
        case 'oyl':
          provider = OYL;
          break;
        default:
          provider = UNISAT;
      }

      console.log(`Connecting to ${walletId} wallet...`);

      // Usar o hook para conectar
      await connect(provider);

      // Fechar o modal após a conexão bem-sucedida
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert(`Failed to connect wallet. Please make sure your wallet is installed and try again.`);
    }
  }

  // Função para desconectar carteira
  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }

  return (
    <div className="relative">
      {isConnected && address ? (
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-xs text-green-500 font-medium">Connected</span>
          </div>

          <button
            onClick={handleDisconnect}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all"
          >
            <span className="truncate max-w-[150px] font-medium">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            <RiCloseLine className="ml-2 w-4 h-4" />
          </button>

          {isHolder && holderCollection && (
            <div className="mt-2 p-3 bg-gradient-to-r from-purple-500/20 to-blue-700/20 border border-purple-500/30 rounded-lg text-center">
              <div className="flex items-center justify-center">
                <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-md text-xs font-bold text-white animate-pulse">
                  PREMIUM ACCESS
                </span>
              </div>
              <p className="text-blue-400 font-medium flex items-center justify-center mt-2">
                <RiCheckLine className="mr-1 w-5 h-5" />
                Verified {holderCollection} Holder
              </p>
              <p className="text-white text-sm mt-1">
                Thank you for supporting our project by holding {holderCollection}! You now have exclusive access to premium features and analytics.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {isConnecting && (
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-xs text-yellow-500 font-medium">Connecting...</span>
            </div>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="relative overflow-hidden group flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium"
            disabled={isConnecting}
          >
            {/* Efeito de brilho */}
            <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform -translate-x-full skew-x-12 group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>

            {isConnecting ? (
              <>
                <RiLoader4Line className="animate-spin mr-2 w-5 h-5" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <RiWallet3Line className="mr-2 w-5 h-5" />
                <span>Connect Bitcoin Wallet</span>
              </>
            )}
          </button>


        </div>
      )}

      {/* Modal de seleção de carteira - Usando Portal React para renderizar no nível mais alto do DOM */}
      {isModalOpen && isBrowser && createPortal(
        <div className="wallet-modal-overlay bg-black/80 animate-fadeIn">
          <div className="wallet-modal-content bg-gradient-to-b from-[#1D1D2D] to-[#2D2D3D] border border-[#4D4D6D] rounded-xl p-6 max-w-md w-full mx-4 animate-scaleIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Connect Bitcoin Wallet</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <RiCloseLine className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-4">
              {/* Unisat Wallet */}
              {availableWallets.includes('unisat') && (
                <button
                  onClick={() => handleConnect('unisat')}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#2D2D4D]/80 to-[#3D3D5D]/80 hover:from-[#3D3D6D] hover:to-[#4D4D7D] border border-[#5D5D8D]/30 rounded-lg transition-all duration-200"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#FF9900] rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold">U</span>
                    </div>
                    <div className="text-left">
                      <span className="text-white font-medium block">UniSat Wallet</span>
                      <span className="text-gray-400 text-xs">Most popular Bitcoin wallet</span>
                    </div>
                  </div>
                  <RiWallet3Line className="w-5 h-5 text-[#FF9900]" />
                </button>
              )}

              {/* Xverse Wallet */}
              {availableWallets.includes('xverse') && (
                <button
                  onClick={() => handleConnect('xverse')}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#2D2D4D]/80 to-[#3D3D5D]/80 hover:from-[#3D3D6D] hover:to-[#4D4D7D] border border-[#5D5D8D]/30 rounded-lg transition-all duration-200"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#5546FF] rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold">X</span>
                    </div>
                    <div className="text-left">
                      <span className="text-white font-medium block">Xverse Wallet</span>
                      <span className="text-gray-400 text-xs">Powerful Bitcoin & Stacks wallet</span>
                    </div>
                  </div>
                  <RiWallet3Line className="w-5 h-5 text-[#5546FF]" />
                </button>
              )}

              {/* Magic Eden Wallet */}
              {availableWallets.includes('magic-eden') && (
                <button
                  onClick={() => handleConnect('magic-eden')}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#2D2D4D]/80 to-[#3D3D5D]/80 hover:from-[#3D3D6D] hover:to-[#4D4D7D] border border-[#5D5D8D]/30 rounded-lg transition-all duration-200"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#E42575] rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold">ME</span>
                    </div>
                    <div className="text-left">
                      <span className="text-white font-medium block">Magic Eden</span>
                      <span className="text-gray-400 text-xs">NFT marketplace wallet</span>
                    </div>
                  </div>
                  <RiWallet3Line className="w-5 h-5 text-[#E42575]" />
                </button>
              )}

              {/* OYL Wallet */}
              {availableWallets.includes('oyl') && (
                <button
                  onClick={() => handleConnect('oyl')}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#2D2D4D]/80 to-[#3D3D5D]/80 hover:from-[#3D3D6D] hover:to-[#4D4D7D] border border-[#5D5D8D]/30 rounded-lg transition-all duration-200"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#00AAFF] rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold">OYL</span>
                    </div>
                    <div className="text-left">
                      <span className="text-white font-medium block">OYL Wallet</span>
                      <span className="text-gray-400 text-xs">Modern Bitcoin wallet</span>
                    </div>
                  </div>
                  <RiWallet3Line className="w-5 h-5 text-[#00AAFF]" />
                </button>
              )}
            </div>

            <div className="mt-6 text-xs text-gray-400 text-center p-3 bg-[#1D1D2D]/50 rounded-lg border border-[#3D3D5D]/30">
              <p>Don't have a wallet? Install one of the options above to continue.</p>
              <p className="mt-2">By connecting your wallet, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
