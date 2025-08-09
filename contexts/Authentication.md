## Authentication

### Summary
- Primary auth is Web3-based via SIWE (Sign-In With Ethereum).
- Frontend uses RainbowKit + wagmi to request a nonce, create a SIWE message, and submit the signed message to the backend.
- Backend verifies SIWE message and persists a server-side session (cookie `lm-session`).
- This session is required for all authenticated REST endpoints and to upgrade to the gameplay WebSocket.

### Frontend Flow
- Adapter in `legendmaps_client_and_site/src/util/Providers.tsx` with `createAuthenticationAdapter`:
  - `getNonce`: GET `${API_URL}/auth/nonce` (credentials included)
  - `createMessage`: constructs a `SiweMessage` with domain, address, chainId, uri, nonce, 30-day expiration
  - `getMessageBody`: `message.prepareMessage()`
  - `verify`: POST `${API_URL}/auth` with `{ publicAddress, message: { ...message, signature } }`, credentials included; on success loads user
  - `signOut`: POST `${API_URL}/auth/logout`
- Network config via wagmi/Infura; chains: mainnet + goerli.

### Backend Flow
- Endpoints in `legendmaps_backend/src/services/auth/routes.ts`:
  - `GET /api/auth/nonce` → generates and stores `req.session.nonce`
  - `POST /api/auth` → verifies SIWE message, checks nonce match, stores `userId`, `siwe` payload, `ens`, clears nonce; sets cookie expiration to SIWE expiration
  - `POST /api/auth/logout` → clears session
- Controller logic in `src/services/auth/controller.ts` uses `SiweMessage` validation and ethers provider; requires `SERVER_PROVIDER_URL` and chainId.

### Session and Cookies
- Express session configured in `legendmaps_backend/src/index.ts`:
  - Name: `lm-session`
  - Store: `connect-session-sequelize` backed by Postgres
  - Cookie: httpOnly, `secure` and `sameSite` depend on `IS_SECURE` env, 30 days maxAge
- WebSocket upgrade in `src/index.ts` checks for `req.session.userId` and `req.session.siwe` (unless `DEBUGGING_GAME` is set).

### Web2 Auth
- No username/password flow is implemented for gameplay; all gated features rely on SIWE + sessions.
- There is optional Discord role sync on user route (`PATCH /api/users/:userId/discord`), but it is not an auth method for app sessions.

### User Session Endpoints
- `GET /api/users/me` → returns current user if `req.session.userId` set; otherwise 422
- `POST /api/users/refresh-owned` → refreshes NFT ownership (rate limited to once/day); requires session

### Environment Variables
- `SESSION_SECRET`, `IS_SECURE`
- `SERVER_PROVIDER_URL` (RPC), `TOKEN_CONTRACT_CHAIN_ID`
- `.env` must be present on backend; frontend relies on `NEXT_PUBLIC_APP_ENV` and RPC keys (e.g., `INFURA_ID`).

### Notes
- Ensure frontend requests use `credentials: "include"` to persist the cookie.
- WebSocket connects to `${WS_URL}` and relies on the same session cookie; do not attempt to pass JWTs for socket auth.
- For local dev set `NEXT_PUBLIC_APP_ENV=local`, backend at `http://localhost:8000`, WS at `ws://localhost:8000`.