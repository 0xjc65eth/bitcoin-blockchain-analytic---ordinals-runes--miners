'use client'

import { useEffect, useState } from 'react'
import { fetchRecentTransactions, Transaction } from '@/lib/api'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchRecentTransactions()
      setTransactions(data)
      setLoading(false)
    }

    loadData()
    const interval = setInterval(loadData, 1000) // Update every second

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Loading transactions...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Bitcoin Transactions</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Mempool Size</h2>
            <p className="text-3xl font-bold">{transactions.length}</p>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Average Fee</h2>
            <p className="text-3xl font-bold">
              {(transactions.reduce((acc, tx) => acc + tx.fee, 0) / transactions.length).toFixed(2)} sats
            </p>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Total Size</h2>
            <p className="text-3xl font-bold">
              {(transactions.reduce((acc, tx) => acc + tx.size, 0) / 1000).toFixed(2)} KB
            </p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-dark-300">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Fee (sats)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Size (bytes)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-300">
                {transactions.map((tx) => (
                  <tr key={tx.txid}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      <a
                        href={`https://mempool.space/tx/${tx.txid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:text-primary-400"
                      >
                        {tx.txid.slice(0, 16)}...
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {tx.fee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {tx.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {tx.status.confirmed ? (
                        <span className="text-green-500">Confirmed</span>
                      ) : (
                        <span className="text-yellow-500">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 