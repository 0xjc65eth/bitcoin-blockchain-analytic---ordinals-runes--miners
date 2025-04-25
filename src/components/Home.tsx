'use client';

import React, { useState } from 'react';
import Layout from './layout';
import { DashboardTab } from './DashboardTab';
import { MiningTab } from './MiningTab';
import { SignalsTab } from './SignalsTab';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Layout>
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="bg-gray-800 rounded-lg p-1">
          <nav className="flex space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('mining')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'mining'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Mining
            </button>
            <button
              onClick={() => setActiveTab('signals')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'signals'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Signals
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'mining' && <MiningTab />}
          {activeTab === 'signals' && <SignalsTab />}
        </div>
      </div>
    </Layout>
  );
} 