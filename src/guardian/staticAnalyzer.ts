import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { ESLint } from 'eslint';

interface AnalysisResult {
  type: 'error' | 'warning' | 'info';
  message: string;
  file?: string;
  line?: number;
  column?: number;
  resolution?: string;
}

export class StaticAnalyzer {
  private eslint: ESLint;

  constructor() {
    this.eslint = new ESLint({
      extensions: ['.ts', '.tsx'],
      useEslintrc: true,
      fix: true
    });
  }

  async analyzeFile(filePath: string): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];
    
    try {
      // Check TypeScript errors
      const tscResult = execSync('tsc --noEmit', { stdio: 'pipe' }).toString();
      if (tscResult) {
        results.push({
          type: 'error',
          message: 'TypeScript compilation error',
          resolution: 'Run tsc --noEmit to see detailed errors'
        });
      }

      // Run ESLint
      const eslintResults = await this.eslint.lintFiles([filePath]);
      for (const result of eslintResults) {
        for (const message of result.messages) {
          results.push({
            type: message.severity === 2 ? 'error' : 'warning',
            message: message.message,
            file: result.filePath,
            line: message.line,
            column: message.column,
            resolution: message.fix ? 'Auto-fix available' : 'Manual fix required'
          });
        }
      }

      // Check for unused imports
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
      const imports = new Set<string>();
      let match;

      while ((match = importRegex.exec(fileContent)) !== null) {
        imports.add(match[1]);
      }

      // Log results
      this.logResults(results, filePath);

      return results;
    } catch (error) {
      console.error('Error during static analysis:', error);
      return [{
        type: 'error',
        message: 'Failed to analyze file',
        resolution: 'Check console for details'
      }];
    }
  }

  private logResults(results: AnalysisResult[], filePath: string): void {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, 'guardian_errors.log');
    const timestamp = new Date().toISOString();
    
    results.forEach(result => {
      const logEntry = `${timestamp} - Static Analysis - ${result.type.toUpperCase()} in ${filePath}: ${result.message}\n`;
      fs.appendFileSync(logFile, logEntry);
    });
  }
} 