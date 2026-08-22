# HeadlinePulse — 2–3 minute demo script

Team: Qidianyan Tech / yvzhou142857 / GitHub Qidianyan  
Runtime: **~2 minutes 30 seconds** (talk at a steady demo pace)

Use the CLI in one pane and `npm run ui` (phone-width window) in the other. Default path is Shannon **dry-run**.

---

## 0:00–0:20 — Problem

Crypto traders already form a view from headlines — ETF inflows, hacks, SEC delays — then lose the window trying to translate that view into a venue-native order.

DreamDEX Event Contracts already list rolling **BTC / ETH Up-or-Down** books on Somnia. The missing product is a tape reader that speaks **marketId, tick, lot, and on-chain Trading**, not a toy yes/no slider.

## 0:20–0:45 — Solution

**HeadlinePulse** is a news-driven agent plus a mobile Up/Down surface on the real Event Contract CLOB.

- Discover binary windows through `@somnia-chain/markets-sdk` (0.28.1), not the spot HTTP API.
- Gate every write on live on-chain status **Trading (1)**. Skip near-expiry windows.
- Quote Up probabilities in (0, 1). **Down is always 1 − Up**, snapped as integers so 18-decimal venues do not revert.
- Key state by **marketId / symbol**. Pools recycle; we never key a position off a pool address.
- Redeem settled markets from the **Finalized** list. `loadMarkets` has already dropped them.

## 0:45–1:05 — Product

Two surfaces, one mapper:

1. **Agent CLI** — paste a headline, get a sized buy on YES or NO.
2. **Phone UI** — live windows, countdown, giant Up/Down, stake, order-intent receipt.

Dry-run by default. Flip to live on Shannon when you have test STT + TestUSDC.

## 1:05–2:15 — Demonstration

**1:05** Show the UI. BTC 15m and ETH 1h are filled. Prices read as cents of probability.

**1:15** Headline: *“Bitcoin ETF inflows hit a record as BTC breaks out above resistance.”* Tap **Read the tape**. Agent banner: **BTC Up**. Intent: YES symbol, price on tick, quantity on lot, marketId `…00b1`. Locked and dying windows are not selected.

**1:35** Tap **Down**. Receipt flips to the NO tradable at `1 − Up`. Stake stepper resizes on the lot grid.

**1:50** Terminal:

```bash
node src/cli.js --news "Bitcoin ETF inflows hit a record as BTC breaks out above resistance"
```

Same side, marketId, price, size. Run it twice — the primary fields do not drift.

**2:00** Second headline: *“Ethereum faces SEC delay as ETH selloff deepens after a bridge hack.”* Agent buys **Down** on the tradable ETH 1h window, not the 15-second-to-lock print.

**2:10** Mention redeem: winnings live on **Finalized** rows. Scanning the live board reports zero.

## 2:15–2:30 — Future vision

Wire a live news firehose, optional LLM rationale, and a signer so the same intent hits Shannon CLOB. Then: copy-trading a public HeadlinePulse agent, creator-led rooms, and more Event Contract underlyings as DreamDEX lists them.

Close: *The tape is the signal. Event Contracts are the venue. HeadlinePulse is the last mile.*
