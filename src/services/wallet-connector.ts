/**
 * Wallet Connector Service
 * 
 * Serviço para conectar com carteiras Bitcoin usando a biblioteca LaserEyes.
 * Gerencia conexão, autenticação e operações com carteiras.
 */

import {
  LaserEyesClient,
  createStores,
  createConfig,
  MAINNET,
  UNISAT,
  XVERSE,
  MAGIC_EDEN,
  OYL,
  LEATHER,
  WIZZ,
  PHANTOM,
  ORANGE,
  TEXT_PLAIN,
  BTC,
  RUNES
} from '@omnisat/lasereyes-core';

export type WalletType = 
  | typeof UNISAT
  | typeof XVERSE
  | typeof MAGIC_EDEN
  | typeof OYL
  | typeof LEATHER
  | typeof WIZZ
  | typeof PHANTOM
  | typeof ORANGE;

export interface WalletInfo {
  address: string;
  balance: number;
  network: string;
  connected: boolean;
  walletType: WalletType | null;
}

class WalletConnector {
  private client: LaserEyesClient;
  private walletInfo: WalletInfo = {
    address: '',
    balance: 0,
    network: MAINNET,
    connected: false,
    walletType: null
  };
  
  private listeners: Array<(walletInfo: WalletInfo) => void> = [];

  constructor() {
    // Criar stores e configuração para o cliente LaserEyes
    const stores = createStores();
    const config = createConfig({
      network: MAINNET,
      dataSources: {
        maestro: {
          apiKey: 'e227a764-b31b-43cf-a60c-be5daa50cd2c' // Ordiscan API key
        }
      }
    });
    
    // Inicializar o cliente
    this.client = new LaserEyesClient(stores, config);
    this.client.initialize();
    
    // Configurar listeners para mudanças de estado
    this.setupListeners();
  }
  
  /**
   * Configura listeners para mudanças de estado da carteira
   */
  private setupListeners(): void {
    // Listener para mudanças no estado da carteira
    this.client.$store.listen((state) => {
      const newWalletInfo: WalletInfo = {
        address: state.address || '',
        balance: state.balance ? Number(state.balance) : 0,
        network: state.network || MAINNET,
        connected: !!state.connected,
        walletType: state.walletType as WalletType || null
      };
      
      this.walletInfo = newWalletInfo;
      
      // Notificar listeners
      this.notifyListeners();
    });
  }
  
  /**
   * Notifica todos os listeners sobre mudanças no estado da carteira
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      listener(this.walletInfo);
    });
  }
  
  /**
   * Adiciona um listener para mudanças no estado da carteira
   */
  public addListener(listener: (walletInfo: WalletInfo) => void): void {
    this.listeners.push(listener);
  }
  
  /**
   * Remove um listener
   */
  public removeListener(listener: (walletInfo: WalletInfo) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }
  
  /**
   * Conecta a uma carteira específica
   */
  public async connect(walletType: WalletType): Promise<WalletInfo> {
    try {
      await this.client.connect(walletType);
      
      // Atualizar saldo
      await this.refreshBalance();
      
      return this.walletInfo;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw new Error('Failed to connect wallet');
    }
  }
  
  /**
   * Desconecta a carteira atual
   */
  public disconnect(): void {
    this.client.disconnect();
  }
  
  /**
   * Atualiza o saldo da carteira
   */
  public async refreshBalance(): Promise<number> {
    try {
      const balance = await this.client.getBalance();
      
      this.walletInfo.balance = Number(balance);
      this.notifyListeners();
      
      return this.walletInfo.balance;
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      throw new Error('Failed to refresh balance');
    }
  }
  
  /**
   * Envia Bitcoin para um endereço
   */
  public async sendBitcoin(toAddress: string, amount: number): Promise<string> {
    try {
      const txId = await this.client.send(BTC, {
        fromAddress: this.walletInfo.address,
        toAddress,
        amount,
        network: this.walletInfo.network
      });
      
      // Atualizar saldo após envio
      await this.refreshBalance();
      
      return txId;
    } catch (error) {
      console.error('Failed to send Bitcoin:', error);
      throw new Error('Failed to send Bitcoin');
    }
  }
  
  /**
   * Envia Runes para um endereço
   */
  public async sendRune(runeId: string, toAddress: string, amount: number): Promise<string> {
    try {
      const txId = await this.client.send(RUNES, {
        runeId,
        fromAddress: this.walletInfo.address,
        toAddress,
        amount,
        network: this.walletInfo.network
      });
      
      return txId;
    } catch (error) {
      console.error('Failed to send Rune:', error);
      throw new Error('Failed to send Rune');
    }
  }
  
  /**
   * Cria uma inscrição (Ordinal)
   */
  public async createInscription(content: string): Promise<string> {
    try {
      const contentBase64 = Buffer.from(content).toString('base64');
      const txId = await this.client.inscribe(contentBase64, TEXT_PLAIN);
      
      return txId;
    } catch (error) {
      console.error('Failed to create inscription:', error);
      throw new Error('Failed to create inscription');
    }
  }
  
  /**
   * Assina uma mensagem com a carteira
   */
  public async signMessage(message: string): Promise<string> {
    try {
      const signature = await this.client.signMessage(message);
      
      return signature;
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw new Error('Failed to sign message');
    }
  }
  
  /**
   * Retorna informações sobre a carteira conectada
   */
  public getWalletInfo(): WalletInfo {
    return this.walletInfo;
  }
  
  /**
   * Verifica se a carteira está conectada
   */
  public isConnected(): boolean {
    return this.walletInfo.connected;
  }
}

export const walletConnector = new WalletConnector();
