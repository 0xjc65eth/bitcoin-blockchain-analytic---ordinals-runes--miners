'use client'

import { Header } from '@/components/header'
import { DashboardCard } from '@/components/dashboard-card'
import { useOrdiscanData } from '@/hooks/useOrdiscanData'
import { MiningStatsCard } from '@/components/mining-stats-card'
import { useMempoolHashrate } from '@/hooks/useMempoolHashrate'
import { useMempoolDifficulty } from '@/hooks/useMempoolDifficulty'
import { useMempoolPools } from '@/hooks/useMempoolPools'
import { useMempoolBlocks } from '@/hooks/useMempoolBlocks'
import { useMempoolDifficultyAdjustment } from '@/hooks/useMempoolDifficultyAdjustment'
import { BarChart, DonutChart, LineChart, ProgressBar, Title, Text, Flex, BadgeDelta, Card, Grid, Col } from '@tremor/react'

export default function MinersPage() {
  const { data: hashrateData, isLoading: isHashrateLoading } = useMempoolHashrate()
  const { data: difficultyData, isLoading: isDifficultyLoading } = useMempoolDifficulty()
  const { data: poolsData, isLoading: isPoolsLoading } = useMempoolPools()
  const { data: blocksData, isLoading: isBlocksLoading } = useMempoolBlocks()
  const { data: diffAdjData, isLoading: isDiffAdjLoading } = useMempoolDifficultyAdjustment()

  // Cálculo de descentralização (exemplo: % do maior pool)
  const decentralization = poolsData && poolsData.length > 0 ? 100 - poolsData[0].share : 0

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#8B5CF6] text-transparent bg-clip-text">MINERS & NETWORK HEALTH</h1>
        <h2 className="text-lg text-muted-foreground mb-6">Dados em tempo real da mineração Bitcoin</h2>
        <Grid numItems={1} numItemsSm={2} className="gap-6 mb-6">
          <Col>
            <Card className="bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white border-none shadow-xl p-6">
              <Flex alignItems="center" className="mb-2">
                <Title className="text-white text-xl">Hashrate da Rede</Title>
                <span className="ml-2 px-2 py-1 rounded bg-emerald-500 text-xs font-bold animate-pulse">Atualização em tempo real</span>
              </Flex>
              <Text className="text-3xl font-bold">
                {isHashrateLoading || !Array.isArray(hashrateData) || hashrateData.length === 0
                  ? 'Sem dados'
                  : `${(hashrateData[hashrateData.length - 1].avgHashrate / 1e18).toLocaleString('en-US', { maximumFractionDigits: 2 })} EH/s`}
              </Text>
              <LineChart
                className="h-32 mt-4"
                data={Array.isArray(hashrateData) ? hashrateData : []}
                index="timestamp"
                categories={["avgHashrate"]}
                colors={["emerald"]}
                showAnimation
                showLegend={false}
                showGridLines={false}
                valueFormatter={v => `${(v/1e18).toFixed(2)} EH/s`}
              />
            </Card>
          </Col>
          <Col>
            <Card className="bg-gradient-to-br from-[#f59e42] to-[#fbbf24] text-white border-none shadow-xl p-6">
              <Flex alignItems="center" className="mb-2">
                <Title className="text-white text-xl">Dificuldade Atual</Title>
                <span className="ml-2 px-2 py-1 rounded bg-yellow-400 text-xs font-bold animate-pulse">Atualização em tempo real</span>
              </Flex>
              <Text className="text-3xl font-bold">{isDifficultyLoading || !difficultyData ? '...' : `${(difficultyData/1e12).toLocaleString('en-US', { maximumFractionDigits: 2 })} T`}</Text>
              <Text className="mt-2 text-white/80 text-xs">Valor computacional necessário para minerar um bloco</Text>
              <ProgressBar value={isDifficultyLoading ? 0 : (difficultyData/1e13)} color="amber" className="mt-2" />
            </Card>
          </Col>
          <Col>
            <Card className="bg-gradient-to-br from-[#34d399] to-[#10b981] text-white border-none shadow-xl p-6">
              <Title className="text-white text-xl mb-2">Distribuição dos Pools</Title>
              <DonutChart
                className="h-40"
                data={poolsData ? poolsData.map((pool: any) => ({ name: pool.name, value: pool.share })) : []}
                category="value"
                index="name"
                colors={["emerald", "violet", "amber", "rose", "cyan", "blue", "pink"]}
                showAnimation
                showTooltip
              />
              <Text className="mt-2 text-white/80 text-xs">Quem domina a mineração hoje</Text>
            </Card>
          </Col>
          <Col>
            <Card className="bg-gradient-to-br from-[#f43f5e] to-[#fbbf24] text-white border-none shadow-xl p-6">
              <Title className="text-white text-xl mb-2">Descentralização</Title>
              <Text className="text-2xl font-bold">{isPoolsLoading || !poolsData ? '...' : `${decentralization.toLocaleString('en-US', { maximumFractionDigits: 2 })}%`}</Text>
              <ProgressBar value={decentralization} color="emerald" className="mt-2" />
              <Text className="mt-2 text-white/80 text-xs">Quanto falta para descentralizar totalmente</Text>
            </Card>
          </Col>
        </Grid>
        <Grid numItems={1} className="gap-6 mb-6">
          <Col>
            <Card className="bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white border-none shadow-xl p-6">
              <Title className="text-white text-xl mb-2">Blocos Minerados Recentemente</Title>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="text-left text-white/80">
                      <th className="pr-4">Altura</th>
                      <th className="pr-4">Pool</th>
                      <th className="pr-4">Timestamp</th>
                      <th className="pr-4">Reward</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isBlocksLoading ? (
                      <tr><td colSpan={4}>Carregando...</td></tr>
                    ) : (
                      blocksData?.slice(0, 10).map((block: any, idx: number) => (
                        <tr key={idx} className="border-b border-white/10">
                          <td className="pr-4">{block.height}</td>
                          <td className="pr-4">{block.poolName || 'Unknown'}</td>
                          <td className="pr-4">{new Date(block.timestamp * 1000).toLocaleString('en-US')}</td>
                          <td className="pr-4">{(block.reward / 1e8).toLocaleString('en-US', { maximumFractionDigits: 2 })} BTC</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </Col>
        </Grid>
        <Grid numItems={1} className="gap-6 mb-6">
          <Col>
            <Card className="bg-gradient-to-br from-[#34d399] to-[#10b981] text-white border-none shadow-xl p-6">
              <Title className="text-white text-xl mb-2">Próximo Ajuste de Dificuldade</Title>
              <Text className="text-lg font-bold">{isDiffAdjLoading || !diffAdjData ? '...' : `${diffAdjData?.progressPercent?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || 0}% completo`}</Text>
              <ProgressBar value={diffAdjData?.progressPercent || 0} color="emerald" className="mt-2" />
              <Text className="mt-2 text-white/80 text-xs">Estimativa de tempo: {diffAdjData?.remainingBlocks} blocos restantes</Text>
            </Card>
          </Col>
        </Grid>
        <Grid numItems={1} className="gap-6 mb-6">
          <Col>
            <Card className="bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] text-white border-none shadow-xl p-6">
              <Title className="text-white text-xl mb-2">Insights Neurais</Title>
              <Text className="text-lg font-bold">Sinal: {decentralization > 80 ? 'Descentralização saudável' : 'Risco de centralização'}</Text>
              <Text className="mt-2 text-white/80 text-xs">{decentralization > 80 ? 'A rede está bem distribuída entre pools.' : 'Atenção: concentração excessiva em poucos pools pode ser um risco.'}</Text>
              <Text className="mt-2 text-white/80 text-xs">Recomendação: {decentralization > 80 ? 'Continue monitorando a distribuição.' : 'Considere apoiar pools menores para maior segurança da rede.'}</Text>
            </Card>
          </Col>
        </Grid>
      </div>
      {/* Tratamento de erro global */}
      {(!hashrateData || !difficultyData || !poolsData || !blocksData || !diffAdjData) && (
        <div className="mt-8 p-4 bg-rose-900 text-white rounded-xl text-center">
          <b>Erro ao carregar dados da API do mempool.space.</b><br />
          Tente novamente em instantes ou verifique o status do serviço.
        </div>
      )}
    </main>
  )
}

function MiningPoolsCard() {
  return (
    <DashboardCard title="Mining Pools">
      <div className="space-y-4">
        <p className="text-muted-foreground">Mining pool data will be displayed here.</p>
        <p className="text-sm">Under Development</p>
      </div>
    </DashboardCard>
  )
} 