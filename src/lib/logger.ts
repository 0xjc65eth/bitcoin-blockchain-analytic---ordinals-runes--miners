/**
 * Logger Service
 * 
 * This service provides logging functionality for the application.
 * It includes methods for logging messages at different levels (debug, info, warn, error).
 */

// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

// Logger configuration
interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableStorage: boolean;
  maxStoredLogs: number;
}

// Log entry interface
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

// Logger service class
class LoggerService {
  private config: LoggerConfig = {
    level: LogLevel.INFO,
    enableConsole: true,
    enableStorage: true,
    maxStoredLogs: 1000
  };
  
  private logs: LogEntry[] = [];
  
  constructor() {
    // Initialize logger
    this.info('Logger service initialized');
  }
  
  /**
   * Set logger configuration
   */
  public setConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  /**
   * Get logger configuration
   */
  public getConfig(): LoggerConfig {
    return { ...this.config };
  }
  
  /**
   * Log a debug message
   */
  public debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }
  
  /**
   * Log an info message
   */
  public info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }
  
  /**
   * Log a warning message
   */
  public warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }
  
  /**
   * Log an error message
   */
  public error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data);
  }
  
  /**
   * Log a message with the specified level
   */
  private log(level: LogLevel, message: string, data?: any): void {
    // Check if the log level is enabled
    if (level < this.config.level) {
      return;
    }
    
    // Create log entry
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };
    
    // Log to console if enabled
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }
    
    // Store log if enabled
    if (this.config.enableStorage) {
      this.storeLog(entry);
    }
  }
  
  /**
   * Log to console
   */
  private logToConsole(entry: LogEntry): void {
    const { timestamp, level, message, data } = entry;
    
    // Format timestamp
    const formattedTimestamp = timestamp.replace('T', ' ').replace('Z', '');
    
    // Format level
    let levelString: string;
    let consoleMethod: 'log' | 'info' | 'warn' | 'error';
    
    switch (level) {
      case LogLevel.DEBUG:
        levelString = 'DEBUG';
        consoleMethod = 'log';
        break;
      case LogLevel.INFO:
        levelString = 'INFO';
        consoleMethod = 'info';
        break;
      case LogLevel.WARN:
        levelString = 'WARN';
        consoleMethod = 'warn';
        break;
      case LogLevel.ERROR:
        levelString = 'ERROR';
        consoleMethod = 'error';
        break;
      default:
        levelString = 'UNKNOWN';
        consoleMethod = 'log';
    }
    
    // Format message
    const formattedMessage = `[${formattedTimestamp}] [${levelString}] ${message}`;
    
    // Log to console
    if (data !== undefined) {
      console[consoleMethod](formattedMessage, data);
    } else {
      console[consoleMethod](formattedMessage);
    }
  }
  
  /**
   * Store log in memory
   */
  private storeLog(entry: LogEntry): void {
    // Add log to storage
    this.logs.push(entry);
    
    // Trim logs if needed
    if (this.logs.length > this.config.maxStoredLogs) {
      this.logs = this.logs.slice(-this.config.maxStoredLogs);
    }
  }
  
  /**
   * Get all stored logs
   */
  public getLogs(): LogEntry[] {
    return [...this.logs];
  }
  
  /**
   * Get logs filtered by level
   */
  public getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }
  
  /**
   * Get logs filtered by time range
   */
  public getLogsByTimeRange(startTime: Date, endTime: Date): LogEntry[] {
    return this.logs.filter(log => {
      const logTime = new Date(log.timestamp);
      return logTime >= startTime && logTime <= endTime;
    });
  }
  
  /**
   * Clear all stored logs
   */
  public clearLogs(): void {
    this.logs = [];
    this.info('Logs cleared');
  }
  
  /**
   * Export logs to JSON
   */
  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
  
  /**
   * Import logs from JSON
   */
  public importLogs(json: string): void {
    try {
      const logs = JSON.parse(json) as LogEntry[];
      this.logs = logs;
      this.info(`Imported ${logs.length} logs`);
    } catch (error) {
      this.error('Failed to import logs', error);
    }
  }
}

// Export singleton instance
export const loggerService = new LoggerService();
