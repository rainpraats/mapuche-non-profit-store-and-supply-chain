# Docker Setup and Local WiFi Network Access

## Prerequisites

- Docker and Docker Compose installed
- Your `.env` file configured in the backend directory

## Quick Start

### 1. Build and Start Services

```bash
cd /path/to/mapuche-non-profit-store-and-supply-chain
docker-compose up --build
```

Services will start in this order:

- MongoDB (database)
- Blockchain (Anvil)
- Backend API (depends on MongoDB and Blockchain)
- Frontend (depends on Backend)

### 2. Access Your Application

#### From Your Local Machine

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Blockchain RPC**: http://localhost:8545
- **MongoDB**: mongodb://admin:admin@localhost:27017/mapuche

#### From Other Devices on Your WiFi Network

Replace `YOUR_LOCAL_IP` with your machine's local IP address (e.g., `192.168.1.100`)

```bash
# Find your local IP
ip addr show | grep "inet " | grep -v 127.0.0.1
# or
hostname -I
```

- **Frontend**: http://YOUR_LOCAL_IP
- **Backend API**: http://YOUR_LOCAL_IP:3000
- **Blockchain RPC**: http://YOUR_LOCAL_IP:8545

### 3. Update Frontend Configuration (if needed)

If the frontend can't reach the backend from other devices, update the API endpoint in your frontend code to use the host machine's IP instead of localhost.

## Service Details

### Backend API (Port 3000)

- Node.js/TypeScript Express server
- Connects to MongoDB and Blockchain
- Healthcheck enabled

### Frontend (Port 80)

- React/Vite application served via Nginx
- Nginx automatically proxies `/api/*` requests to backend
- SPA routing configured

### MongoDB (Port 27017)

- Credentials: `admin:admin`
- Database: `mapuche`
- Data persisted in Docker volume

### Blockchain/Anvil (Port 8545)

- Local Ethereum-compatible blockchain
- Used for smart contracts testing/deployment

## Environment Variables

Create a `.env` file in the `backend/` directory:

```
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb://admin:admin@mongodb:27017/mapuche?authSource=admin
MONGO_DB_NAME=mapuche
JWT_SECRET=your-secret-key-here
JWT_EXPIRES=7d
RPC_URL=http://blockchain:8545
ANVIL_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb476caded642d0bda9bc9762fb52
CONTRACT_ADDRESS=0x5fbdb2315678afccb333f8a9c1ac1a76ab89476ca9926d00854221cc93f92223
```

## Useful Commands

### Start services

```bash
docker-compose up
```

### Start in background

```bash
docker-compose up -d
```

### View logs

```bash
docker-compose logs -f
```

### View specific service logs

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
docker-compose logs -f blockchain
```

### Stop services

```bash
docker-compose down
```

### Remove volumes (reset database)

```bash
docker-compose down -v
```

### Rebuild containers

```bash
docker-compose up --build
```

### Access MongoDB shell

```bash
docker exec -it mapuche-mongodb mongosh -u admin -p admin
```

## Troubleshooting

### Backend can't connect to MongoDB

- Check MongoDB is healthy: `docker-compose ps`
- Check environment variables in docker-compose.yml

### Frontend can't reach backend API

- Verify backend service is running: `docker-compose logs backend`
- Check that Nginx proxy config includes correct backend hostname
- From other devices, use your machine's IP instead of localhost

### Blockchain not starting

- Check port 8545 isn't in use
- View blockchain logs: `docker-compose logs blockchain`

### Container build fails

- Clear Docker cache: `docker system prune -a`
- Rebuild: `docker-compose up --build`

## Network Architecture

```
┌─────────────────────────────────────────┐
│      Docker Network (mapuche-network)   │
├─────────────────────────────────────────┤
│  ┌──────────────┐   ┌──────────────┐   │
│  │   Frontend   │   │   Backend    │   │
│  │   (Nginx)    │──→│   (Node.js)  │   │
│  │   Port 80    │   │   Port 3000  │   │
│  └──────────────┘   └──────┬───────┘   │
│                             │            │
│       ┌─────────────────────┼───────┐   │
│       ├─────────────────────┼───────┤   │
│       │                     │       │   │
│   ┌───▼──────┐   ┌──────────▼──┐   │   │
│   │ MongoDB  │   │  Blockchain │   │   │
│   │ Port     │   │  (Anvil)    │   │   │
│   │ 27017    │   │  Port 8545  │   │   │
│   └──────────┘   └─────────────┘   │   │
│                                     │   │
└─────────────────────────────────────┘   │
         │                                 │
         └─ Exposed via Ports ───────────→ Host/WiFi
```

## Notes

- All containers communicate via the `mapuche-network` bridge network
- Ports are exposed to allow WiFi network access
- MongoDB data persists in a Docker volume
- Frontend uses Nginx to serve SPA and proxy API requests
