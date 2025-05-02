# Fluxo de Trabalho CI/CD: VSCode → GitHub → Render

Este documento explica como configurar um fluxo de trabalho de integração contínua e implantação contínua (CI/CD) para que as alterações feitas no VSCode sejam automaticamente enviadas para o GitHub e implantadas no Render.

## Configuração do VSCode e GitHub

### 1. Configurar o Git no VSCode

1. **Instalar a extensão GitHub Pull Requests and Issues**:
   - Abra o VSCode
   - Vá para a aba de extensões (Ctrl+Shift+X)
   - Pesquise por "GitHub Pull Requests and Issues"
   - Instale a extensão

2. **Configurar credenciais do Git**:
   - Abra o terminal no VSCode e execute:
   ```bash
   git config --global user.name "Seu Nome"
   git config --global user.email "seu.email@exemplo.com"
   ```

3. **Autenticar no GitHub**:
   - Clique no ícone do GitHub na barra lateral
   - Clique em "Sign in to GitHub"
   - Siga as instruções para autenticar

### 2. Fluxo de Trabalho para Enviar Alterações

1. **Criar uma nova branch**:
   - Clique no nome da branch atual na barra de status (canto inferior esquerdo)
   - Clique em "Create new branch"
   - Digite o nome da nova branch (ex: "feature/nova-funcionalidade")
   - Pressione Enter

2. **Fazer alterações no código**:
   - Edite os arquivos conforme necessário

3. **Fazer commit das alterações**:
   - Clique no ícone do Git na barra lateral
   - Adicione os arquivos modificados ao stage (clique no + ao lado de cada arquivo)
   - Digite uma mensagem de commit descritiva
   - Clique em "Commit"

4. **Enviar para o GitHub**:
   - Clique em "Publish Branch" (se for a primeira vez) ou "Sync Changes"
   - Suas alterações serão enviadas para o GitHub

5. **Criar um Pull Request**:
   - Clique no ícone do GitHub na barra lateral
   - Clique em "Create Pull Request"
   - Adicione um título e descrição para o PR
   - Clique em "Create"

## Configuração do Render para Deploy Automático

### 1. Configurar o Render para Deploy Automático

1. **Acesse o Dashboard do Render**:
   - Vá para [dashboard.render.com](https://dashboard.render.com/)
   - Faça login na sua conta

2. **Conecte seu repositório GitHub**:
   - Clique em "New" e selecione "Web Service"
   - Conecte sua conta GitHub se ainda não estiver conectada
   - Selecione o repositório

3. **Configure o serviço**:
   - Nome: `cypher-ordi-future`
   - Branch: `upgrade-2.5X` (ou a branch principal)
   - Runtime: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Marque a opção "Auto-Deploy"

4. **Configure as variáveis de ambiente**:
   - Adicione todas as variáveis de ambiente necessárias
   - Clique em "Save"

### 2. Configurar Preview de Pull Requests

O Render pode criar automaticamente ambientes de preview para cada Pull Request:

1. **Habilitar previews de PR**:
   - Vá para o serviço no Render
   - Clique em "Settings"
   - Role até "Pull Request Previews"
   - Ative a opção "Enable pull request previews"

2. **Configurar o arquivo render.yaml**:
   - Este arquivo já foi configurado com `pullRequestPreviewsEnabled: true`
   - Isso permite que o Render crie automaticamente previews para cada PR

## Fluxo de Trabalho Completo

Com essa configuração, seu fluxo de trabalho será:

1. Faça alterações no VSCode
2. Crie uma nova branch
3. Faça commit e push das alterações
4. Crie um Pull Request no GitHub
5. O Render criará automaticamente um ambiente de preview para o PR
6. Após revisar, faça merge do PR na branch principal
7. O Render implantará automaticamente as alterações na produção

## Dicas Adicionais

- **Commits atômicos**: Faça commits pequenos e focados em uma única alteração
- **Mensagens de commit descritivas**: Use mensagens claras que expliquem o que foi alterado
- **Teste antes de enviar**: Sempre teste suas alterações localmente antes de enviar para o GitHub
- **Revise os PRs**: Sempre revise os PRs antes de fazer merge
- **Monitore os deploys**: Verifique os logs de deploy no Render para identificar problemas
