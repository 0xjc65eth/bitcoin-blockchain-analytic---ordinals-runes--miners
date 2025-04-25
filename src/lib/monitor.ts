import { logPerformance, PerformanceMetrics } from './logger';
import { getCacheStats } from './cache';

// Interface para métricas de API
export interface ApiMetrics {
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: number;
}

// Interface para métricas de renderização
export interface RenderMetrics {
  component: string;
  renderTime: number;
  timestamp: number;
}

// Interface para métricas de memória
export interface MemoryMetrics {
  heapUsed: number;
  heapTotal: number;
  external: number;
  timestamp: number;
}

// Armazenamento de métricas
let apiMetrics: ApiMetrics[] = [];
let renderMetrics: RenderMetrics[] = [];
let memoryMetrics: MemoryMetrics[] = [];

// Configuração do monitor
interface MonitorConfig {
  enableApiMonitoring: boolean;
  enableRenderMonitoring: boolean;
  enableMemoryMonitoring: boolean;
  maxMetricsEntries: number;
  memoryCheckInterval: number; // em milissegundos
}

// Configuração padrão
const defaultConfig: MonitorConfig = {
  enableApiMonitoring: true,
  enableRenderMonitoring: true,
  enableMemoryMonitoring: true,
  maxMetricsEntries: 1000,
  memoryCheckInterval: 60000, // 1 minuto
};

// Função para registrar métricas de API
export const logApiMetrics = (metrics: ApiMetrics): void => {
  if (!defaultConfig.enableApiMonitoring) {
    return;
  }
  
  // Adicionar ao armazenamento de métricas
  apiMetrics.push(metrics);
  
  // Limitar o número de métricas armazenadas
  if (apiMetrics.length > defaultConfig.maxMetricsEntries) {
    apiMetrics = apiMetrics.slice(-defaultConfig.maxMetricsEntries);
  }
  
  // Registrar no logger
  logPerformance({
    timestamp: metrics.timestamp,
    component: 'API',
    operation: `${metrics.method} ${metrics.endpoint}`,
    duration: metrics.responseTime,
  });
};

// Função para registrar métricas de renderização
export const logRenderMetrics = (metrics: RenderMetrics): void => {
  if (!defaultConfig.enableRenderMonitoring) {
    return;
  }
  
  // Adicionar ao armazenamento de métricas
  renderMetrics.push(metrics);
  
  // Limitar o número de métricas armazenadas
  if (renderMetrics.length > defaultConfig.maxMetricsEntries) {
    renderMetrics = renderMetrics.slice(-defaultConfig.maxMetricsEntries);
  }
  
  // Registrar no logger
  logPerformance({
    timestamp: metrics.timestamp,
    component: 'Render',
    operation: metrics.component,
    duration: metrics.renderTime,
  });
};

// Função para registrar métricas de memória
export const logMemoryMetrics = (metrics: MemoryMetrics): void => {
  if (!defaultConfig.enableMemoryMonitoring) {
    return;
  }
  
  // Adicionar ao armazenamento de métricas
  memoryMetrics.push(metrics);
  
  // Limitar o número de métricas armazenadas
  if (memoryMetrics.length > defaultConfig.maxMetricsEntries) {
    memoryMetrics = memoryMetrics.slice(-defaultConfig.maxMetricsEntries);
  }
  
  // Registrar no logger
  logPerformance({
    timestamp: metrics.timestamp,
    component: 'Memory',
    operation: 'Usage',
    duration: 0,
    memoryUsage: {
      heapUsed: metrics.heapUsed,
      heapTotal: metrics.heapTotal,
      external: metrics.external,
    },
    cacheStats: getCacheStats(),
  });
};

// Função para obter métricas de API
export const getApiMetrics = (endpoint?: string): ApiMetrics[] => {
  if (endpoint) {
    return apiMetrics.filter(metrics => metrics.endpoint === endpoint);
  }
  
  return [...apiMetrics];
};

// Função para obter métricas de renderização
export const getRenderMetrics = (component?: string): RenderMetrics[] => {
  if (component) {
    return renderMetrics.filter(metrics => metrics.component === component);
  }
  
  return [...renderMetrics];
};

// Função para obter métricas de memória
export const getMemoryMetrics = (): MemoryMetrics[] => {
  return [...memoryMetrics];
};

// Função para limpar métricas de API
export const clearApiMetrics = (): void => {
  apiMetrics = [];
};

// Função para limpar métricas de renderização
export const clearRenderMetrics = (): void => {
  renderMetrics = [];
};

// Função para limpar métricas de memória
export const clearMemoryMetrics = (): void => {
  memoryMetrics = [];
};

// Função para configurar o monitor
export const configureMonitor = (config: Partial<MonitorConfig>): void => {
  Object.assign(defaultConfig, config);
};

// Função para iniciar o monitoramento de memória
export const startMemoryMonitoring = (): void => {
  if (!defaultConfig.enableMemoryMonitoring) {
    return;
  }
  
  const checkMemory = (): void => {
    if (typeof window !== 'undefined' && window.performance) {
      // Verificar se a API de memória está disponível (Chrome)
      const memory = (window.performance as any).memory;
      
      if (memory) {
        logMemoryMetrics({
          heapUsed: memory.usedJSHeapSize,
          heapTotal: memory.totalJSHeapSize,
          external: memory.externalJSHeapSize,
          timestamp: Date.now(),
        });
      }
    }
  };
  
  // Verificar memória imediatamente
  checkMemory();
  
  // Configurar intervalo para verificar memória
  const interval = setInterval(checkMemory, defaultConfig.memoryCheckInterval);
  
  // Limpar intervalo quando a página for fechada
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      clearInterval(interval);
    });
  }
};

// Função para medir o tempo de execução de uma função
export const measureExecutionTime = <T>(operation: string, fn: () => T): T => {
  const startTime = performance.now();
  const result = fn();
  const endTime = performance.now();
  
  logPerformance({
    timestamp: Date.now(),
    component: 'Execution',
    operation,
    duration: endTime - startTime,
  });
  
  return result;
};

// Função para medir o tempo de execução de uma função assíncrona
export const measureAsyncExecutionTime = async <T>(operation: string, fn: () => Promise<T>): Promise<T> => {
  const startTime = performance.now();
  const result = await fn();
  const endTime = performance.now();
  
  logPerformance({
    timestamp: Date.now(),
    component: 'Execution',
    operation,
    duration: endTime - startTime,
  });
  
  return result;
};

// Função para medir o tempo de renderização de um componente React
export const measureRenderTime = (component: string, renderTime: number): void => {
  logRenderMetrics({
    component,
    renderTime,
    timestamp: Date.now(),
  });
};

// Função para medir o tempo de resposta de uma API
export const measureApiResponseTime = (endpoint: string, method: string, statusCode: number, responseTime: number): void => {
  logApiMetrics({
    endpoint,
    method,
    statusCode,
    responseTime,
    timestamp: Date.now(),
  });
};

// Exportar uma instância padrão do monitor
export default {
  logApiMetrics,
  logRenderMetrics,
  logMemoryMetrics,
  getApiMetrics,
  getRenderMetrics,
  getMemoryMetrics,
  clearApiMetrics,
  clearRenderMetrics,
  clearMemoryMetrics,
  configureMonitor,
  startMemoryMonitoring,
  measureExecutionTime,
  measureAsyncExecutionTime,
  measureRenderTime,
  measureApiResponseTime,
}; 