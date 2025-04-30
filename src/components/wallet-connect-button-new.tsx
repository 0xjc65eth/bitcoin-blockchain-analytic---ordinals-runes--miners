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
      // Sempre mostrar todas as opções de carteira
      const walletIds = ['unisat', 'xverse', 'magic-eden', 'oyl'];
      setAvailableWallets(walletIds);
      console.log('Available wallets set to:', walletIds);
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

      // Emitir evento global para notificar outras partes da aplicação
      if (typeof window !== 'undefined') {
        const walletConnectedEvent = new CustomEvent('walletConnected', {
          detail: {
            address,
            isConnected: true
          }
        });
        window.dispatchEvent(walletConnectedEvent);
      }
    } else {
      setIsHolder(false)
      setHolderCollection(null)

      // Emitir evento de desconexão
      if (typeof window !== 'undefined') {
        const walletDisconnectedEvent = new CustomEvent('walletDisconnected');
        window.dispatchEvent(walletDisconnectedEvent);
      }
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
      console.log('Connection successful');

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
    <div className="relative z-50 wallet-connect-button">
      {isConnected && address ? (
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-2">
            <div className="w-3 h-3 bg-[#8B5CF6] rounded-full animate-pulse mr-2"></div>
            <span className="text-xs text-[#8B5CF6] font-medium">Connected</span>
          </div>

          <button
            onClick={handleDisconnect}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white rounded-md shadow-lg hover:from-[#7C4DEF] hover:to-[#5253E8] transition-all"
          >
            <span className="truncate max-w-[150px] font-medium">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            <RiCloseLine className="ml-2 w-4 h-4" />
          </button>

          {isHolder && holderCollection && (
            <div className="mt-2 p-3 bg-black border border-[#8B5CF6]/30 rounded-md text-center">
              <div className="flex items-center justify-center">
                <span className="px-2 py-1 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] rounded-sm text-xs font-bold text-white animate-pulse">
                  PREMIUM ACCESS
                </span>
              </div>
              <p className="text-[#8B5CF6] font-medium flex items-center justify-center mt-2">
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
              <div className="w-3 h-3 bg-[#8B5CF6] rounded-full animate-pulse mr-2"></div>
              <span className="text-xs text-[#8B5CF6] font-medium">Connecting...</span>
            </div>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="relative overflow-hidden group flex items-center px-5 py-2.5 bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#8B5CF6] text-white rounded-md shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
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
                <span>Connect Wallet</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Modal de seleção de carteira - Usando Portal React para renderizar no nível mais alto do DOM */}
      {isModalOpen && isBrowser && createPortal(
        <div className="wallet-modal-overlay bg-black/90 animate-fadeIn">
          <div className="wallet-modal-content bg-[#121212] border border-[#3D3D3D] rounded-lg p-6 max-w-md w-full mx-4 animate-scaleIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#8B5CF6] text-transparent bg-clip-text">CONNECT WALLET</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-300 transition-colors bg-[#2D2D2D] rounded-full w-8 h-8 flex items-center justify-center"
              >
                <RiCloseLine className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-4">
              {/* Xverse Wallet */}
              <button
                onClick={() => handleConnect('xverse')}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C4DEF] hover:to-[#5253E8] rounded-md transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center mr-3 border border-[#3D3D3D]">
                    <span className="text-white font-bold text-sm">X</span>
                  </div>
                  <span className="text-white font-medium">XVERSE</span>
                </div>
              </button>

              {/* Unisat Wallet */}
              <button
                onClick={() => handleConnect('unisat')}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C4DEF] hover:to-[#5253E8] rounded-md transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center mr-3 border border-[#3D3D3D]">
                    <span className="text-white font-bold text-sm">U</span>
                  </div>
                  <span className="text-white font-medium">UNISAT</span>
                </div>
              </button>

              {/* Magic Eden Wallet */}
              <button
                onClick={() => handleConnect('magic-eden')}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C4DEF] hover:to-[#5253E8] rounded-md transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center mr-3 border border-[#3D3D3D]">
                    <span className="text-white font-bold text-sm">ME</span>
                  </div>
                  <span className="text-white font-medium">MAGIC EDEN</span>
                </div>
              </button>

              {/* OYL Wallet */}
              <button
                onClick={() => handleConnect('oyl')}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C4DEF] hover:to-[#5253E8] rounded-md transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center mr-3 border border-[#3D3D3D]">
                    <span className="text-white font-bold text-sm">OYL</span>
                  </div>
                  <span className="text-white font-medium">OYL</span>
                </div>
              </button>
            </div>

            <div className="mt-6 text-xs text-gray-400 text-center">
              <p>By connecting your wallet, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
