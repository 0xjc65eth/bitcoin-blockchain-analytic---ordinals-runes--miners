# Instruções para Deploy no Render - Versão 2.5X

Este guia explica como fazer o deploy da versão 2.5X diretamente no Render.com.

## Método Recomendado: Criar um Novo Serviço (Mais Simples)

Este método é o mais simples e evita problemas com o deploy atual:

1. Acesse o [Dashboard do Render](https://dashboard.render.com/)
2. Clique em "New +" e selecione "Web Service"
3. Conecte ao repositório GitHub (se ainda não estiver conectado)
4. Selecione o repositório `bitcoin-blockchain-analytic---ordinals-runes--miners`
5. Selecione a branch `upgrade-2.5X`
6. Configure o serviço:
   - Nome: `cypher-ordi-future-2-5x`
   - Runtime: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
7. Configure as variáveis de ambiente:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://api.ordiscan.com/v1/
   NODE_VERSION=18.17.0
   NEXT_PUBLIC_COINMARKETCAP_API_KEY=c045d2a9-6f2d-44e9-8297-a88ab83b463b
   NEXT_PUBLIC_ORDISCAN_API_KEY=e227a764-b31b-43cf-a60c-be5daa50cd2c
   NEXT_PUBLIC_RAPIDAPI_KEY=0ec6b2cbf9mshb7aea8fe9276945p16d2e2jsne40eb8c57dae
   NEXT_PUBLIC_DISABLE_NEURAL_LEARNING=true
   ```
8. Clique em "Create Web Service"
9. Após o deploy bem-sucedido, você pode redirecionar o domínio para este novo serviço

## Método Alternativo: Atualizar o Serviço Existente

Se preferir atualizar o serviço existente:

1. Acesse o [Dashboard do Render](https://dashboard.render.com/)
2. Localize o serviço atual "cypher-ordi-future"
3. Clique em "Settings" e depois em "Environment"
4. Adicione a variável de ambiente:
   ```
   NEXT_PUBLIC_DISABLE_NEURAL_LEARNING=true
   ```
5. Clique em "Save Changes"
6. Vá para "Settings" > "Build & Deploy"
7. Em "Branch", altere a branch para `upgrade-2.5X`
8. Clique em "Save Changes"
9. Volte para a página principal do serviço e clique em "Manual Deploy" > "Deploy latest commit"

## Verificação do Deploy

Após o deploy, verifique se:

1. A aplicação está funcionando corretamente
2. A barra de navegação está sendo exibida conforme esperado
3. Todas as funcionalidades estão operando normalmente

## Rollback (Se Necessário)

Se encontrar problemas com a nova versão:

1. Acesse o [Dashboard do Render](https://dashboard.render.com/)
2. Localize o serviço "cypher-ordi-future"
3. Clique em "Settings" e depois em "Build & Deploy"
4. Em "Branch", altere a branch de volta para a versão anterior
5. Clique em "Save Changes"
6. Volte para a página principal do serviço e clique em "Manual Deploy" > "Deploy latest commit"

## Configuração de Domínio Personalizado

Se estiver usando um domínio personalizado:

1. Acesse o [Dashboard do Render](https://dashboard.render.com/)
2. Localize o serviço "cypher-ordi-future"
3. Clique em "Settings" e depois em "Custom Domain"
4. Siga as instruções para configurar seu domínio personalizado

## Solução de Problemas Comuns

### Erro: "supabaseUrl is required" ou "Module not found"

Se você encontrar erros durante o build, como `Error: supabaseUrl is required` ou `Module not found: Can't resolve '@/components/header'`, não se preocupe. Já implementamos uma solução que exclui automaticamente as páginas problemáticas do build.

As seguintes páginas são excluídas automaticamente do build:
- `/neural-learning` (problema com Supabase)
- `/arbitrage` (problema com importações)
- `/brc20` (problema com importações)

Isso permite que o resto do site seja construído e implantado corretamente.

### Configuração Manual de Variáveis de Ambiente

Se você quiser habilitar todas as páginas, você pode configurar as variáveis de ambiente necessárias:

1. Acesse o Dashboard do Render
2. Vá para o serviço > Settings > Environment
3. Adicione as seguintes variáveis:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anônima do seu projeto Supabase
   - `NEXT_PUBLIC_DISABLE_NEURAL_LEARNING`: Defina como `true` para desabilitar a página Neural Learning
4. Salve as alterações e faça um novo deploy

## Suporte

Se encontrar problemas durante o processo de deploy, entre em contato com o mantenedor do repositório ou com o suporte do Render.
