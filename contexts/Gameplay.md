## Gameplay

### What the Player Does
- Log in with a wallet (SIWE)
- Select an Adventurer (ownership-verified)
- Start a campaign; if needed, apply a powerup
- Choose a map from available options (gated by ownership/state)
- Play the roguelike dungeon run (turn-based): move, fight, loot, trigger events
- On death or run completion, results are recorded; repeat until the campaign ends

### Key Game Screens (frontend)
- `splash` → `landing` → `adventurer select` → `apply powerup` → `map select` → `gameplay` → `death` or `run complete` → `level up` / `alpha thank you`
- Managed by `legendmaps_client_and_site/src/stores/GameStore.ts` and rendered via `app/components/Game/GameScreens.tsx`

### Session/Campaign Lifecycle (REST)
- Fetch campaign: `GET /api/game/campaign/:userId`
- Create campaign: `POST /api/game/create/:userId` with `{ tokenId, powerupId }`
- Get map options: `GET /api/game/mapOptions`
- Start session: `POST /api/game/session/create/:userId` with `{ tokenId }` (selected map)
- Get session: `GET /api/game/session/:userId`
- End session (run): `POST /api/game/session/end`
- End campaign: `POST /api/game/campaign/end`
- Level up: `POST /api/game/campaign/levelup` with `{ selectedSkill }`

### Real-time Gameplay (WebSocket)
- Client connects to `${WS_URL}` (`legendmaps_client_and_site/src/game/util/websockets.ts`).
- Server upgrades only if `req.session.userId` and `req.session.siwe` are present.
- Messages:
  - Game state: `{"type":"game state","commandMessage":"start"|"debugstart", ...}`
  - Input: `{"type":"input", ...}` handled by server `CommandProcessor`.
- Server responds with messages like `{"message":"game-load","gameData":M_Game}` or `{"message":"client_comm-response","gameData":M_Game}`.

### Turn Processing
- Authoritative engine: `legendmaps_backend/src/game_engine/*`.
- On input, `MessageProcessor.processMessage` → `CommandProcessor.processInput` → applies to `Game` and `Dungeon`.
- `Dungeon.AdvanceTurnClock` iterates entity `TurnClockStep` and increments the game turn; `EndTurnCleanup` runs after each turn.
- Server builds `M_Game` updates containing:
  - Map diff/state
  - Entity list and changes
  - Inventory updates
  - Turn events (combat, move, FX, room events)

### Frontend Rendering
- Phaser scenes (e.g., `GameScene`) consume update queues:
  - `UpdateQueue.ProcessUpdate` applies map/entity/inventory updates and processes `TurnEventQueue`.
  - Events like `PLAYER_MOVE` animate and update UI; map is redrawn, indicators updated, camera centered.
- Networking: `websocketManager.sendInput` sends inputs; `GameStore` coordinates lifecycle and screen transitions.

### Ownership/Progression
- Adventurer ownership validated (on-chain or via DB mirror) before starting a campaign.
- Map options derive from state and ownership.
- Rewards and powerups exist; powerups validated via contract helper (`getHasPowerup`).

### Technical Highlights
- All randomness and map generation run on the backend; client displays authoritative results.
- Server uses Sequelize models (`Campaign`, `GameSession`, `RunRecord`, `LegendMap`, `Adventurer`, etc.) to persist progress.
- WebSocket session is tied to the same cookie-based session created during SIWE login.

### Local Play Notes
- Ensure SIWE auth first; then navigate to `/game`.
- If developing, `DEBUGGING_GAME` can bypass strict checks; see `src/services/users/controller.ts` and `src/index.ts`.
- DB and RPC URLs must be set; without DB the engine will fail to persist sessions.