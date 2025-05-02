#!/bin/bash

# Este script é executado antes do build no Render
echo "Running pre-build script..."

# Executar o script para criar componentes locais
node fix-imports.js

# Criar um arquivo .env.local para desabilitar a página Neural Learning
echo "NEXT_PUBLIC_DISABLE_NEURAL_LEARNING=true" > .env.local

echo "Pre-build script completed!"
