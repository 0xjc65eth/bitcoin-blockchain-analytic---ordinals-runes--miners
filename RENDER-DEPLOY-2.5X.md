# Instruções para Deploy no Render - Versão 2.5X

Este guia explica como fazer o deploy da versão 2.5X diretamente no Render.com, substituindo a versão atual em produção.

## Método 1: Deploy Automático (Recomendado)

### Pré-requisitos
- Acesso à conta do Render.com
- Acesso ao repositório GitHub

### Passos para Deploy Automático

1. Acesse o [Dashboard do Render](https://dashboard.render.com/)
2. Localize o serviço atual "cypher-ordi-future"
3. Clique em "Settings" e depois em "Build & Deploy"
4. Em "Branch", altere a branch para `upgrade-2.5X`
5. Clique em "Save Changes"
6. Volte para a página principal do serviço e clique em "Manual Deploy" > "Deploy latest commit"
7. Aguarde o processo de build e deploy ser concluído

O Render irá automaticamente fazer o build e deploy da nova versão, substituindo a versão atual em produção.

## Método 2: Criar um Novo Serviço

Se preferir criar um novo serviço e depois substituir o atual:

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
   ```
8. Clique em "Create Web Service"
9. Após o deploy bem-sucedido, você pode redirecionar o domínio para este novo serviço

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

## Suporte

Se encontrar problemas durante o processo de deploy, entre em contato com o mantenedor do repositório ou com o suporte do Render.
