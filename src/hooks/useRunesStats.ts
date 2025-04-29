import { useQuery } from '@tanstack/react-query'

export function useRunesStats() {
  return useQuery({
    queryKey: ['runes-stats'],
    queryFn: async () => {
      const res = await fetch('/api/runes-stats')
      if (!res.ok) throw new Error('Erro ao buscar estatísticas de Runes')
      return res.json()
    },
    refetchInterval: 600000, // 10 minutos
    staleTime: 300000, // 5 minutos
  })
}
