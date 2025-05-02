'use client'

import { useState } from 'react'

export default function TestPage() {
  const [count, setCount] = useState(0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Test Page</h1>
      
      <div className="p-6 border border-gray-300 rounded-lg">
        <p className="mb-4">Count: {count}</p>
        <button 
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Increment
        </button>
      </div>
    </div>
  )
}
