#!/bin/bash

# Criar diretórios necessários
mkdir -p src/components
mkdir -p src/hooks

# Copiar componentes
cp -f src/components/header.tsx src/components/
cp -f src/components/enhanced-arbitrage-card.tsx src/components/
cp -f src/components/dashboard-card.tsx src/components/

# Copiar hooks
cp -f src/hooks/useOrdiscanData.ts src/hooks/

echo "Arquivos copiados com sucesso!"
