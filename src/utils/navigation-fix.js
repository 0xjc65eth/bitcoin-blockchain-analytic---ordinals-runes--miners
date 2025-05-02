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
