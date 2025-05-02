// Script de pré-build para o Vercel
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running Vercel pre-build script...');

// Executar o script para criar componentes locais
try {
  // Verificar se o arquivo fix-imports.js existe
  if (fs.existsSync('./fix-imports.js')) {
    console.log('Running fix-imports.js...');
    require('./fix-imports.js');
  } else {
    console.log('fix-imports.js not found');
  }
} catch (error) {
  console.error('Error running fix-imports.js:', error);
}

// Criar um arquivo .env.local com as configurações do Supabase para o sistema neural
try {
  const envContent = `# API Keys
NEXT_PUBLIC_RAPIDAPI_KEY=0ec6b2cbf9mshb7aea8fe9276945p16d2e2jsne40eb8c57dae
NEXT_PUBLIC_ORDISCAN_API_KEY=e227a764-b31b-43cf-a60c-be5daa50cd2c
NEXT_PUBLIC_COINMARKETCAP_API_KEY=c045d2a9-6f2d-44e9-8297-a88ab83b463b

# Supabase configuration for neural learning cloud storage
NEXT_PUBLIC_SUPABASE_URL=https://tsmevnomziouyffdvwya.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWV2bm9temlvdXlmZmR2d3lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc0MzU3NzYsImV4cCI6MjAzMzAxMTc3Nn0.Yd-Yk-Ow-Yd-Yk-Ow-Yd-Yk-Ow-Yd-Yk-Ow
`;

  fs.writeFileSync('./.env.local', envContent);
  console.log('Created .env.local file');
} catch (error) {
  console.error('Error creating .env.local file:', error);
}

console.log('Vercel pre-build script completed!');
