'use client'

import { useState, useEffect } from 'react'
import { fetchLatestInscriptions, Inscription } from '@/lib/api'

export default function InscriptionsPage() {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchLatestInscriptions()
      setInscriptions(data)
      setLoading(false)
    }

    loadData()
    const interval = setInterval(loadData, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
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
            Latest Inscriptions
          </h1>
          <div className="flex gap-4">
            <select className="bg-dark-200/50 border border-primary-600/20 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-primary-500">
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="size">Size</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inscriptions.map((inscription) => (
            <div
              key={inscription.id}
              className="bg-dark-200/50 backdrop-blur-sm border border-primary-600/20 rounded-xl p-6 hover:bg-dark-300/50 transition-all duration-300"
            >
              <div className="aspect-square bg-dark-300 rounded-lg mb-4 overflow-hidden">
                {inscription.contentType.startsWith('image/') ? (
                  <img
                    src={inscription.content}
                    alt={`Inscription ${inscription.number}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    {inscription.contentType}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">#{inscription.number}</span>
                  <span className="text-sm text-gray-400">{inscription.timestamp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Owner</span>
                  <span className="text-sm text-primary-400">{inscription.owner}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Size</span>
                  <span className="text-sm text-white">{(inscription.size / 1024).toFixed(2)} KB</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 