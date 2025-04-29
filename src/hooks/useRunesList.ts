import { useQuery } from '@tanstack/react-query'

export function useRunesList() {
  return useQuery({
    queryKey: ['runes-list'],
    queryFn: async () => {
      const res = await fetch('/api/runes-list')
      if (!res.ok) throw new Error('Erro ao buscar lista de Runes')
      return res.json()
    },
    refetchInterval: 600000, // 10 minutos
    staleTime: 300000, // 5 minutos
  })
}
