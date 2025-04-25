import { info, error } from './logger';

// Interface para dados de backup
export interface BackupData {
  timestamp: number;
  data: any;
  type: string;
}

// Interface para configuração de backup
interface BackupConfig {
  enableAutoBackup: boolean;
  backupInterval: number; // em milissegundos
  maxBackups: number;
  storageKey: string;
}

// Configuração padrão
const defaultConfig: BackupConfig = {
  enableAutoBackup: true,
  backupInterval: 3600000, // 1 hora
  maxBackups: 24, // 24 backups (1 dia)
  storageKey: 'cypher_ordi_future_backup',
};

// Função para criar um backup
export const createBackup = (data: any, type: string): BackupData => {
  const backup: BackupData = {
    timestamp: Date.now(),
    data,
    type,
  };
  
  // Salvar backup no localStorage
  saveBackup(backup);
  
  info('Backup', `Backup criado para ${type}`, { timestamp: backup.timestamp });
  
  return backup;
};

// Função para salvar um backup no localStorage
const saveBackup = (backup: BackupData): void => {
  try {
    // Obter backups existentes
    const backups = getBackups();
    
    // Adicionar novo backup
    backups.push(backup);
    
    // Limitar o número de backups
    if (backups.length > defaultConfig.maxBackups) {
      backups.splice(0, backups.length - defaultConfig.maxBackups);
    }
    
    // Salvar backups no localStorage
    localStorage.setItem(defaultConfig.storageKey, JSON.stringify(backups));
  } catch (err) {
    error('Backup', 'Erro ao salvar backup', null, err as Error);
  }
};

// Função para obter todos os backups
export const getBackups = (): BackupData[] => {
  try {
    const backupsJson = localStorage.getItem(defaultConfig.storageKey);
    
    if (!backupsJson) {
      return [];
    }
    
    return JSON.parse(backupsJson);
  } catch (err) {
    error('Backup', 'Erro ao obter backups', null, err as Error);
    return [];
  }
};

// Função para obter o backup mais recente
export const getLatestBackup = (type?: string): BackupData | null => {
  const backups = getBackups();
  
  if (backups.length === 0) {
    return null;
  }
  
  // Filtrar por tipo se especificado
  const filteredBackups = type
    ? backups.filter(backup => backup.type === type)
    : backups;
  
  if (filteredBackups.length === 0) {
    return null;
  }
  
  // Ordenar por timestamp (mais recente primeiro)
  filteredBackups.sort((a, b) => b.timestamp - a.timestamp);
  
  return filteredBackups[0];
};

// Função para restaurar um backup
export const restoreBackup = (backup: BackupData): boolean => {
  try {
    info('Backup', `Restaurando backup de ${backup.type}`, { timestamp: backup.timestamp });
    
    // Aqui você implementaria a lógica para restaurar os dados
    // Por exemplo, atualizar o estado da aplicação com os dados do backup
    
    return true;
  } catch (err) {
    error('Backup', 'Erro ao restaurar backup', null, err as Error);
    return false;
  }
};

// Função para excluir um backup
export const deleteBackup = (timestamp: number): boolean => {
  try {
    // Obter backups existentes
    const backups = getBackups();
    
    // Filtrar o backup a ser excluído
    const filteredBackups = backups.filter(backup => backup.timestamp !== timestamp);
    
    // Verificar se algum backup foi removido
    if (filteredBackups.length === backups.length) {
      return false;
    }
    
    // Salvar backups filtrados no localStorage
    localStorage.setItem(defaultConfig.storageKey, JSON.stringify(filteredBackups));
    
    info('Backup', 'Backup excluído', { timestamp });
    
    return true;
  } catch (err) {
    error('Backup', 'Erro ao excluir backup', null, err as Error);
    return false;
  }
};

// Função para excluir todos os backups
export const deleteAllBackups = (): boolean => {
  try {
    localStorage.removeItem(defaultConfig.storageKey);
    
    info('Backup', 'Todos os backups foram excluídos');
    
    return true;
  } catch (err) {
    error('Backup', 'Erro ao excluir todos os backups', null, err as Error);
    return false;
  }
};

// Função para configurar o backup
export const configureBackup = (config: Partial<BackupConfig>): void => {
  Object.assign(defaultConfig, config);
};

// Função para iniciar o backup automático
export const startAutoBackup = (data: any, type: string): void => {
  if (!defaultConfig.enableAutoBackup) {
    return;
  }
  
  // Criar backup inicial
  createBackup(data, type);
  
  // Configurar intervalo para backup automático
  const interval = setInterval(() => {
    createBackup(data, type);
  }, defaultConfig.backupInterval);
  
  // Limpar intervalo quando a página for fechada
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      clearInterval(interval);
    });
  }
};

// Função para exportar backups para um arquivo
export const exportBackups = (): string => {
  const backups = getBackups();
  
  return JSON.stringify(backups, null, 2);
};

// Função para importar backups de um arquivo
export const importBackups = (backupsJson: string): boolean => {
  try {
    const backups = JSON.parse(backupsJson);
    
    // Validar formato dos backups
    if (!Array.isArray(backups)) {
      throw new Error('Formato de backup inválido');
    }
    
    // Salvar backups no localStorage
    localStorage.setItem(defaultConfig.storageKey, JSON.stringify(backups));
    
    info('Backup', 'Backups importados com sucesso', { count: backups.length });
    
    return true;
  } catch (err) {
    error('Backup', 'Erro ao importar backups', null, err as Error);
    return false;
  }
};

// Exportar uma instância padrão do backup
export default {
  createBackup,
  getBackups,
  getLatestBackup,
  restoreBackup,
  deleteBackup,
  deleteAllBackups,
  configureBackup,
  startAutoBackup,
  exportBackups,
  importBackups,
}; 