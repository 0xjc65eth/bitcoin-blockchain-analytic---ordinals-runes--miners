'use client'

import { useState, useEffect } from 'react'
import { fetchCollections, Collection } from '@/lib/api'

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCollections()
      setCollections(data)
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-dark-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-dark-200/50 rounded-xl p-6">
                  <div className="h-48 bg-dark-300 rounded-lg mb-4"></div>
                  <div className="h-6 bg-dark-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-dark-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-purple bg-clip-text text-transparent">
            Top Collections
          </h1>
          <div className="flex gap-4">
            <select className="bg-dark-200/50 border border-primary-600/20 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-primary-500">
              <option value="volume">Volume</option>
              <option value="floor">Floor Price</option>
              <option value="supply">Supply</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 rounded-xl p-6 hover:bg-dark-300/50 transition-all duration-300"
            >
              <div className="aspect-square bg-dark-300 rounded-lg mb-4 overflow-hidden">
                <img
                  src={collection.imageUrl}
                  alt={collection.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold mb-4">{collection.name}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Floor Price</p>
                  <p className="text-lg font-semibold">{collection.floorPrice.toFixed(4)} BTC</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">24h Volume</p>
                  <p className="text-lg font-semibold">{collection.volume24h.toFixed(2)} BTC</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Supply</p>
                  <p className="text-lg font-semibold">{collection.totalSupply.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 