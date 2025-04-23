# Bitcoin Blockchain Analytics - Ordinals, Runes & Miners

![Bitcoin Analytics](https://img.shields.io/badge/Bitcoin-Analytics-orange)
![Development Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Next.js](https://img.shields.io/badge/Next.js-14.1.0-blue)
![React](https://img.shields.io/badge/React-18-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📊 Overview

A comprehensive real-time analytics dashboard for the Bitcoin blockchain currently in active development. This application provides advanced insights into solo miners, network decentralization, Ordinals and Runes collections, blockchain transactions, and market trends based on social media activity.

The project aims to serve as a central hub for Bitcoin ecosystem analytics with a focus on decentralization metrics, digital collectibles (Ordinals/Runes), and real-time blockchain activity monitoring.

## 🔑 Key Features

### Solo Miners Analytics
- **Hashrate Tracking**: Monitor individual solo miners' hashrate contributions (TH/s or PH/s)
- **Network Percentage**: View percentage of total Bitcoin network hashrate per miner
- **Decentralization Index**: Track the Nakamoto Coefficient (number of entities controlling 51% of hashrate)
- **Progress Visualization**: Monitor progress toward ideal decentralization (50+ entities < 51% hashrate)
- **Interactive Charts**: Pie charts and histograms for hashrate distribution visualization

### Ordinals & Runes Collections
- **Miner Wallet Explorer**: View Ordinals and Runes associated with miners' wallets
- **Collection Details**: Examine inscription ID, rarity, and market value metrics
- **Grid & Table Views**: Toggle between visual grid and detailed table displays
- **Filtering Capabilities**: Sort and filter by collection, rarity, or value
- **Market Analytics**: Track floor prices, volume, and market capitalization

### Blockchain Transaction Dashboard
- **Real-time Transaction Feed**: Live streaming of Bitcoin blockchain transactions
- **Detailed Transaction Info**: TXID, amount, addresses, fees, and confirmation status
- **Aggregate Statistics**: Transactions per block, average fees, and mempool size
- **Customizable Views**: Filter transactions by value range, fee rate, or address
- **Visual Analytics**: Charts for transaction volume and fee distribution

### Trending Analytics (X-based)
- **Top Trending Assets**: Identify top 10 trending Ordinals and Runes based on social activity
- **Trend Scoring**: Advanced metrics based on mentions, likes, and reposts
- **Associated Wallet Activity**: Track transfers and activity related to trending assets
- **Keyword Analysis**: Word cloud visualization of trending topics and terms
- **Historical Trend Data**: Track trends over time with historical analytics

### Signal Trigger System
- **Customizable Alerts**: Set up notifications for significant blockchain events
- **Trigger Conditions**: Monitor for hashrate changes, large transactions, social spikes
- **Multi-channel Notifications**: In-app alerts, email options, and push notifications
- **Signal History**: Comprehensive log of past signals with timestamps and details
- **Threshold Configuration**: User-configurable settings for alert preferences

## 🧠 Architecture & Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **UI Library**: React 18 with Hooks and Context API
- **Styling**: Tailwind CSS for responsive design
- **Data Visualization**: Chart.js and ApexCharts for interactive charts
- **State Management**: React Context and hooks-based state management
- **Animations**: Framer Motion for smooth transitions and UI effects

### Backend & Data Processing
- **API Layer**: Next.js API routes with serverless functions
- **Real-time Updates**: WebSocket connections for live data
- **Caching Strategy**: Redis for high-performance data caching
- **Database**: PostgreSQL for historical data and user preferences
- **Authentication**: Auth.js (formerly NextAuth) for secure user authentication

### Data Sources
- **Blockchain Data**: Mempool.space API (transactions, blocks, miners)
- **Ordinals & Runes**: Ord.io API and Magic Eden API for collection data
- **Social Intelligence**: X Platform API for trend analysis
- **On-chain Analytics**: CryptoQuant for advanced mining data

## 📐 Implementation Details

### Responsive Design
The application is built with a mobile-first approach, ensuring full functionality across devices of all sizes. The UI uses a modern dark theme with neon accents (blue, purple) for optimal data visualization contrast.

### Performance Optimization
- Client-side data caching to reduce API calls
- Dynamic imports and code splitting for faster page loads
- Server-side rendering for SEO and initial page load performance
- Image optimization and lazy loading for visual assets

### Security Measures
- API key encryption using AES-256
- Rate limiting for all API endpoints
- HTTPS and secure WebSocket connections
- Regular security audits and dependency updates

## 🔧 Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/0xjc65eth/bitcoin-blockchain-analytic---ordinals-runes--miners.git
   cd bitcoin-blockchain-analytic---ordinals-runes--miners
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Development Workflow

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git commit -m "Add your feature description"
   ```

3. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a pull request for review.

## 📂 Project Structure

```
src/
├── app/                  # Next.js app directory
│   ├── page.tsx         # Home page / Dashboard
│   ├── layout.tsx       # Root layout with navigation
│   ├── miners/          # Miners analytics pages
│   ├── ordinals/        # Ordinals collection pages
│   ├── runes/           # Runes collection pages
│   ├── transactions/    # Blockchain transaction pages
│   └── api/             # API routes for data
├── components/          # Reusable React components
│   ├── charts/          # Chart components
│   ├── tables/          # Table components
│   ├── cards/           # Card components
│   └── ui/              # Basic UI components
├── lib/                 # Utility functions and services
│   ├── api.ts           # API client functions
│   ├── hooks/           # Custom React hooks
│   └── utils/           # Helper functions
├── types/               # TypeScript type definitions
└── styles/              # Global styles and theme
```

## 🛣️ Roadmap

### Phase 1 (Months 1-2)
- API integration setup
- Backend infrastructure
- Basic UI components
- Authentication system

### Phase 2 (Months 3-4)
- Feature development (miners, transactions)
- Real-time data streaming
- Data visualization components
- Initial deployment

### Phase 3 (Months 5-6)
- Signal system implementation
- Advanced trend analytics
- UI polish and optimization
- Beta testing and feedback

### Future Enhancements
- Support for additional blockchains (e.g., Ethereum)
- AI-based price predictions for Ordinals/Runes
- Social features (shared watchlists)
- Mobile applications

## 📱 API Documentation

The application uses several APIs that will be documented here as development progresses:

### Internal APIs

- `/api/collections` - Get all collections data
- `/api/collections/[id]` - Get specific collection by ID
- `/api/miners` - Get miners data and statistics
- `/api/transactions` - Get real-time transaction data
- `/api/trends` - Get trending assets based on social data

### External APIs Used

- **Mempool.space API**: For blockchain and miner data
- **Ord.io API**: For Ordinals data and analytics
- **Magic Eden API**: For Runes collections data
- **X API**: For social media sentiment and trend analysis

## 🌐 Deployment

Deployment instructions will be added as the project approaches beta release.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue to discuss your ideas.

### Contribution Guidelines

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests (when available)
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

Project maintained by [0xjc65eth](https://github.com/0xjc65eth)

---

<div align="center">
  <i>Bitcoin Blockchain Analytics - Making blockchain data accessible and actionable</i>
</div> 