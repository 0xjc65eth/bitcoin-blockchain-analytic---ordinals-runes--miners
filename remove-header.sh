#!/bin/bash

# Script para remover a importação e uso do componente Header de todas as páginas

# Diretório base
BASE_DIR="/Users/juliocesar/cypher ordi future 2.2/bitcoin-blockchain-analytic---ordinals-runes--miners"

# Encontrar todos os arquivos .tsx que importam o componente Header
FILES=$(grep -l "import { Header } from '@/components/header'" $BASE_DIR/src/app/**/*.tsx)

# Para cada arquivo encontrado
for file in $FILES; do
  echo "Processando $file..."
  
  # Remover a linha de importação do Header
  sed -i '' '/import { Header } from/d' "$file"
  
  # Remover a linha que renderiza o componente Header
  sed -i '' '/<Header/d' "$file"
done

echo "Concluído!"
