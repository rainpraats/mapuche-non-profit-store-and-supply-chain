# mapuche-non-profit-store-and-supply-chain

A management application to empower volunteers supporting the oppressed Mapuche indigenous people in Chile. The volunteers operate a non-profit community store that sells food, such as oats, grown by the Mapuche people in exchange for money. The app will digitize supply chain tracking, store inventory management, and membership administration.

## Prerequisites

- Node.js version 24.1.11 or higher
- MongoDB version 8.22 or higher
- Foundry version 1.3.1 or higher

## Setup guide

1. Clone the repository

```bash
git clone https://github.com/rainpraats/mapuche-non-profit-store-and-supply-chain.git
cd mapuche-non-profit-store-and-supply-chain
```

2. Navigate to backend and Install dependencies

```bash
cd backend
npm install
```

3. Deploy the blockchain

```bash
MNEMONIC=$(cast wallet new-mnemonic | sed -n '/Phrase:/,+1p' | tail -n 1)
anvil --base-fee 0 --gas-price 0 --mnemonic "$MNEMONIC" --state ./blockchain/blockchain_state.json
```

4.  Configure environment variables in an .env which you create at the root of your backend, see .env.example for reference.

5.  copy a backend key and save it in your .env

6.  In a new termnal

```bash
cd backend
forge script script/MapucheSupplyChain.s.sol --rpc-url http://127.0.0.1:8545 --broadcast
```

7. Copy the contract address and save it in your .env

8. Run the create admin script

```bash
npm run create-admin
```

9. Start the server

```bash
npm run start
```

10. Start the frontend

```bash
cd ../frontend
npm install
npm run build
npm run preview
```

The app is now available to devices on your local network.

## Technical visualization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MAPUCHE SUPPLY CHAIN & STORE MANAGEMENT                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React + TypeScript)                       │
│                                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────┐  ┌──────────┐  ┌─────────┐ │
│  │    Home     │  │   Orders     │  │  Stock  │  │  Users   │  │ Account │ │
│  └─────────────┘  └──────────────┘  └─────────┘  └──────────┘  └─────────┘ │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │         QR Code & Cart Operations (Purchase Flow)                    │  │
│  │  ┌─────────────────┐  ┌──────────────┐  ┌──────────────────────┐    │  │
│  │  │  Add to Cart    │→ │  Checkout    │→ │ Generate Customer QR │    │  │
│  │  │  (Scan Items)   │  │              │  │ (Display for Vendor) │    │  │
│  │  └─────────────────┘  └──────────────┘  └──────────────────────┘    │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │         Supply Chain Operations Flow                                │  │
│  │  ┌───────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │  │
│  │  │ Validate Ship │→ │ Validate Del │→ │ Validate Purchase        │  │  │
│  │  │ (Supplier)    │  │ (Driver)     │  │ (Volunteer)              │  │  │
│  │  └───────────────┘  └──────────────┘  └──────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
                                    ↕ (REST API)
┌──────────────────────────────────────────────────────────────────────────────┐
│                    BACKEND API SERVER (Express + TypeScript)                 │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Middleware Layer (Security & Logging)                             │   │
│  │  • Helmet (security headers)  • Cors                               │   │
│  │  • Rate Limiting              • XSS/Injection Protection            │   │
│  │  • Logger                     • Body Parser                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Route Handlers & Controllers                                      │   │
│  │                                                                     │   │
│  │  /api/v1/auth     → authController      (Login, Auth)             │   │
│  │  /api/v1/admin    → adminRouter         (User Management)         │   │
│  │  /api/v1/order    → orderController     (Order Management)        │   │
│  │  /api/v1/stock    → stockController     (Inventory)               │   │
│  │  /api/v1/purchase → purchaseController  (Checkout/QR)             │   │
│  │  /api/v1/health   → healthRouter        (Status)                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────┐    │
│  │  Smart Contract Client (ethers.js)                               │    │
│  │  • Reads contract state                                          │    │
│  │  • Submits supply chain transactions                             │    │
│  │  • Maintains blockchain record                                   │    │
│  └───────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────────┘
                                    ↕ (RPC)
┌──────────────────────────────────────────────────────────────────────────────┐
│              BLOCKCHAIN LAYER (Ethereum + Foundry)                          │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  MapucheSupplyChain Smart Contract (Solidity)                      │   │
│  │                                                                     │   │
│  │  • Supply Chain State Management                                   │   │
│  │    - Track orders from supplier → driver → store                    │   │
│  │                                                                     │   │
│  │  • User Management (Hashed identities for privacy)                 │   │
│  │    - Supplier verification                                         │   │
│  │    - Driver validation                                             │   │
│  │    - Customer ID confirmation                                      │   │
│  │                                                                     │   │
│  │  • Inventory Tracking                                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────┐                   ┌─────────────────────────┐    │
│  │   Anvil             │                   │  blockchain_state.json  │    │
│  │                     │ ←→ Persists State →│  (Blockchain snapshot)  │    │
│  │   • Base Fee: 0     │                   │                         │    │
│  │   • Gas Price: 0    │                   │ (Auto-loaded on startup)│    │
│  └──────────────────────┘                   └─────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────────┘
                                    ↕
┌──────────────────────────────────────────────────────────────────────────────┐
│               MongoDB User management keeps track of users                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

### KEY DATA FLOWS

1. SUPPLY CHAIN (Supplier → Delivery → Store):
   Supplier Accepts
   → Driver Picks Up (scan QR)
   → Volunteer Receives (scan QR)
   → Items automatically added to Stock

2. CUSTOMER PURCHASE:
   Customer scans physical item QRs
   → Adds to cart
   → Generates checkout QR
   → Volunteer scans QR + verifies the customers name is the same as their ID card
   → Transaction confirmed
   → Stock updated

3. USER Creation updates both MongoDB and the blockchain
   MongoDB stores actual names, blockchain stores references to the users database id.

4. AUTHENTICATION:
   Username/Password (MongoDB) → JWT Token → Role-based access control
