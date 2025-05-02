# Correção de Navegação e Configuração do Vercel

Este PR resolve dois problemas principais:

1. **Problemas de navegação entre abas**: Algumas vezes, ao clicar em links de navegação, a página não muda ou ocorrem erros.
2. **Configuração do domínio no Vercel**: O domínio personalizado não está funcionando corretamente.

## Alterações

### 1. Configuração do Vercel

O arquivo `vercel-navigation-fix.json` contém uma configuração atualizada para o Vercel que inclui:

- Configurações de roteamento para garantir que todas as páginas sejam acessíveis
- Cabeçalhos de cache para melhorar o desempenho
- Variáveis de ambiente para as APIs (CoinMarketCap, Ordiscan, Supabase, etc.)

Para usar esta configuração:

1. Renomeie `vercel-navigation-fix.json` para `vercel.json`
2. Faça o deploy no Vercel

### 2. Script de Correção de Navegação

O arquivo `navigation-fix.js` contém um script que corrige problemas de navegação no Next.js. Este script:

- Força uma navegação completa quando um link interno é clicado
- Garante que o histórico do navegador seja atualizado corretamente

Para usar este script:

1. Importe-o no seu arquivo `_app.js` ou `layout.js`
2. Chame a função `fixNavigation()` no hook `useEffect`

Exemplo:

```jsx
import { useEffect } from 'react';
import { fixNavigation } from './navigation-fix';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    fixNavigation();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
```

## Instruções para o Vercel

Após fazer o deploy no Vercel:

1. Vá para as configurações do projeto no Vercel
2. Verifique se as variáveis de ambiente estão configuradas corretamente
3. Se estiver usando um domínio personalizado, verifique se os registros DNS estão configurados corretamente

## Testando a Navegação

Para testar se a navegação está funcionando corretamente:

1. Acesse o site
2. Clique nos diferentes links de navegação (Dashboard, Trading, Ordinals, etc.)
3. Verifique se você consegue navegar entre as páginas sem problemas
