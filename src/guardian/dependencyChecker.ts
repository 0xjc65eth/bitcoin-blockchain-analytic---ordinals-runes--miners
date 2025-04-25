import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import semver from 'semver';

interface DependencyInfo {
  name: string;
  currentVersion: string;
  latestVersion: string;
  isOutdated: boolean;
  vulnerabilities: Vulnerability[];
}

interface Vulnerability {
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  fixVersion?: string;
}

export class DependencyChecker {
  private readonly packageJsonPath: string;
  private readonly lockFilePath: string;

  constructor() {
    this.packageJsonPath = path.join(process.cwd(), 'package.json');
    this.lockFilePath = path.join(process.cwd(), 'package-lock.json');
  }

  async checkDependencies(): Promise<DependencyInfo[]> {
    if (!fs.existsSync(this.packageJsonPath)) {
      throw new Error('package.json not found');
    }

    const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf-8'));
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    const results: DependencyInfo[] = [];

    for (const [name, version] of Object.entries(dependencies)) {
      try {
        const latestVersion = this.getLatestVersion(name);
        const vulnerabilities = await this.checkVulnerabilities(name);
        
        results.push({
          name,
          currentVersion: version as string,
          latestVersion,
          isOutdated: semver.lt(version as string, latestVersion),
          vulnerabilities
        });
      } catch (error) {
        console.error(`Error checking ${name}:`, error);
      }
    }

    this.logDependencyResults(results);
    return results;
  }

  private getLatestVersion(packageName: string): string {
    try {
      const output = execSync(`npm view ${packageName} version`, { stdio: 'pipe' }).toString().trim();
      return output;
    } catch (error) {
      throw new Error(`Failed to get latest version for ${packageName}`);
    }
  }

  private async checkVulnerabilities(packageName: string): Promise<Vulnerability[]> {
    try {
      const output = execSync(`npm audit --json ${packageName}`, { stdio: 'pipe' }).toString();
      const audit = JSON.parse(output);
      
      return Object.values(audit.vulnerabilities || {}).map((vuln: any) => ({
        severity: vuln.severity,
        description: vuln.description,
        fixVersion: vuln.fixVersion
      }));
    } catch (error) {
      console.error(`Error checking vulnerabilities for ${packageName}:`, error);
      return [];
    }
  }

  private logDependencyResults(results: DependencyInfo[]): void {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, 'dependency_check.log');
    const timestamp = new Date().toISOString();
    
    let logEntry = `${timestamp} - Dependency Check Results:\n`;
    
    for (const result of results) {
      logEntry += `
Package: ${result.name}
Current Version: ${result.currentVersion}
Latest Version: ${result.latestVersion}
Status: ${result.isOutdated ? 'OUTDATED' : 'UP-TO-DATE'}
Vulnerabilities: ${result.vulnerabilities.length}
${result.vulnerabilities.map(v => `  - ${v.severity.toUpperCase()}: ${v.description}`).join('\n')}
`;
    }

    fs.appendFileSync(logFile, logEntry);
  }

  async updateDependencies(): Promise<void> {
    try {
      execSync('npm update', { stdio: 'inherit' });
      console.log('Dependencies updated successfully');
    } catch (error) {
      console.error('Failed to update dependencies:', error);
      throw error;
    }
  }

  async fixVulnerabilities(): Promise<void> {
    try {
      execSync('npm audit fix', { stdio: 'inherit' });
      console.log('Vulnerabilities fixed successfully');
    } catch (error) {
      console.error('Failed to fix vulnerabilities:', error);
      throw error;
    }
  }
} 