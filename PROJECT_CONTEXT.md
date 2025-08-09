## Legend Maps – Project Context

### Overview
Legend Maps is a web-based, turn-based roguelike dungeon crawler with Web3 integrations. Dungeon maps were minted as NFTs, and a secondary Adventurers NFT collection exists. The game runs as a client-server architecture with an authoritative backend handling all gameplay, and a React/Next.js frontend rendering the game with Phaser.

### Monorepo Layout
- `legendmaps_client_and_site/`: Next.js frontend (website + game client)
- `legendmaps_backend/`: Node/Express backend (REST + WebSocket + authoritative game engine)

### Tech Stack
- **Frontend**: Next.js 12, React 17, styled-components, MobX, React Query, RainbowKit + wagmi (ethers v5), Phaser 3
- **Backend**: Node.js, Express, ws (WebSocket), Sequelize (PostgreSQL), express-session (+ connect-session-sequelize), Joi validation
- **Web3**: Ethers v5, SIWE (Sign-In With Ethereum) via RainbowKit adapter, contract ABIs for on-chain reads/writes
- **Data**: PostgreSQL (Sequelize models)
- **Infra/Tooling**: TypeScript end-to-end, Sentry hooks, dotenv, nodemon/ts-node

### Key Features
- Authoritative server-side game engine: all map generation, turns, combat, and state are computed on the backend.
- Real-time gameplay via WebSockets: client sends input; server returns validated turn updates.
- Web3 login with SIWE; session stored server-side via cookies.
- NFT integration: Legend Maps (maps) and Adventurers collections; ownership-gated gameplay and campaign creation.
- Rewards/Powerups via contracts (LegendCoin/Powerups) with EIP-712 signatures.

### Game Architecture (High-Level)
- Client renders game using Phaser; processes turn update events from the server.
- WebSocket protocol: client connects to backend `WS_URL`, sends commands, receives `M_Game` updates describing map, entities, and events.
- Backend `game_engine` computes the single source of truth and serializes updates for the client.
- REST endpoints handle session/campaign lifecycle, map options, rewards, and user data.

### Web3 Architecture (High-Level)
- SIWE flow: frontend requests nonce → user signs SIWE message → backend verifies and stores session (`lm-session` cookie) → subsequent REST and WebSocket upgrade gates on this session.
- Contracts used for:
  - Ownership checks of Adventurers/Maps
  - Powerups and token-based operations (LegendCoin)

### Run/Develop
- Start backend and frontend separately.
- Default local ports: frontend at 3000, backend at 8000.
- Frontend configuration: `legendmaps_client_and_site/src/settings.js` maps `APP_ENV` to `API_URL` and `WS_URL`.
- Backend configuration: `.env` variables (see below) and session/DB setup in `legendmaps_backend/src/index.ts` and `legendmaps_backend/src/db.ts`.

### Environment Variables (non-exhaustive)
Backend (`legendmaps_backend/.env`):
- `PORT=8000`
- DB: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `DB_USER` (legacy), `DB_PASSWORD` (dup), `SSL` implied true
- Sessions: `SESSION_SECRET`, `IS_SECURE` ("true" to set SameSite=None; secure cookies)
- Providers: `SERVER_PROVIDER_URL` (Ethereum RPC), `POLYGON_RPC_URL` (for token/powerups)
- Contracts: `TOKEN_CONTRACT_ADDRESS`, `POWERUP_CONTRACT_ADDRESS`, `TOKEN_CONTRACT_CHAIN_ID`, `CONTRACT_PRIVATE_KEY`
- SIWE/debug: `DEBUGGING_GAME`, `GAME_DEBUG_ADDRESS`
- Discord bot optional: `BOT_TOKEN`, `GUILD_ID`, `ROLE_ID`

Frontend (`legendmaps_client_and_site` env):
- `NEXT_PUBLIC_APP_ENV` (maps to urls in `src/settings.js`)
- `INFURA_ID`, optional `ENV_API_URL`, `POLYGON_RPC_URL`, `TOKEN_CONTRACT_CHAIN_ID`, `TOKEN_CONTRACT_ADDRESS`, `POWERUP_CONTRACT_ADDRESS`

### Primary Endpoints
- REST base: `${API_URL}` from `src/settings.js`
  - Auth: `/auth/nonce`, `/auth` (SIWE verify), `/auth/logout`
  - Users: `/users/me`, `/users/refresh-owned`, `/users/:userId/discord`
  - Game: `/game/campaign/:userId`, `/game/create/:userId`, `/game/session/create/:userId`, `/game/session/:userId`, `/game/session/end`, `/game/mapOptions`, `/game/campaign/levelup`, reward endpoints
- WebSocket: `${WS_URL}` (see `src/game/util/websockets.ts`)

### Contracts and Addresses
- Legend Maps (maps): mainnet `0xBFf184118BF575859Dc6A236E8C7C4F80Dc7c25c`
- Adventurers: mainnet `0xCA72feCc4BDb993650654A9881F2Be15a7875796`
- Operator/LegendCoin + Powerups: addresses via backend `settings.ts` and frontend `src/settings.js` (env-configurable)

### Key Files/Dirs (jump-start)
- Frontend
  - `src/util/Providers.tsx`: RainbowKit + SIWE adapter; wagmi chains/providers
  - `src/game/GameRoot` and `src/game/scenes/*`: Phaser scenes and gameplay rendering
  - `src/game/util/websockets.ts`: WebSocket client
  - `src/stores/GameStore.ts`: campaign/session flow and screen transitions
  - `src/util/api/GameApi.ts`: REST calls for game lifecycle
  - `src/settings.js`: all runtime URLs and contract addresses
- Backend
  - `src/index.ts`: Express app, sessions, CORS, WebSocket server, upgrade handling
  - `src/services/*`: REST routes/controllers (`auth`, `users`, `game`, `maps`, `adventurers`)
  - `src/game_engine/*`: core game logic, turn processing, serialization, command processing
  - `src/utils/contractUtils.ts`: contract helpers and addresses
  - `src/db.ts`: Sequelize models and relations

### Useful Links
- Maps collection: `https://opensea.io/collection/legend-maps-founder`
- Adventurers: `https://opensea.io/collection/legend-maps-adventurers`

### Notes
- All gameplay is validated server-side; client is presentation only.
- WebSocket upgrade requires a valid session with `siwe` set; ensure SIWE login before connecting.
- DB tables are auto-synced (`sequelize.sync()`), but you must provision a PostgreSQL database and credentials.