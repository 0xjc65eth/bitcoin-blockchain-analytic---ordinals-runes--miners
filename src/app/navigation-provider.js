'use client'

import { useEffect } from 'react'
import { fixNavigation } from '../utils/navigation-fix'

export function NavigationProvider({ children }) {
  useEffect(() => {
    // Inicializa a correção de navegação
    try {
      console.log('🔧 Inicializando script de navegação (App Router)...')
      fixNavigation()
      console.log('✅ Script de navegação inicializado com sucesso (App Router)!')
    } catch (error) {
      console.error('❌ Erro ao inicializar script de navegação (App Router):', error)
    }
    
    // Adiciona um manipulador de erros não tratados
    window.addEventListener('error', (event) => {
      console.error('❌ Erro não tratado (App Router):', event.error)
    })
    
    // Adiciona um manipulador de rejeições de promessas não tratadas
    window.addEventListener('unhandledrejection', (event) => {
      console.error('❌ Promessa rejeitada não tratada (App Router):', event.reason)
    })
    
    // Retorna uma função de limpeza
    return () => {
      // Remove os manipuladores de eventos quando o componente é desmontado
      window.removeEventListener('error', () => {})
      window.removeEventListener('unhandledrejection', () => {})
    }
  }, [])

  return children
}
