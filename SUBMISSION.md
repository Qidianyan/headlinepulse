# DoraHacks BUIDL — HeadlinePulse

**Contest:** [Somnia × DreamDEX Event Contracts Hackathon](https://dorahacks.io/hackathon/event-contracts)  
**Team:** Qidianyan Tech / yvzhou142857 / GitHub [Qidianyan/headlinepulse](https://github.com/Qidianyan/headlinepulse)  
**Submission window:** 2026-08-25 to 2026-09-08 (page deadline 2026-09-09 02:00 CST)

## Title

HeadlinePulse — news-driven AI agent + mobile Up/Down UI on DreamDEX Event Contracts

## Tagline

Paste a headline. The agent picks BTC or ETH, Up or Down, and places a tick/lot-snapped CLOB buy on a live Somnia Event Contract window — not a mock book and not the DreamDEX spot HTTP API.

## Description

HeadlinePulse is a working prototype for the Event Contracts track:

1. Discovers binary windows through `@somnia-chain/markets-sdk` **0.28.1** (`isBinaryMarket`, `getMarketOnchain`, `createOrder`, `listPastBinaryMarkets`).
2. Gates writes on on-chain status **Trading (1)** and skips near-expiry windows.
3. Maps news → YES/NO intent with **Down = 1 − Up**, integer ticks, lot grid (18-decimal safe).
4. Keys state by `marketId` / symbol (pools recycle; never key off a pool address).
5. Two surfaces, one mapper: CLI agent + mobile-first Up/Down UI (`ui/index.html`, no bundler).

Default path is Shannon **dry-run**. Live orders need test STT + TestUSDC and `DRY_RUN=0`.

This is an AI trading / news-driven agent the contest explicitly welcomes, plus a consumer UI.

## Demo plan

1. `npm install && npm test` — unit tests for tick/lot, lifecycle, news policy, adapter, UI scripts.
2. `npm run agent -- --news "Bitcoin ETF inflows hit a record as BTC breaks out above resistance"` — dry-run intent receipt.
3. `npm run ui` — phone-width Up/Down surface at http://127.0.0.1:4173/ui/
4. Talk track: [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md) (~2.5 min). Video: [`demo/headlinepulse.mp4`](./demo/headlinepulse.mp4) (150s). Replace with a live UI+agent screen recording if judges want motion.

## Repo layout

- `src/` — CLI, mapper, math, DreamDEX adapter
- `ui/` — mobile Up/Down
- `tests/` — `node --test`
- `DEMO_SCRIPT.md` + `demo/` — video plan

## Track / judging notes

Innovation (news → native Event Contract order), tech (SDK + on-chain Trading gate), UX (mobile Up/Down), ecosystem (Somnia Shannon / DreamDEX), demo (script + UI).
