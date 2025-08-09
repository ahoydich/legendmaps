### Legend Maps Game Codebase

#### Client: 
- Web front end using NextJS
- Client game code using Phaser Game Engine

#### Server:
- Node server for API routes
- Websocket server for game requests
- Authoratative game backend w/ all map generation and gameplay

Server and client need to be started separately, but can easily run on same machine at different ports.

All code on front end and backend is in Typescript. Feel free to reach out to legendmapsnft(at)gmail.com with questions and we can try and provide some guidance.

---

## Local Development (docker-compose)

1. Copy env examples and adjust as needed:
   - `cp .env.example .env` (optional root aggregation)
   - `cp legendmaps_backend/.env.example legendmaps_backend/.env`
   - `cp legendmaps_client_and_site/.env.example legendmaps_client_and_site/.env.local`
2. Start services:
   - `docker compose up --build`
3. Open:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000/api`
   - WebSocket: `ws://localhost:8000`

Notes:
- For SIWE to work in dev, ensure `NEXT_PUBLIC_APP_ENV=local` and CORS `ALLOWED_ORIGINS` include `http://localhost:3000`.
- Backend cookie security: set `IS_SECURE=false` for local; `true` with HTTPS in staging/prod.
