# Como Enviar para o GitHub - Upgrade Version 2.2.1.1

Este documento contém instruções detalhadas para enviar as alterações da versão 2.2.1.1 para o GitHub.

## Pré-requisitos

- Git instalado no seu computador
- Acesso ao repositório GitHub `bitcoin-blockchain-analytic---ordinals-runes--miners`
- Terminal ou prompt de comando

## Passos Detalhados

### 1. Abra um Terminal

- No Windows: Abra o "Git Bash" ou "Command Prompt"
- No macOS: Abra o "Terminal"
- No Linux: Abra o "Terminal"

### 2. Navegue até o Diretório do Projeto

```bash
cd caminho/para/bitcoin-blockchain-analytic---ordinals-runes--miners
```

Substitua "caminho/para" pelo caminho real onde o projeto está localizado no seu computador.

### 3. Verifique o Status Atual

```bash
git status
```

Isso mostrará quais arquivos foram modificados.

### 4. Crie uma Nova Branch

```bash
git checkout -b upgrade-version-2.2.1.1
```

Isso cria uma nova branch chamada "upgrade-version-2.2.1.1" e muda para ela.

### 5. Adicione Todos os Arquivos Modificados

```bash
git add .
```

Isso adiciona todos os arquivos modificados ao staging area.

### 6. Faça o Commit das Alterações

```bash
git commit -m "Upgrade Version 2.2.1.1: Melhorias nas abas de Mineradores e Arbitragem"
```

Você também pode usar uma mensagem de commit mais detalhada:

```bash
git commit -m "Upgrade Version 2.2.1.1: Melhorias significativas nas abas de Mineradores e Arbitragem

- Layout da aba de mineradores redesenhado para ficar mais atrativo como a aba Ordinals
- Corrigidos dados da OMB Pool (host: ombpool.com, port: 2018, password: X)
- Implementado tratamento robusto para APIs com dados de fallback
- Adicionadas mais informações na aba de arbitragem com detalhes específicos de compra/venda
- Melhorado o design geral com gradientes, sombras e elementos visuais
- Atualizado README com documentação completa
- Adicionadas informações detalhadas sobre risco de centralização da rede Bitcoin
- Implementado tratamento de erros para APIs externas"
```

### 7. Envie a Branch para o GitHub

```bash
git push -u origin upgrade-version-2.2.1.1
```

Isso envia a nova branch para o repositório remoto no GitHub.

### 8. Crie um Pull Request (Opcional)

1. Acesse o repositório no GitHub: `https://github.com/0xjc65eth/bitcoin-blockchain-analytic---ordinals-runes--miners`
2. Você verá uma notificação sobre a nova branch. Clique em "Compare & pull request"
3. Adicione um título e descrição para o pull request
4. Clique em "Create pull request"

## Solução de Problemas

### Se você encontrar erros de autenticação:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

Em seguida, tente fazer o push novamente.

### Se você encontrar conflitos:

1. Atualize sua branch principal:
```bash
git checkout main
git pull origin main
```

2. Volte para sua branch e faça o rebase:
```bash
git checkout upgrade-version-2.2.1.1
git rebase main
```

3. Resolva os conflitos e continue:
```bash
git add .
git rebase --continue
```

4. Faça o push forçado:
```bash
git push -f origin upgrade-version-2.2.1.1
```

## Verificação

Após enviar as alterações, verifique no GitHub se a nova branch "upgrade-version-2.2.1.1" aparece no repositório e se todos os arquivos foram atualizados corretamente.

## Contato

Se você encontrar algum problema durante o processo, entre em contato através do GitHub ou abra uma issue no repositório.
