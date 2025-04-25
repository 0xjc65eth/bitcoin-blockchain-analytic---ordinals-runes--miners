import { getCacheStats } from './cache';

// Níveis de log
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
}

// Interface para métricas de performance
export interface PerformanceMetrics {
  timestamp: number;
  component: string;
  operation: string;
  duration: number;
  memoryUsage?: {
    heapUsed: number;
    heapTotal: number;
    external: number;
  };
  cacheStats?: ReturnType<typeof getCacheStats>;
}

// Interface para logs
export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  component: string;
  data?: any;
  error?: Error;
  performanceMetrics?: PerformanceMetrics;
}

// Configuração do logger
interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enablePerformanceLogging: boolean;
  enableErrorReporting: boolean;
  maxLogEntries: number;
}

// Configuração padrão
const defaultConfig: LoggerConfig = {
  minLevel: LogLevel.INFO,
  enableConsole: true,
  enablePerformanceLogging: true,
  enableErrorReporting: true,
  maxLogEntries: 1000,
};

// Armazenamento de logs
let logEntries: LogEntry[] = [];
let performanceMetrics: PerformanceMetrics[] = [];

// Função para formatar o timestamp
const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toISOString();
};

// Função para formatar o nível de log
const formatLogLevel = (level: LogLevel): string => {
  return `[${level.padEnd(5)}]`;
};

// Função para formatar o componente
const formatComponent = (component: string): string => {
  return `[${component.padEnd(15)}]`;
};

// Função para formatar a mensagem de log
const formatLogMessage = (entry: LogEntry): string => {
  const { timestamp, level, component, message, data, error } = entry;
  
  let formattedMessage = `${formatTimestamp(timestamp)} ${formatLogLevel(level)} ${formatComponent(component)} ${message}`;
  
  if (data) {
    formattedMessage += `\nData: ${JSON.stringify(data, null, 2)}`;
  }
  
  if (error) {
    formattedMessage += `\nError: ${error.message}\nStack: ${error.stack}`;
  }
  
  return formattedMessage;
};

// Função para registrar logs
export const log = (
  level: LogLevel,
  component: string,
  message: string,
  data?: any,
  error?: Error
): void => {
  // Verificar se o nível de log é suficiente
  if (getLogLevelValue(level) < getLogLevelValue(defaultConfig.minLevel)) {
    return;
  }
  
  const entry: LogEntry = {
    timestamp: Date.now(),
    level,
    component,
    message,
    data,
    error,
  };
  
  // Adicionar ao armazenamento de logs
  logEntries.push(entry);
  
  // Limitar o número de logs armazenados
  if (logEntries.length > defaultConfig.maxLogEntries) {
    logEntries = logEntries.slice(-defaultConfig.maxLogEntries);
  }
  
  // Exibir no console se habilitado
  if (defaultConfig.enableConsole) {
    const formattedMessage = formatLogMessage(entry);
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(formattedMessage);
        break;
    }
  }
  
  // Enviar para serviço de relatório de erros se for um erro e estiver habilitado
  if (defaultConfig.enableErrorReporting && (level === LogLevel.ERROR || level === LogLevel.FATAL)) {
    reportError(entry);
  }
};

// Funções de conveniência para diferentes níveis de log
export const debug = (component: string, message: string, data?: any): void => {
  log(LogLevel.DEBUG, component, message, data);
};

export const info = (component: string, message: string, data?: any): void => {
  log(LogLevel.INFO, component, message, data);
};

export const warn = (component: string, message: string, data?: any): void => {
  log(LogLevel.WARN, component, message, data);
};

export const error = (component: string, message: string, data?: any, error?: Error): void => {
  log(LogLevel.ERROR, component, message, data, error);
};

export const fatal = (component: string, message: string, data?: any, error?: Error): void => {
  log(LogLevel.FATAL, component, message, data, error);
};

// Função para registrar métricas de performance
export const logPerformance = (metrics: PerformanceMetrics): void => {
  if (!defaultConfig.enablePerformanceLogging) {
    return;
  }
  
  // Adicionar ao armazenamento de métricas
  performanceMetrics.push(metrics);
  
  // Limitar o número de métricas armazenadas
  if (performanceMetrics.length > defaultConfig.maxLogEntries) {
    performanceMetrics = performanceMetrics.slice(-defaultConfig.maxLogEntries);
  }
  
  // Exibir no console se habilitado
  if (defaultConfig.enableConsole) {
    console.info(
      `[PERFORMANCE] ${formatTimestamp(metrics.timestamp)} ${formatComponent(metrics.component)} ${metrics.operation} - ${metrics.duration}ms`
    );
  }
};

// Função para obter logs
export const getLogs = (level?: LogLevel, component?: string): LogEntry[] => {
  let filteredLogs = [...logEntries];
  
  if (level) {
    filteredLogs = filteredLogs.filter(entry => entry.level === level);
  }
  
  if (component) {
    filteredLogs = filteredLogs.filter(entry => entry.component === component);
  }
  
  return filteredLogs;
};

// Função para obter métricas de performance
export const getPerformanceMetrics = (component?: string): PerformanceMetrics[] => {
  if (component) {
    return performanceMetrics.filter(metrics => metrics.component === component);
  }
  
  return [...performanceMetrics];
};

// Função para limpar logs
export const clearLogs = (): void => {
  logEntries = [];
};

// Função para limpar métricas de performance
export const clearPerformanceMetrics = (): void => {
  performanceMetrics = [];
};

// Função para configurar o logger
export const configureLogger = (config: Partial<LoggerConfig>): void => {
  Object.assign(defaultConfig, config);
};

// Função para obter o valor numérico de um nível de log
const getLogLevelValue = (level: LogLevel): number => {
  switch (level) {
    case LogLevel.DEBUG:
      return 0;
    case LogLevel.INFO:
      return 1;
    case LogLevel.WARN:
      return 2;
    case LogLevel.ERROR:
      return 3;
    case LogLevel.FATAL:
      return 4;
    default:
      return 0;
  }
};

// Função para relatar erros para um serviço externo
const reportError = (entry: LogEntry): void => {
  // Aqui você pode implementar a lógica para enviar erros para um serviço como Sentry, LogRocket, etc.
  // Por exemplo:
  // if (typeof window !== 'undefined' && window.Sentry) {
  //   window.Sentry.captureException(entry.error || new Error(entry.message), {
  //     extra: {
  //       component: entry.component,
  //       data: entry.data,
  //     },
  //   });
  // }
  
  // Por enquanto, apenas registramos no console
  console.error('Error reported:', entry);
};

// Exportar uma instância padrão do logger
export default {
  debug,
  info,
  warn,
  error,
  fatal,
  logPerformance,
  getLogs,
  getPerformanceMetrics,
  clearLogs,
  clearPerformanceMetrics,
  configureLogger,
}; 