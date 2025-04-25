import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

interface BuildMetrics {
  startTime: number;
  endTime: number;
  duration: number;
  memoryUsage: NodeJS.MemoryUsage;
  success: boolean;
  error?: string;
  warnings: string[];
}

export class BuildMonitor {
  private metrics: BuildMetrics[] = [];
  private readonly maxMetrics = 100;

  async monitorBuild(command: string): Promise<BuildMetrics> {
    const startTime = performance.now();
    const startMemory = process.memoryUsage();
    let success = true;
    let error: string | undefined;
    const warnings: string[] = [];

    try {
      const output = execSync(command, { stdio: 'pipe' }).toString();
      
      // Check for warnings in the output
      if (output.includes('warning')) {
        warnings.push(output);
      }
    } catch (err) {
      success = false;
      error = err instanceof Error ? err.message : 'Unknown build error';
    }

    const endTime = performance.now();
    const endMemory = process.memoryUsage();
    const duration = endTime - startTime;

    const metrics: BuildMetrics = {
      startTime,
      endTime,
      duration,
      memoryUsage: {
        rss: endMemory.rss - startMemory.rss,
        heapTotal: endMemory.heapTotal - startMemory.heapTotal,
        heapUsed: endMemory.heapUsed - startMemory.heapUsed,
        external: endMemory.external - startMemory.external,
        arrayBuffers: endMemory.arrayBuffers - startMemory.arrayBuffers
      },
      success,
      error,
      warnings
    };

    this.storeMetrics(metrics);
    this.logBuildMetrics(metrics);

    return metrics;
  }

  private storeMetrics(metrics: BuildMetrics): void {
    this.metrics.push(metrics);
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  private logBuildMetrics(metrics: BuildMetrics): void {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, 'build_metrics.log');
    const timestamp = new Date().toISOString();
    
    const logEntry = `${timestamp} - Build Metrics:
      Duration: ${metrics.duration.toFixed(2)}ms
      Success: ${metrics.success}
      Memory Usage:
        RSS: ${(metrics.memoryUsage.rss / 1024 / 1024).toFixed(2)}MB
        Heap Total: ${(metrics.memoryUsage.heapTotal / 1024 / 1024).toFixed(2)}MB
        Heap Used: ${(metrics.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB
      ${metrics.error ? `Error: ${metrics.error}` : ''}
      ${metrics.warnings.length > 0 ? `Warnings: ${metrics.warnings.join('\n')}` : ''}\n`;

    fs.appendFileSync(logFile, logEntry);
  }

  getRecentMetrics(): BuildMetrics[] {
    return [...this.metrics];
  }

  getAverageBuildTime(): number {
    if (this.metrics.length === 0) return 0;
    return this.metrics.reduce((sum, metric) => sum + metric.duration, 0) / this.metrics.length;
  }

  getSuccessRate(): number {
    if (this.metrics.length === 0) return 0;
    const successfulBuilds = this.metrics.filter(metric => metric.success).length;
    return (successfulBuilds / this.metrics.length) * 100;
  }
} 