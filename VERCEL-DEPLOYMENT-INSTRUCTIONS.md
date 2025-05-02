# Instruções para Deploy no Vercel

Este documento contém instruções detalhadas para fazer o deploy deste projeto no Vercel, incluindo a configuração de navegação entre abas e a integração do sistema neural com a aba de arbitragem.

## 1. Configuração do arquivo vercel.json

Certifique-se de que o arquivo `vercel.json` na raiz do projeto contém as seguintes configurações:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "rewrites": [
    { "source": "/dashboard", "destination": "/" },
    { "source": "/trading", "destination": "/trading" },
    { "source": "/ordinals", "destination": "/ordinals" },
    { "source": "/runes", "destination": "/runes" },
    { "source": "/miners", "destination": "/miners" },
    { "source": "/social", "destination": "/social" },
    { "source": "/neural-learning", "destination": "/neural-learning" },
    { "source": "/arbitrage", "destination": "/arbitrage" },
    { "source": "/(.*)", "destination": "/$1" }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/dashboard", "dest": "/index.html" },
    { "src": "/trading", "dest": "/trading/index.html" },
    { "src": "/ordinals", "dest": "/ordinals/index.html" },
    { "src": "/runes", "dest": "/runes/index.html" },
    { "src": "/miners", "dest": "/miners/index.html" },
    { "src": "/social", "dest": "/social/index.html" },
    { "src": "/neural-learning", "dest": "/neural-learning/index.html" },
    { "src": "/arbitrage", "dest": "/arbitrage/index.html" },
    { "src": "/(.*)", "dest": "/index.html", "status": 200 }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ],
  "env": {
    "NEXT_PUBLIC_RAPIDAPI_KEY": "0ec6b2cbf9mshb7aea8fe9276945p16d2e2jsne40eb8c57dae",
    "NEXT_PUBLIC_ORDISCAN_API_KEY": "e227a764-b31b-43cf-a60c-be5daa50cd2c",
    "NEXT_PUBLIC_COINMARKETCAP_API_KEY": "c045d2a9-6f2d-44e9-8297-a88ab83b463b",
    "NEXT_PUBLIC_SUPABASE_URL": "https://tsmevnomziouyffdvwya.supabase.co",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWV2bm9temlvdXlmZmR2d3lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc0MzU3NzYsImV4cCI6MjAzMzAxMTc3Nn0.Yd-Yk-Ow-Yd-Yk-Ow-Yd-Yk-Ow-Yd-Yk-Ow",
    "NEXT_PUBLIC_API_URL": "https://api.ordiscan.com/v1/"
  }
}
```

## 2. Configuração de Navegação

Para corrigir problemas de navegação entre abas, crie um arquivo `src/utils/navigation-fix.js` com o seguinte conteúdo:

```javascript
// Este script corrige problemas de navegação no Next.js
// Adicione-o à sua página _app.js ou layout.js

// Função para corrigir problemas de navegação
export function fixNavigation() {
  if (typeof window !== 'undefined') {
    // Força a atualização da página quando o histórico muda
    const originalPushState = window.history.pushState;
    window.history.pushState = function() {
      originalPushState.apply(this, arguments);
      window.dispatchEvent(new Event('popstate'));
    };

    // Adiciona um manipulador de eventos para links
    document.addEventListener('click', (e) => {
      // Verifica se o clique foi em um link
      let target = e.target;
      while (target && target.tagName !== 'A') {
        target = target.parentNode;
        if (!target) break;
      }

      // Se for um link interno, previne o comportamento padrão e navega manualmente
      if (target && target.tagName === 'A' && target.hostname === window.location.hostname) {
        const href = target.getAttribute('href');
        if (href && href.startsWith('/')) {
          // Verifica se o link está no navbar
          const isNavLink = target.closest('nav') !== null || 
                           target.closest('.navbar') !== null || 
                           target.closest('header') !== null;
          
          // Força navegação completa para links do navbar
          if (isNavLink) {
            e.preventDefault();
            console.log('Navegando para:', href);
            window.location.href = href;
            return;
          }
          
          // Para outros links internos, também forçamos navegação completa
          // para garantir consistência
          e.preventDefault();
          window.location.href = href;
        }
      }
    });
    
    // Adiciona um manipulador para o evento popstate (navegação pelo botão voltar/avançar)
    window.addEventListener('popstate', () => {
      // Força recarregar a página quando o usuário usa os botões de navegação do navegador
      window.location.reload();
    });
    
    console.log('Navegação aprimorada inicializada');
  }
}
```

Em seguida, atualize o arquivo `src/pages/_app.js` para usar o script de navegação:

```javascript
import { useEffect } from 'react';
import { fixNavigation } from '../utils/navigation-fix';

// Componente principal da aplicação
function MyApp({ Component, pageProps }) {
  // Aplica a correção de navegação quando o componente é montado
  useEffect(() => {
    // Inicializa a correção de navegação
    fixNavigation();
    
    // Log para confirmar que o script foi carregado
    console.log('Script de navegação carregado e inicializado');
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
```

## 3. Configuração de Variáveis de Ambiente no Vercel

No dashboard do Vercel, vá para "Settings" > "Environment Variables" e adicione as seguintes variáveis:

- `NEXT_PUBLIC_RAPIDAPI_KEY`: 0ec6b2cbf9mshb7aea8fe9276945p16d2e2jsne40eb8c57dae
- `NEXT_PUBLIC_ORDISCAN_API_KEY`: e227a764-b31b-43cf-a60c-be5daa50cd2c
- `NEXT_PUBLIC_COINMARKETCAP_API_KEY`: c045d2a9-6f2d-44e9-8297-a88ab83b463b
- `NEXT_PUBLIC_SUPABASE_URL`: https://tsmevnomziouyffdvwya.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWV2bm9temlvdXlmZmR2d3lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc0MzU3NzYsImV4cCI6MjAzMzAxMTc3Nn0.Yd-Yk-Ow-Yd-Yk-Ow-Yd-Yk-Ow-Yd-Yk-Ow
- `NEXT_PUBLIC_API_URL`: https://api.ordiscan.com/v1/

## 4. Deploy no Vercel

1. Faça login no Vercel: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá para a aba "Deployments"
4. Clique em "Deploy" ou "Redeploy"
5. Selecione a branch principal (main ou master)
6. Aguarde o deploy ser concluído

## 5. Verificação após o Deploy

Após o deploy, verifique:

1. Se a navegação entre abas está funcionando corretamente
2. Se os insights neurais estão sendo exibidos na aba de arbitragem
3. Se os dados de runas são reais

Se encontrar algum problema, verifique os logs do deployment no Vercel e faça os ajustes necessários.

## 6. Configuração de Domínio Personalizado

Se estiver usando um domínio personalizado:

1. Vá para "Settings" > "Domains" no seu projeto no Vercel
2. Adicione seu domínio personalizado (por exemplo, cypheroridifuture.xyz)
3. Siga as instruções para configurar os registros DNS

## 7. Suporte e Solução de Problemas

Se encontrar problemas durante o deploy ou após o deploy, verifique:

1. Os logs do deployment no Vercel
2. As variáveis de ambiente configuradas
3. O arquivo vercel.json
4. A configuração de navegação

Para problemas específicos, consulte a documentação do Vercel: https://vercel.com/docs
