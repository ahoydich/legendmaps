process.env.NODE_ENV = 'test';
process.env.ALLOWED_ORIGINS = 'http://localhost:3000';
process.env.SESSION_SECRET = 'test_secret';
process.env.IS_SECURE = 'false';

jest.mock('discord.js', () => {
  const actual = jest.requireActual('discord.js');
  class MockClient {
    constructor() { this.guilds = { cache: new Map() }; }
    once() {}
    login() { return Promise.resolve('ok'); }
  }
  return { ...actual, Client: MockClient, Intents: { FLAGS: { GUILDS: 1, GUILD_MEMBERS: 2 } } };
});

jest.mock('./src/game_engine/effect/conditionManager', () => {
  return {
    __esModule: true,
    default: { instance: { HasCondition: () => false } },
  };
});