# Bitcoin Blockchain Analytics - Ordinals, Runes & Miners

A comprehensive analytics platform for Bitcoin blockchain data, focusing on Ordinals, Runes, and Miner statistics.

## Features

- Real-time blockchain data visualization
- Ordinals and Runes tracking
- Miner statistics and analytics
- Interactive charts and dashboards
- Historical data analysis

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/bitcoin-blockchain-analytics.git
cd bitcoin-blockchain-analytics
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_ORDISCAN_API_KEY=your_ordiscan_api_key
NEXT_PUBLIC_MAGICEDEN_API_KEY=your_magiceden_api_key
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Verification

Before starting the server, you can run the verification script to ensure everything is set up correctly:

```bash
node scripts/verify.js
```

## Building for Production

```bash
npm run build
npm start
```

## License

MIT 