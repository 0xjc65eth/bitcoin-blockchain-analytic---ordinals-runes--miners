#!/bin/bash

# Este script é executado antes do build no Render
echo "Running pre-build script..."

# Executar o script para criar componentes locais
node fix-imports.js

# Criar um arquivo .env.local com as configurações do Supabase para o sistema neural
cat > .env.local << EOL
# API Keys
NEXT_PUBLIC_RAPIDAPI_KEY=0ec6b2cbf9mshb7aea8fe9276945p16d2e2jsne40eb8c57dae
NEXT_PUBLIC_ORDISCAN_API_KEY=e227a764-b31b-43cf-a60c-be5daa50cd2c
NEXT_PUBLIC_COINMARKETCAP_API_KEY=c045d2a9-6f2d-44e9-8297-a88ab83b463b

# Supabase configuration for neural learning cloud storage
NEXT_PUBLIC_SUPABASE_URL=https://tsmevnomziouyffdvwya.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWV2bm9temlvdXlmZmR2d3lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc0MzU3NzYsImV4cCI6MjAzMzAxMTc3Nn0.Yd-Yk-Ow-Yd-Yk-Ow-Yd-Yk-Ow-Yd-Yk-Ow
EOL

echo "Pre-build script completed!"
