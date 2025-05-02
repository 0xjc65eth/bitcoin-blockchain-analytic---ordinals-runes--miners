'use client'

import React from 'react'
import { Card, Title, Text, Metric, Flex, ProgressBar } from '@tremor/react'
import { RiBrainLine } from 'react-icons/ri'

export function NeuralLearningStatusCard() {
  return (
    <Card className="bg-gradient-to-br from-[#181F3A] to-[#2A3A5A] border-none shadow-xl p-6">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center mr-3 border border-[#8B5CF6]/30">
          <RiBrainLine className="w-5 h-5 text-[#8B5CF6]" />
        </div>
        <Title className="text-white text-xl">Neural Learning Status</Title>
      </div>

      <div className="space-y-4">
        <div>
          <Flex>
            <Text className="text-gray-400">System Status</Text>
            <Text className="text-emerald-400 font-medium">Active</Text>
          </Flex>
          <Flex className="mt-2">
            <Text className="text-gray-400">Last Updated</Text>
            <Text className="text-white">2 minutes ago</Text>
          </Flex>
        </div>

        <div>
          <Text className="text-gray-400 mb-2">Learning Progress</Text>
          <ProgressBar value={78} color="indigo" className="mt-2" />
          <Flex className="mt-1">
            <Text className="text-xs text-gray-500">Current Epoch</Text>
            <Text className="text-xs text-gray-500">78%</Text>
          </Flex>
        </div>

        <div className="bg-[#8B5CF6]/10 p-4 rounded-lg border border-[#8B5CF6]/20">
          <Text className="text-white font-medium">Neural System Metrics</Text>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <Text className="text-xs text-gray-400">Accuracy</Text>
              <Metric className="text-white text-lg">87.4%</Metric>
            </div>
            <div>
              <Text className="text-xs text-gray-400">Precision</Text>
              <Metric className="text-white text-lg">91.2%</Metric>
            </div>
            <div>
              <Text className="text-xs text-gray-400">Recall</Text>
              <Metric className="text-white text-lg">83.9%</Metric>
            </div>
            <div>
              <Text className="text-xs text-gray-400">F1 Score</Text>
              <Metric className="text-white text-lg">87.4%</Metric>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
