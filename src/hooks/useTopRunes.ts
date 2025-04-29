import { useQuery } from '@tanstack/react-query'

export function useTopRunes() {
  return useQuery({
    queryKey: ['top-runes'],
    queryFn: async () => {
      const res = await fetch('/api/runes-top')
      if (!res.ok) throw new Error('Erro ao buscar Runes')
      return res.json()
    },
    refetchInterval: 600000, // 10 minutos
    staleTime: 300000, // 5 minutos
  })
}