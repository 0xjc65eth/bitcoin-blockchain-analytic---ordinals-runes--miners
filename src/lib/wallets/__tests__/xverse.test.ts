import { XverseWallet } from '../xverse';

describe('XverseWallet', () => {
  let wallet: XverseWallet;
  const mockXverse = {
    requestAccounts: jest.fn(),
    getAccounts: jest.fn(),
    getNetwork: jest.fn(),
    signMessage: jest.fn(),
    getBalance: jest.fn(),
  };

  beforeEach(() => {
    (window as any).xverse = mockXverse;
    wallet = new XverseWallet();
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw error if Xverse wallet is not found', () => {
      (window as any).xverse = undefined;
      expect(() => new XverseWallet()).toThrow('Xverse wallet not found');
    });

    it('should initialize successfully if Xverse wallet is found', () => {
      expect(() => new XverseWallet()).not.toThrow();
    });
  });

  describe('connect', () => {
    it('should call requestAccounts', async () => {
      await wallet.connect();
      expect(mockXverse.requestAccounts).toHaveBeenCalled();
    });

    it('should throw error if requestAccounts fails', async () => {
      mockXverse.requestAccounts.mockRejectedValue(new Error('Failed'));
      await expect(wallet.connect()).rejects.toThrow('Failed to connect to Xverse wallet');
    });
  });

  describe('getAddress', () => {
    it('should return first account address', async () => {
      const mockAddress = 'bc1q...';
      mockXverse.getAccounts.mockResolvedValue([mockAddress]);
      const address = await wallet.getAddress();
      expect(address).toBe(mockAddress);
    });

    it('should throw error if no accounts found', async () => {
      mockXverse.getAccounts.mockResolvedValue([]);
      await expect(wallet.getAddress()).rejects.toThrow('No accounts found');
    });
  });

  describe('getNetwork', () => {
    it('should return network', async () => {
      const mockNetwork = 'mainnet';
      mockXverse.getNetwork.mockResolvedValue(mockNetwork);
      const network = await wallet.getNetwork();
      expect(network).toBe(mockNetwork);
    });
  });

  describe('signMessage', () => {
    it('should sign message', async () => {
      const mockSignature = 'signature';
      mockXverse.signMessage.mockResolvedValue(mockSignature);
      const signature = await wallet.signMessage('test');
      expect(signature).toBe(mockSignature);
    });
  });

  describe('getBalance', () => {
    it('should return balance', async () => {
      const mockBalance = 1000;
      mockXverse.getBalance.mockResolvedValue(mockBalance);
      const balance = await wallet.getBalance();
      expect(balance).toBe(mockBalance);
    });
  });
}); 