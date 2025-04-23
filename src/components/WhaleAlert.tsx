import { useEffect, useState } from 'react'
import { fetchWhaleAlerts } from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'

interface Alert {
  id: string
  type: 'sale' | 'mint' | 'transfer'
  collection: string
  price?: number
  from: string
  to: string
  timestamp: string
  txHash: string
}

export default function WhaleAlert() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [currentAlert, setCurrentAlert] = useState<number>(0)

  useEffect(() => {
    const fetchAlerts = async () => {
      const data = await fetchWhaleAlerts()
      setAlerts(data)
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (alerts.length > 0) {
      const timer = setInterval(() => {
        setCurrentAlert((prev) => (prev + 1) % alerts.length)
      }, 5000) // Show each alert for 5 seconds

      return () => clearInterval(timer)
    }
  }, [alerts])

  if (alerts.length === 0) return null

  const alert = alerts[currentAlert]

  return (
    <AnimatePresence>
      <motion.div
        key={alert.id}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-4 right-4 max-w-sm bg-dark-200/90 backdrop-blur-sm border border-primary-600/20 rounded-lg shadow-lg p-4"
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {alert.type === 'sale' && (
              <span className="text-green-400 text-2xl">💰</span>
            )}
            {alert.type === 'mint' && (
              <span className="text-blue-400 text-2xl">🎨</span>
            )}
            {alert.type === 'transfer' && (
              <span className="text-yellow-400 text-2xl">📤</span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-primary-400">
              {alert.type === 'sale' && 'Sale Alert'}
              {alert.type === 'mint' && 'New Mint'}
              {alert.type === 'transfer' && 'Transfer Alert'}
            </h3>
            <p className="text-gray-300 mt-1">
              {alert.collection}
              {alert.price && ` - ${alert.price} ETH`}
            </p>
            <div className="mt-2 text-sm text-gray-400">
              <p className="truncate">From: {alert.from}</p>
              <p className="truncate">To: {alert.to}</p>
              <p className="mt-1">{alert.timestamp}</p>
            </div>
            <a
              href={`https://etherscan.io/tx/${alert.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              View Transaction →
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
} 