# HeadlinePulse — DoraHacks paste pack

**Contest:** [Somnia × DreamDEX Event Contracts](https://dorahacks.io/hackathon/event-contracts)  
**Team:** Qidianyan Tech / yvzhou142857 / GitHub [Qidianyan/headlinepulse](https://github.com/Qidianyan/headlinepulse)  
**Window:** 2026-08-25 → 2026-09-08

Judges: English below is the BUIDL copy. Do not submit this file as the GitHub repo — the repo is the prototype.

## Paste fields

| Field | Value |
| --- | --- |
| **Project name** | HeadlinePulse |
| **Tagline** | A headline in. An Up or Down buy on a live DreamDEX Event Contract. |
| **GitHub** | https://github.com/Qidianyan/headlinepulse |
| **Demo video** | https://github.com/Qidianyan/headlinepulse/releases/download/demo-2026-08-22/headlinepulse.mp4 |
| **Demo (in-repo)** | `demo/headlinepulse.mp4` (2 min 28 sec) |

**Description (paste):**

HeadlinePulse turns a news headline into a sized Up or Down buy on DreamDEX Event Contracts (Somnia Shannon). A CLI agent and a mobile-first Up/Down UI share one mapper. Discovery, books, place/cancel, and redeem go through `@somnia-chain/markets-sdk` 0.28.1 — not the spot HTTP API. Writes gate on live on-chain status Trading (1), skip near-expiry windows, snap probability prices as integers (Down = 1 − Up), and key state by marketId (pools recycle). Default path is dry-run; live needs test STT + TestUSDC. `npm test && npm run agent && npm run ui`. Video: 2:28 UI walkthrough (ETF tape → Down override → ETH window → SEC-delay headline).

## Problem

Headlines already form a view. The 15-minute BTC/ETH window is gone while a trader hunts units, a pool address, and a book that is still Trading.

## Solution

A tape reader that speaks Event Contract CLOB: **marketId**, tick, lot, on-chain **Trading (1)**. Down is always 1 − Up. Settled payouts are claimed from the **Finalized** list, not the live board.

## Product

1. `npm run agent -- --news "…"` → YES/NO, price, quantity, `marketId`.
2. `npm run ui` → http://127.0.0.1:4173/ui/ (or `file://` `ui/index.html`).

## Demonstration

1. `npm test`
2. `npm run agent -- --news "Bitcoin ETF inflows hit a record as BTC breaks out above resistance"`
3. `npm run ui` — tap Up / Down; receipt fields match the CLI.
4. Watch [headlinepulse.mp4](https://github.com/Qidianyan/headlinepulse/releases/download/demo-2026-08-22/headlinepulse.mp4) (2:28): ETF news → Down → ETH window → SEC-delay headline.

Talk track: [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md). Test STT: see [`README.md`](./README.md).

## Future vision

Live news firehose, optional LLM rationale, and a signer so the same intent hits Shannon CLOB. Then public copy-trading of a HeadlinePulse agent as DreamDEX lists more Event Contract underlyings.

中文一句话（备用）：新闻进门，DreamDEX Event Contract 上出 Up/Down 单。
