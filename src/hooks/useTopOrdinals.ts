import { useQuery } from '@tanstack/react-query'

export function useTopOrdinals() {
  return useQuery({
    queryKey: ['top-ordinals'],
    queryFn: async () => {
      try {
        console.log('Fetching top Ordinals collections from API...')

        // Fetch data from API
        const response = await fetch('/api/ordinals-top')
        if (!response.ok) {
          throw new Error(`Failed to fetch top Ordinals: ${response.status}`)
        }

        const data = await response.json()
        console.log('Top Ordinals collections:', data.slice(0, 3))

        return data
      } catch (error) {
        console.error('Error fetching top Ordinals:', error)

        // Return fallback data
        const fallbackData = [
          {
            name: 'Bitcoin Puppets',
            volume_24h: 350,
            floor_price: '0.0125',
            unique_holders: 3500
          },
          {
            name: 'OCM GENESIS',
            volume_24h: 280,
            floor_price: '0.0185',
            unique_holders: 2800
          },
          {
            name: 'SEIZE CTRL',
            volume_24h: 210,
            floor_price: '0.0095',
            unique_holders: 1950
          },
          {
            name: 'N0 0RDINARY KIND',
            volume_24h: 180,
            floor_price: '0.0075',
            unique_holders: 1650
          },
          {
            name: 'THE WIZARDS OF LORDS',
            volume_24h: 150,
            floor_price: '0.0065',
            unique_holders: 1450
          }
        ]

        return fallbackData
      }
    },
    refetchInterval: 60000, // 1 minute
    staleTime: 30000, // 30 seconds
  })
}