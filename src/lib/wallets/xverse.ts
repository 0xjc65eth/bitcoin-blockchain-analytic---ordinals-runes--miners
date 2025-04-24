export class XverseWallet {
  private wallet: any;

  constructor() {
    if (typeof window !== 'undefined' && (window as any).xverse) {
      this.wallet = (window as any).xverse;
    } else {
      throw new Error('Xverse wallet not found. Please install the Xverse extension.');
    }
  }

  async connect(): Promise<void> {
    try {
      await this.wallet.requestAccounts();
    } catch (error) {
      console.error('Failed to connect to Xverse wallet:', error);
      throw new Error('Failed to connect to Xverse wallet');
    }
  }

  async getAddress(): Promise<string> {
    try {
      const accounts = await this.wallet.getAccounts();
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }
      return accounts[0];
    } catch (error) {
      console.error('Failed to get address:', error);
      throw new Error('Failed to get wallet address');
    }
  }

  async getNetwork(): Promise<string> {
    try {
      return await this.wallet.getNetwork();
    } catch (error) {
      console.error('Failed to get network:', error);
      throw new Error('Failed to get network');
    }
  }

  async signMessage(message: string): Promise<string> {
    try {
      return await this.wallet.signMessage(message);
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw new Error('Failed to sign message');
    }
  }

  async getBalance(): Promise<number> {
    try {
      return await this.wallet.getBalance();
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw new Error('Failed to get wallet balance');
    }
  }
} 