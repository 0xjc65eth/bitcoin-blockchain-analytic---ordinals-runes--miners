import {
  createBackup,
  getBackups,
  getLatestBackup,
  restoreBackup,
  deleteBackup,
  deleteAllBackups,
  configureBackup,
  exportBackups,
  importBackups,
} from '../backup';

// Mock do localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

// Mock do console
const mockConsole = {
  log: jest.fn(),
  error: jest.fn(),
};

// Substituir localStorage e console globais
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
Object.defineProperty(window, 'console', { value: mockConsole });

describe('Backup System', () => {
  // Limpar mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  // Testar criação de backup
  test('should create a backup', () => {
    const data = { test: 'data' };
    const type = 'test';
    
    const backup = createBackup(data, type);
    
    expect(backup).toHaveProperty('timestamp');
    expect(backup).toHaveProperty('data', data);
    expect(backup).toHaveProperty('type', type);
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  // Testar obtenção de backups
  test('should get backups', () => {
    const mockBackups = [
      { timestamp: 1, data: {}, type: 'test1' },
      { timestamp: 2, data: {}, type: 'test2' },
    ];
    
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockBackups));
    
    const backups = getBackups();
    
    expect(backups).toEqual(mockBackups);
  });

  // Testar obtenção do backup mais recente
  test('should get latest backup', () => {
    const mockBackups = [
      { timestamp: 1, data: {}, type: 'test1' },
      { timestamp: 2, data: {}, type: 'test2' },
      { timestamp: 3, data: {}, type: 'test1' },
    ];
    
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockBackups));
    
    const latestBackup = getLatestBackup('test1');
    
    expect(latestBackup).toEqual(mockBackups[2]);
  });

  // Testar restauração de backup
  test('should restore backup', () => {
    const backup = { timestamp: 1, data: {}, type: 'test' };
    
    const result = restoreBackup(backup);
    
    expect(result).toBe(true);
  });

  // Testar exclusão de backup
  test('should delete backup', () => {
    const mockBackups = [
      { timestamp: 1, data: {}, type: 'test1' },
      { timestamp: 2, data: {}, type: 'test2' },
    ];
    
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockBackups));
    
    const result = deleteBackup(1);
    
    expect(result).toBe(true);
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  // Testar exclusão de todos os backups
  test('should delete all backups', () => {
    const result = deleteAllBackups();
    
    expect(result).toBe(true);
    expect(mockLocalStorage.removeItem).toHaveBeenCalled();
  });

  // Testar configuração de backup
  test('should configure backup', () => {
    const config = {
      enableAutoBackup: false,
      backupInterval: 1800000,
      maxBackups: 12,
      storageKey: 'custom_key',
    };
    
    configureBackup(config);
    
    // Verificar se a configuração foi aplicada
    const backup = createBackup({}, 'test');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('custom_key', expect.any(String));
  });

  // Testar exportação de backups
  test('should export backups', () => {
    const mockBackups = [
      { timestamp: 1, data: {}, type: 'test1' },
      { timestamp: 2, data: {}, type: 'test2' },
    ];
    
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockBackups));
    
    const exported = exportBackups();
    
    expect(exported).toBe(JSON.stringify(mockBackups, null, 2));
  });

  // Testar importação de backups
  test('should import backups', () => {
    const mockBackups = [
      { timestamp: 1, data: {}, type: 'test1' },
      { timestamp: 2, data: {}, type: 'test2' },
    ];
    
    const result = importBackups(JSON.stringify(mockBackups));
    
    expect(result).toBe(true);
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  // Testar importação de backups inválidos
  test('should handle invalid backup import', () => {
    const result = importBackups('invalid json');
    
    expect(result).toBe(false);
    expect(mockConsole.error).toHaveBeenCalled();
  });
}); 