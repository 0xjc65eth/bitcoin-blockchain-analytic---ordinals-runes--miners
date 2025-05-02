# CYPHER ORDI FUTURE - VERSION 2.2.3.3

![Bitcoin Analytics Dashboard](https://raw.githubusercontent.com/0xjc65eth/bitcoin-blockchain-analytic---ordinals-runes--miners/main/public/dashboard-preview.png)

Uma plataforma avançada de análise da blockchain Bitcoin, focada em Ordinals, Runes e mineração, com recursos de arbitragem em tempo real, análise de descentralização da rede e sistema de aprendizado neural contínuo.

## 🆕 Novidades da Versão 2.2.3.3

Esta versão traz um sistema de aprendizado neural 24/7 com armazenamento em nuvem e melhorias significativas:

- ✅ Sistema de aprendizado neural contínuo 24/7 para insights mais precisos
- ✅ Sincronização com armazenamento em nuvem (Supabase) para aprendizado contínuo mesmo com o computador desligado
- ✅ Análise SMC aprimorada com recomendações de trade e níveis de TP/SL
- ✅ Detecção de oportunidades de arbitragem com maior precisão
- ✅ Previsões de mercado para Ordinals e Runes com base em dados históricos
- ✅ Interface dedicada para monitoramento do sistema neural e sincronização com a nuvem
- ✅ Modelos especializados para diferentes aspectos do mercado
- ✅ Insights gerados com níveis de confiança e explicações detalhadas
- ✅ Aprendizado contínuo que melhora com o tempo e persiste entre sessões

## ✨ Principais Recursos

- **Dashboard Completo**: Visualização de dados em tempo real da blockchain Bitcoin
- **Sistema Neural 24/7**: Aprendizado contínuo para insights cada vez mais precisos
- **Análise de Mineração**: Estatísticas detalhadas sobre pools, hashrate e descentralização
- **Ordinals Explorer**: Explore e analise coleções de Ordinals com previsões de mercado
- **Runes Tracker**: Acompanhe tokens Runes e suas métricas com análise neural
- **Arbitragem em Tempo Real**: Oportunidades de arbitragem entre marketplaces com cálculos precisos de lucro
- **Análise SMC Avançada**: Identificação de estruturas de mercado com níveis de TP/SL
- **Design Moderno**: Interface atraente e profissional
- **Web3 Wallet Integration**: Conecte-se com carteiras Bitcoin (Unisat, Xverse, Magic Eden)
- **Card ID para NFT Holders**: Identificação e agradecimento aos detentores de coleções

## 📊 Componentes Principais

### Sistema de Aprendizado Neural 24/7 com Armazenamento em Nuvem

- Aprendizado contínuo 24 horas por dia, 7 dias por semana
- Sincronização com armazenamento em nuvem (Supabase)
- Continuidade de aprendizado mesmo com o computador desligado
- Modelos especializados para diferentes aspectos do mercado
- Coleta e processamento automático de dados
- Geração de insights com níveis de confiança
- Interface dedicada para monitoramento do sistema
- Melhoria contínua da precisão das previsões
- Explicações detalhadas para cada insight gerado
- Preservação de modelos, dados de treinamento e insights na nuvem

### Análise SMC (Smart Money Concepts)

- Identificação de estruturas de mercado
- Detecção de order blocks e fair value gaps
- Recomendações de trade com níveis de entrada
- Níveis precisos de take profit e stop loss
- Cálculo de risk/reward ratio
- Análise de liquidez e volume profile

### Mineração Bitcoin

- Hashrate da rede em tempo real
- Distribuição dos pools de mineração
- Análise de risco de centralização
- Próximo ajuste de dificuldade
- Informações sobre mineradoras principais
- Guia para mineração descentralizada

### Arbitragem

- Oportunidades de arbitragem em tempo real com análise neural
- Cálculos precisos de lucro considerando taxas
- Links diretos para compra e venda
- Análise de risco para cada oportunidade
- Detalhes específicos sobre onde comprar e vender
- Previsão de janelas de oportunidade

### Ordinals

- Explorador de coleções com análise neural
- Previsões de preço para coleções populares
- Análise de preços e volumes
- Rastreamento de inscrições
- Estatísticas de mercado
- Detecção de tendências emergentes

### Runes

- Rastreamento de tokens Runes com análise neural
- Previsões de preço para tokens populares
- Análise de distribuição
- Métricas de mercado
- Detecção de padrões de acumulação/distribuição

## 🛠️ Tech Stack

- **Next.js 14**: Framework React com App Router
- **TypeScript**: Tipagem estática para código mais seguro
- **Tailwind CSS**: Framework CSS para design responsivo
- **Tremor**: Componentes de visualização de dados
- **Redux Toolkit**: Gerenciamento de estado
- **React Query**: Gerenciamento de dados do servidor
- **Web3 React**: Integração com carteiras Bitcoin
- **Chart.js**: Visualizações de dados avançadas
- **Headless UI**: Componentes acessíveis
- **Neural Learning System**: Sistema de aprendizado neural contínuo
- **EventEmitter**: Sistema de eventos para comunicação em tempo real
- **Supabase**: Armazenamento em nuvem para dados de aprendizado neural
- **PostgreSQL**: Banco de dados relacional (via Supabase)

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/0xjc65eth/bitcoin-blockchain-analytic---ordinals-runes--miners.git
cd bitcoin-blockchain-analytic---ordinals-runes--miners
```

2. Install dependencies:
```bash
npm install
# ou
yarn install
```

3. Configure Supabase para o armazenamento em nuvem do sistema neural:
   - Crie uma conta no [Supabase](https://supabase.com/)
   - Crie um novo projeto
   - No SQL Editor, execute os seguintes comandos para criar as tabelas necessárias:

```sql
-- Tabela para modelos neurais
CREATE TABLE neural_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  accuracy FLOAT NOT NULL,
  last_training TIMESTAMP WITH TIME ZONE NOT NULL,
  data_points INTEGER NOT NULL,
  weights JSONB NOT NULL,
  biases JSONB NOT NULL,
  features TEXT[] NOT NULL,
  target_metric TEXT NOT NULL,
  prediction_history JSONB NOT NULL,
  performance_metrics JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Tabela para dados de mercado
CREATE TABLE market_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  btc_price FLOAT NOT NULL,
  btc_change_24h FLOAT,
  volume_24h FLOAT,
  market_cap FLOAT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Tabela para dados de mempool
CREATE TABLE mempool_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pending_transactions INTEGER,
  average_fee_rate FLOAT,
  mempool_size INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Tabela para dados de ordinals
CREATE TABLE ordinal_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  volume_24h FLOAT,
  market_cap FLOAT,
  unique_holders INTEGER,
  inscription_rate INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Tabela para dados de runes
CREATE TABLE rune_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  volume_24h FLOAT,
  market_cap FLOAT,
  unique_holders INTEGER,
  mint_rate INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Tabela para insights neurais
CREATE TABLE neural_insights (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  model_id TEXT NOT NULL,
  confidence FLOAT NOT NULL,
  type TEXT NOT NULL,
  prediction JSONB NOT NULL,
  explanation TEXT NOT NULL,
  related_metrics TEXT[] NOT NULL,
  data_points INTEGER NOT NULL
);
```

4. Create a `.env.local` file in the root directory and add your environment variables:
```env
NEXT_PUBLIC_ORDISCAN_API_KEY=e227a764-b31b-43cf-a60c-be5daa50cd2c
NEXT_PUBLIC_COINMARKETCAP_API_KEY=c045d2a9-6f2d-44e9-8297-a88ab83b463b

# Supabase configuration for neural learning cloud storage
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. Run the development server:
```bash
npm run dev
# ou
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📡 APIs Integradas

- **Mempool.space API**: Dados em tempo real da blockchain Bitcoin
- **CoinMarketCap API**: Preços de criptomoedas em tempo real
- **Ordiscan API**: Dados de Ordinals e inscrições

## 🌐 Mineração com OMB Pool

Para contribuir com a descentralização da rede Bitcoin, considere minerar com a OMB Pool:

- **Stratum Host**: ombpool.com
- **Stratum Port**: 2018
- **Stratum User**: SEU_ENDEREÇO_BTC
- **Stratum Password**: X

## ⚠️ Aviso de Risco

A negociação de arbitragem e investimentos em criptomoedas envolvem riscos significativos:

- Volatilidade do mercado
- Problemas de liquidez
- Taxas de transação
- Atrasos na execução

O desempenho passado não é indicativo de resultados futuros. Sempre faça sua própria pesquisa antes de negociar e nunca invista mais do que pode perder.

## 📂 Estrutura do Projeto

```
src/
├── app/              # Páginas Next.js com App Router
├── components/       # Componentes UI reutilizáveis
├── hooks/            # React hooks personalizados
├── services/         # Serviços de API e integrações
├── config/           # Configurações e constantes
└── types/            # Definições de tipos TypeScript
```

## 🤝 Contribuindo

1. Faça um fork do repositório
2. Crie sua branch de feature (`git checkout -b feature/recurso-incrivel`)
3. Commit suas alterações (`git commit -m 'Adiciona recurso incrível'`)
4. Push para a branch (`git push origin feature/recurso-incrivel`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 💬 Suporte

Para suporte, entre em contato através do GitHub ou abra uma issue no repositório.

## 🙏 Donate

Se você achar este projeto útil, considere fazer uma doação:
```
bc1q3ghzvpp0l74q3ntu8actyt0qcvl2u273flg5rs
```
