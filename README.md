# HeadlinePulse

贴一条标题。代理人选 BTC 或 ETH、Up 或 Down，在 **DreamDEX Event Contracts**（Somnia Shannon，`50312`）正在 Trading 的窗口上挂买单。手机宽也能点。

Team: **Qidianyan Tech** / **yvzhou142857** / GitHub **Qidianyan**

Contest: [Somnia × DreamDEX Event Contracts Hackathon](https://dorahacks.io/hackathon/event-contracts)

下单走 `@somnia-chain/markets-sdk` **0.28.1** 的 Event Contract 盘，不走 DreamDEX 现货 `/v0/markets`。

## What it does

1. Reads a headline.
2. Picks BTC or ETH, then **Up** or **Down**.
3. Selects a live binary window that is **on-chain Trading (status = 1)** and not near expiry.
4. Snaps probability prices to the venue tick as **integers** (Down = 1 − Up) and size to the lot grid.
5. Emits a CLOB **buy** intent on the YES or NO tradable. Default path is **dry-run**.

The same mapper powers the CLI agent and the phone UI.

## How to get test STT

Shannon gas token is **STT**. Event Contract collateral on testnet is the faucet **TestUSDC** (6 decimals), not 18-decimal mainnet USDso.

1. Add Somnia Shannon to a wallet: chain id `50312`, RPC `https://api.infra.testnet.somnia.network` (alias `https://dream-rpc.somnia.network`), explorer [shannon-explorer.somnia.network](https://shannon-explorer.somnia.network).
2. Claim STT from any of:
   - [testnet.somnia.network](https://testnet.somnia.network/) (official hub)
   - [Google Cloud Shannon faucet](https://cloud.google.com/application/web3/faucet/somnia/shannon)
   - [Stakely STT faucet](https://stakely.io/faucet/somnia-testnet-stt)
   - [thirdweb Shannon faucet](https://thirdweb.com/somnia-shannon-testnet)
   - Contest Telegram (RULES.md): [t.me/+XHq0F0JXMyhmMzM0](https://t.me/+XHq0F0JXMyhmMzM0) — organizers also send test STT here
3. For Event Contract collateral, after you have STT, run a live SDK faucet from a funded key (`exchange.trader.faucet()` via `@somnia-chain/markets-sdk` on Shannon). BinaryMarketsModule (same address on testnet and mainnet): `0x3ecC694Cef705358864a646142ac17A90E29e388`. Never hardcode a **market or pool** address — pools are recycled across windows; this app keys state by `marketId` / symbol.

## Run

```bash
npm install
npm test
npm run agent -- --news "Bitcoin ETF inflows hit a record as BTC breaks out above resistance"
npm run ui
```

- Agent default: fixture markets + **dry-run** (no RPC, no signer).
- UI: open [http://127.0.0.1:4173/ui/](http://127.0.0.1:4173/ui/) or open `ui/index.html` from disk (`file://` + plain scripts).
- Live discovery (optional): `npm run discover` or `node src/cli.js --discover` — needs Shannon RPC + the DreamDEX indexer. If the network is blocked, keep dry-run.
- Live order (optional): copy `.env.example` to `.env`, set `PRIVATE_KEY`, `DRY_RUN=0`, and pass `--live`. Writes still **gate on on-chain status Trading (1)**.

## Demo

走查：[`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md)。素材：[`demo/`](./demo/)。

## Stack

| Piece | Surface |
| --- | --- |
| Event Contracts | `@somnia-chain/markets-sdk` `SomniaMarkets` / `isBinaryMarket` / `getMarketOnchain` / `createOrder` / `listPastBinaryMarkets({ status: "Finalized" })` |
| Chain | Shannon `50312`, indexer `https://dev.smk.somnia.host/v1/graphql` |
| Agent | `src/cli.js` → `mapNewsToIntent` |
| UI | `ui/index.html` (no bundler, no `type=module`) |
