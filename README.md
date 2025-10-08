# 🔥 EVM Incinerator - Asset Sweeper

**Convert Your Remaining Tokens to ETH**

EVM Incinerator is a powerful DeFi application that allows users to sweep multiple low-value tokens from their wallet and convert them into ETH in a single transaction. Perfect for cleaning up your portfolio and covering gas fees!

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20App-blue?style=for-the-badge)](https://assetscooper.xyz)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Powered by Wagmi](https://img.shields.io/badge/Powered%20by-Wagmi-orange?style=for-the-badge)](https://wagmi.sh/)

## 🎯 What is EVM Incinerator?

EVM Incinerator solves a common problem in DeFi: **dust tokens**. These are small amounts of various tokens scattered across your wallet that are often worth less than the gas fees required to swap them individually. Our application allows you to:

- 🧹 **Clean your portfolio** by sweeping all low-value tokens
- ⛽ **Cover gas fees** by converting dust into ETH
- 💰 **Maximize value** through efficient batch swapping
- 🚀 **One-click operation** for multiple tokens

## ✨ Key Features

### 🔄 **Dual Wallet Support**

- **Smart Wallets**: Seamless batch approval and swapping via Paraswap
- **EOA Wallets**: Direct contract interaction with custom AssetScooper contract
- **Auto-detection**: Automatically detects wallet type and optimizes flow

### 🎛️ **Advanced Token Management**

- **Token Selection**: Interactive grid/list view for token selection
- **Batch Operations**: Select all, clear all, or individual token management
- **Real-time Balances**: Live balance updates and USD value calculations
- **Liquidity Detection**: Automatically filters tokens with available liquidity

### ⚡ **Efficient Swapping**

- **Batch Approvals**: Approve multiple tokens in a single transaction
- **Gas Optimization**: Minimize gas costs through smart batching
- **Slippage Control**: Customizable slippage tolerance settings
- **Transaction Simulation**: Preview swaps before execution

### 🎨 **Modern UI/UX**

- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Theme**: Sleek, modern interface with smooth animations
- **Interactive Modals**: Intuitive approval and confirmation flows
- **Real-time Updates**: Live transaction status and progress tracking

## 🏗️ Architecture

### **Smart Contracts**

- **AssetScooper Contract**: `0x02d08eF29d77c793Dd3367fdAD7da325e2c5AEB1`
  - Custom contract for EOA wallet token sweeping
  - Integrates with Uniswap V3 for optimal routing
  - Includes reentrancy protection and error handling

- **Paraswap Integration**: `0x6a000f20005980200259b80c5102003040001068`
  - Used for smart wallet batch swapping
  - Access to multiple DEX aggregators
  - Optimal price discovery across protocols

### **Supported Networks**

- **Base** (Primary)
- **Ethereum**
- **Arbitrum**
- **Optimism**
- **Polygon**

### **Technology Stack**

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI Library**: Chakra UI with custom theming
- **Web3**: Wagmi v2, Viem v2, Web3Modal
- **State Management**: React Context, Apollo Client
- **Styling**: Tailwind CSS, Framer Motion
- **Data**: Moralis API, Covalent API, Mobula API

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Yarn or npm
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/evm-incinerator.git
   cd evm-incinerator
   ```

2. **Install dependencies**

   ```bash
   yarn install
   # or
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Required environment variables:

   ```bash
   # OnchainKit Configuration
   NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=EVM Incinerator
   NEXT_PUBLIC_URL=https://assetscooper.xyz
   NEXT_PUBLIC_ICON_URL=https://assetscooper.xyz/icon.png
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key

   # Frame Configuration (for MiniKit)
   FARCASTER_HEADER=your_farcaster_header
   FARCASTER_PAYLOAD=your_farcaster_payload
   FARCASTER_SIGNATURE=your_farcaster_signature
   NEXT_PUBLIC_APP_ICON=https://assetscooper.xyz/icon.png
   NEXT_PUBLIC_APP_DESCRIPTION=Convert your remaining tokens to ETH
   NEXT_PUBLIC_APP_HERO_IMAGE=https://assetscooper.xyz/hero.png

   # Redis Configuration (for notifications)
   REDIS_URL=your_redis_url
   REDIS_TOKEN=your_redis_token

   # API Keys
   NEXT_PUBLIC_MORALIS_API_KEY=your_moralis_key
   NEXT_PUBLIC_COVALENT_API_KEY=your_covalent_key
   NEXT_PUBLIC_MOBULA_API_KEY=your_mobula_key
   ```

4. **Start development server**

   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### **For Smart Wallets**

1. Connect your smart wallet (Coinbase Smart Wallet, etc.)
2. Select tokens you want to sweep
3. Click "Sweep Tokens" - approvals and swaps happen automatically
4. Receive ETH in your wallet

### **For EOA Wallets (MetaMask, etc.)**

1. Connect your wallet
2. Select tokens to sweep
3. Approve tokens (can be done individually or in batch)
4. Execute the sweep transaction
5. Receive ETH in your wallet

## 🛠️ Development

### **Project Structure**

```
evm-incinerator/
├── app/                    # Next.js app router
│   ├── app/               # Main application pages
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── TokenSelector/     # Token selection interface
│   ├── ActivitiesModal/   # Wallet activity modal
│   ├── Buttons/           # Custom button components
│   └── modals/            # Approval and confirmation modals
├── hooks/                 # Custom React hooks
│   ├── approvals/         # Token approval logic
│   ├── balances/          # Balance fetching
│   └── swap/              # Swap execution logic
├── constants/             # Configuration and constants
│   ├── abi/              # Smart contract ABIs
│   ├── contractAddress/  # Contract addresses
│   └── theme.ts          # UI theme configuration
├── lib/                   # Utility libraries
├── utils/                 # Helper functions
├── views/                 # Page components
└── scripts/               # Development scripts
    └── setup-git-hooks.js # Git hooks setup
```

### **Key Components**

#### **TokenSelector**

- Interactive token selection interface
- Grid and list view modes
- Real-time balance updates
- Batch selection capabilities

#### **SweepWidget**

- Main application interface
- Wallet connection handling
- Token approval management
- Swap execution flow

#### **ApprovalModal**

- Token approval interface
- Batch approval support
- Individual token approval
- Progress tracking

#### **ConfirmationModal**

- Transaction confirmation
- Liquidity preview
- Slippage settings
- Transaction status

## 🔧 Configuration

### **Customizing the Theme**

Edit `constants/theme.ts` to modify colors, fonts, and styling:

```typescript
export const COLORS = {
  darkBG: "#0A0A0A",
  btnGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  // ... more theme variables
};
```

### **Adding New Networks**

Update `constants/index.ts` to add support for new networks:

```typescript
export enum ChainId {
  ETHEREUM = 1,
  BASE = 8453,
  ARBITRIUM = 42161,
  // Add your network here
}
```

### **Modifying Contract Addresses**

Update contract addresses in `constants/contractAddress/index.ts`:

```typescript
export const assetscooper_contract = "0x...";
export const PARASWAP_TRANSFER_PROXY = "0x...";
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   yarn auto-commit
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### **Code Quality**

- ESLint and Prettier are configured
- TypeScript for type safety
- Conventional commit messages
- Auto-commit system for easy development

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Wagmi](https://wagmi.sh/) for Web3 React hooks
- [Viem](https://viem.sh/) for low-level Ethereum utilities
- [Chakra UI](https://chakra-ui.com/) for the component library
- [Paraswap](https://paraswap.io/) for DEX aggregation
- [Moralis](https://moralis.io/) for blockchain data
- [Covalent](https://www.covalenthq.com/) for token data

## 📞 Support

- **Documentation**: [docs.assetscooper.xyz](https://docs.assetscooper.xyz)
- **Discord**: [Join our community](https://discord.gg/your-discord)
- **Twitter**: [@AssetScooper](https://twitter.com/AssetScooper)
- **Email**: support@assetscooper.xyz

## 🔗 Links

- **Live App**: [assetscooper.xyz](https://assetscooper.xyz)
- **Contract**: [BaseScan](https://basescan.org/address/0x02d08eF29d77c793Dd3367fdAD7da325e2c5AEB1)
- **GitHub**: [github.com/your-username/evm-incinerator](https://github.com/your-username/evm-incinerator)

---

**Built with ❤️ for the DeFi community**

_Convert your dust tokens to ETH and clean up your portfolio today!_
