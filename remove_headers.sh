#!/bin/bash

# Lista de arquivos de página para verificar
find src/app -name "page.tsx" -type f | while read -r file; do
  # Verifica se o arquivo contém a linha <Header /> e não é o arquivo layout.tsx
  if grep -q "<Header />" "$file"; then
    echo "Removendo header de $file"
    # Substitui a linha que contém <Header /> por uma string vazia
    sed -i '' 's/<Header \/>//g' "$file"
    # Remove linhas em branco extras que possam ter sido criadas
    sed -i '' '/^[[:space:]]*$/d' "$file"
  fi
done

echo "Concluído! Headers duplicados foram removidos."
