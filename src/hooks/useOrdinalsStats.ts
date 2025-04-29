import { useQuery } from '@tanstack/react-query'

export function useOrdinalsStats() {
  return useQuery({
    queryKey: ['ordinals-stats'],
    queryFn: async () => {
      const res = await fetch('/api/ordinals-stats')
      if (!res.ok) throw new Error('Erro ao buscar estatísticas de Ordinals')
      return res.json()
    },
    refetchInterval: 600000, // 10 minutos
    staleTime: 300000, // 5 minutos
  })
}
