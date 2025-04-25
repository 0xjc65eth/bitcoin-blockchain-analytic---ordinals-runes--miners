#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

// Helper function to run commands
function runCommand(command, errorMessage) {
  try {
    console.log(`${colors.blue}Running: ${command}${colors.reset}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`${colors.red}${errorMessage}${colors.reset}`);
    console.error(error);
    return false;
  }
}

// Main verification function
async function verify() {
  console.log(`${colors.blue}Starting pre-start verification...${colors.reset}`);

  // 1. Verify Dependencies
  console.log('\n1. Verifying dependencies...');
  if (!runCommand('npm install', 'Failed to install dependencies')) {
    return false;
  }

  // 2. Run Linting
  console.log('\n2. Running linting...');
  if (!runCommand('npm run lint', 'Linting failed')) {
    return false;
  }

  // 3. Run Type Checking
  console.log('\n3. Running type checking...');
  if (!runCommand('npx tsc --noEmit', 'Type checking failed')) {
    return false;
  }

  // 4. Run Unit Tests
  console.log('\n4. Running unit tests...');
  if (!runCommand('npm run test -- --passWithNoTests', 'Unit tests failed')) {
    return false;
  }

  // 5. Run Accessibility Tests
  console.log('\n5. Running accessibility tests...');
  if (!runCommand('npm run test -- --testMatch "**/*.a11y.test.tsx" --passWithNoTests', 'Accessibility tests failed')) {
    return false;
  }

  // 6. Check for Runtime Errors
  console.log('\n6. Checking for runtime errors...');
  const devProcess = execSync('npm run dev', { stdio: 'pipe' });
  console.log(devProcess.toString());

  // 7. Verify Build Process
  console.log('\n7. Verifying build process...');
  if (!runCommand('npm run build', 'Build failed')) {
    return false;
  }

  // 8. Check Documentation
  console.log('\n8. Checking documentation...');
  const requiredDocs = ['API.md', 'CONTRIBUTING.md'];
  for (const doc of requiredDocs) {
    if (!fs.existsSync(path.join(process.cwd(), doc))) {
      console.error(`${colors.red}Missing documentation: ${doc}${colors.reset}`);
      return false;
    }
  }

  console.log(`${colors.green}\nAll verification steps passed!${colors.reset}`);
  return true;
}

// Run verification
verify().then(success => {
  if (success) {
    console.log(`${colors.green}You can now start the server with confidence!${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`${colors.red}Verification failed. Please fix the issues before starting the server.${colors.reset}`);
    process.exit(1);
  }
}); 