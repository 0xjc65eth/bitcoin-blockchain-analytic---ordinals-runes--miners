"use client"

import { useState, useEffect } from 'react'

interface WalletState {
  isConnected: boolean
  address: string
  balance: number
  connect: () => Promise<void>
  disconnect: () => void
}

export function useWallet(): WalletState {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState(0)

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check if we have a stored connection
        // Only access localStorage in the browser
        if (typeof window !== 'undefined') {
          const storedAddress = window.localStorage.getItem('walletAddress')
          if (storedAddress) {
            setIsConnected(true)
            setAddress(storedAddress)
            // You would typically fetch the balance here
            setBalance(0.05) // Mock balance for demo
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }

    checkConnection()
  }, [])

  const connect = async () => {
    try {
      // In a real implementation, this would connect to a real wallet
      // For demo purposes, we'll simulate a connection

      // Simulate wallet selection and connection delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Generate a mock Bitcoin address
      const mockAddress = 'bc1q' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

      // Store the connection
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('walletAddress', mockAddress)
      }

      // Update state
      setIsConnected(true)
      setAddress(mockAddress)
      setBalance(0.05) // Mock balance

      console.log('Connected with address:', mockAddress)
      return mockAddress
    } catch (error) {
      console.error('Error connecting wallet:', error)
      throw error
    }
  }

  const disconnect = () => {
    try {
      // Clear stored connection
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('walletAddress')
      }

      // Update state
      setIsConnected(false)
      setAddress('')
      setBalance(0)
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
    }
  }

  return {
    isConnected,
    address,
    balance,
    connect,
    disconnect
  }
}
