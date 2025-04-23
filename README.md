# Bitcoin Blockchain Analytics

## Overview
A comprehensive real-time analytics dashboard for the Bitcoin blockchain currently in the development phase. This application provides insights into solo miners, network decentralization, Ordinals and Runes collections, blockchain transactions, and market trends based on social media activity.

## Key Features (Under Development)
- Solo miners analytics and decentralization metrics
- Ordinals and Runes collections tracking
- Real-time blockchain transaction monitoring
- Trending assets based on social media activity
- Event-based signal system for important blockchain events

## Tech Stack
- Next.js
- React
- Tailwind CSS
- Chart.js for data visualization

## Project Status
This project is currently in active development. The interface and core functionalities are being built with a focus on performance, real-time updates, and modern UI design.

## Target Audience
- Crypto traders and investors
- Blockchain analysts
- Ordinals and Runes collectors
- Crypto enthusiasts

More features and documentation will be added as development progresses.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bitcoin-blockchain-analytics.git
   cd bitcoin-blockchain-analytics
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── page.tsx        # Home page
│   ├── miners/         # Miners analytics page
│   ├── transactions/   # Transactions page
│   └── collections/    # Ordinals & Runes page
├── components/         # React components
├── lib/               # Utility functions and API calls
└── styles/            # Global styles
```

## API Integration

The app integrates with the following APIs:

- **Mempool.space**: For blockchain and miner data
- **Ordinals.com**: For Ordinals and Runes data
- **X API**: For social activity data (requires API key)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 